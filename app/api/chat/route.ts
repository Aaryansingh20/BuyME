import { NextResponse } from "next/server"
import { getSessionUser } from "@/lib/session"
import { rateLimit, clientIp } from "@/lib/rate-limit"
import { buildStoreContext } from "@/lib/chat-context"
import {
  generateReply,
  isChatEnabled,
  ChatQuotaError,
  ChatTimeoutError,
  type ChatMessage,
  type ChatRole,
} from "@/lib/chat"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"
export const maxDuration = 30 // seconds — cap the serverless invocation (Vercel)

const MAX_HISTORY = 12 // turns kept for context (keeps prompts small + cheap)
const MAX_LEN = 1000 // max chars per message
const MAX_MESSAGES = 60 // reject oversized payloads before doing any work

// Abuse limits (in-memory, best-effort — see note at the bottom of this file).
const PER_MIN_LIMIT = 15 // messages/min per IP (burst guard)
const PER_DAY_IP_LIMIT = 200 // messages/day per IP (quota guard)
const PER_DAY_USER_LIMIT = 300 // messages/day per signed-in user
const DAY_MS = 24 * 60 * 60 * 1000

function isMessage(v: unknown): v is ChatMessage {
  if (!v || typeof v !== "object") return false
  const m = v as Record<string, unknown>
  return (m.role === "user" || m.role === "assistant") && typeof m.content === "string"
}

function tooMany(retryAfter: number) {
  return NextResponse.json(
    { error: "You've reached the message limit. Please try again later." },
    { status: 429, headers: { "Retry-After": String(retryAfter) } }
  )
}

export async function POST(req: Request) {
  if (!isChatEnabled()) {
    return NextResponse.json(
      { error: "The assistant isn't configured yet. Set GEMINI_API_KEY to enable it." },
      { status: 503 }
    )
  }

  const ip = clientIp(req)

  // Burst guard: a tight per-minute cap stops rapid-fire spamming.
  const perMin = rateLimit(`chat:min:${ip}`, PER_MIN_LIMIT, 60_000)
  if (!perMin.ok) {
    return NextResponse.json(
      { error: "You're sending messages too quickly. Please wait a moment." },
      { status: 429, headers: { "Retry-After": String(perMin.retryAfter) } }
    )
  }

  // Daily guard: caps total spend/quota a single IP can consume in a day.
  const perDay = rateLimit(`chat:day:${ip}`, PER_DAY_IP_LIMIT, DAY_MS)
  if (!perDay.ok) return tooMany(perDay.retryAfter)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const raw = (body as { messages?: unknown }).messages
  if (!Array.isArray(raw) || raw.length === 0 || !raw.every(isMessage)) {
    return NextResponse.json({ error: "Expected a non-empty 'messages' array" }, { status: 400 })
  }
  if (raw.length > MAX_MESSAGES) {
    return NextResponse.json({ error: "Conversation is too long. Please start a new chat." }, { status: 413 })
  }

  const messages = raw as ChatMessage[]
  const latest = messages[messages.length - 1]!
  if (latest.role !== "user") {
    return NextResponse.json({ error: "The last message must be from the user" }, { status: 400 })
  }
  const message = latest.content.trim().slice(0, MAX_LEN)
  if (!message) {
    return NextResponse.json({ error: "Message is empty" }, { status: 400 })
  }

  // Trim history to the recent turns and cap each message length.
  const history = messages
    .slice(0, -1)
    .slice(-MAX_HISTORY)
    .map((m) => ({ role: m.role as ChatRole, content: m.content.slice(0, MAX_LEN) }))

  const user = await getSessionUser()

  // Per-account daily guard (in addition to per-IP), so one logged-in account
  // can't burn the quota by rotating IPs.
  if (user) {
    const perUser = rateLimit(`chat:day:user:${user.id}`, PER_DAY_USER_LIMIT, DAY_MS)
    if (!perUser.ok) return tooMany(perUser.retryAfter)
  }

  try {
    const storeContext = await buildStoreContext(message, user?.id ?? null)
    const reply = await generateReply(
      { userName: user?.name || null, storeContext },
      history,
      message
    )
    return NextResponse.json({ reply: reply || "Sorry, I didn't catch that — could you rephrase?" })
  } catch (err) {
    if (err instanceof ChatQuotaError) {
      return NextResponse.json(
        { error: "The assistant is over its usage limit right now. Please try again later." },
        { status: 429 }
      )
    }
    if (err instanceof ChatTimeoutError) {
      return NextResponse.json(
        { error: "That took too long to answer. Please try again." },
        { status: 504 }
      )
    }
    console.error("[chat] generation failed:", err)
    return NextResponse.json(
      { error: "The assistant is having trouble right now. Please try again in a moment." },
      { status: 502 }
    )
  }
}

// NOTE: the rate limits above use the in-memory limiter in lib/rate-limit.ts.
// On serverless (Vercel) that state is per-instance and resets on cold start,
// so the daily caps are a strong speed bump but not a hard global guarantee.
// For a hard cross-instance limit, back rateLimit() with a shared store such as
// Upstash Redis (@upstash/ratelimit) — the call sites here would not change.
