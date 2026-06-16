import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"
import { emailStatus, sendTestEmail } from "@/lib/email"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Reports which transport is active so the admin can confirm prod config.
export async function GET() {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard
  return NextResponse.json(emailStatus())
}

// Sends a real test email and surfaces the actual provider error on failure.
export async function POST(req: Request) {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const to = typeof body.to === "string" ? body.to.trim() : ""
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 })
  }

  const result = await sendTestEmail(to)
  if (!result.ok) {
    return NextResponse.json({ error: result.error ?? "Send failed", transport: result.transport }, { status: 502 })
  }
  return NextResponse.json({ ok: true, transport: result.transport })
}
