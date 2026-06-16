import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { generateResetToken } from "@/lib/tokens"
import { sendPasswordResetEmail, emailConfigured } from "@/lib/email"
import { rateLimit, clientIp } from "@/lib/rate-limit"
import { getBaseUrl } from "@/lib/url"

export const runtime = "nodejs"

const EXPIRY_MINUTES = 30
// Don't send a second reset email to the same address within this window.
const RESEND_COOLDOWN_MS = 2 * 60 * 1000

export async function POST(req: Request) {
  // Per-IP limit: at most 5 reset requests per 15 minutes from one client.
  const limit = rateLimit(`forgot:${clientIp(req)}`, 5, 15 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    )
  }

  let email = ""
  try {
    const body = await req.json()
    email = (body.email ?? "").trim().toLowerCase()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { email } })
  let devResetUrl: string | undefined

  if (user) {
    // Per-email cooldown: if we issued a token very recently, don't email again.
    // This caps how fast anyone can flood a real user's inbox.
    const recent = await prisma.passwordResetToken.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    })
    if (recent && Date.now() - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
      return NextResponse.json({ ok: true })
    }

    // Invalidate any previous tokens for this email, then issue a fresh one.
    await prisma.passwordResetToken.deleteMany({ where: { email } })
    const { token, tokenHash } = generateResetToken()
    await prisma.passwordResetToken.create({
      data: { email, tokenHash, expiresAt: new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000) },
    })

    // Use the configured production URL (APP_URL) so the link never points at a
    // local/preview origin; falls back to the request origin in local dev.
    const resetUrl = `${getBaseUrl(req.url)}/reset-password?token=${token}`

    let emailSent = false
    try {
      await sendPasswordResetEmail(email, resetUrl)
      emailSent = true
    } catch (err) {
      // Never fail the request over a mail-provider hiccup. The most common case:
      // Resend's sandbox only delivers to your own account email until you verify
      // a domain, so sending to any other address is rejected.
      console.error("[forgot-password] email send failed:", err)
    }

    // In dev/testing, surface the link in-app whenever we couldn't actually
    // deliver it (no provider configured, or the provider rejected the send),
    // so the reset flow is never blocked. Never exposed in production.
    if (process.env.NODE_ENV !== "production" && (!emailConfigured || !emailSent)) {
      devResetUrl = resetUrl
    }
  }

  // Always respond 200 so we never reveal whether an email is registered.
  return NextResponse.json({ ok: true, ...(devResetUrl ? { devResetUrl } : {}) })
}
