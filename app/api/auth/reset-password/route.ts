import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashToken } from "@/lib/tokens"
import { hashPassword } from "@/lib/password"
import { rateLimit, clientIp } from "@/lib/rate-limit"

export const runtime = "nodejs"

export async function POST(req: Request) {
  // Per-IP guard so reset tokens can't be brute-forced: 10 attempts / 15 min.
  const limit = rateLimit(`reset:${clientIp(req)}`, 10, 15 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    )
  }

  let token = ""
  let password = ""
  try {
    const body = await req.json()
    token = body.token ?? ""
    password = body.password ?? ""
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!token || !password) {
    return NextResponse.json({ error: "Token and password are required" }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(token) } })
  if (!record || record.expiresAt < new Date()) {
    if (record) {
      await prisma.passwordResetToken.delete({ where: { id: record.id } }).catch(() => {})
    }
    return NextResponse.json({ error: "This reset link is invalid or has expired" }, { status: 400 })
  }

  await prisma.user.update({
    where: { email: record.email },
    data: { passwordHash: await hashPassword(password) },
  })
  // One-time use: remove all reset tokens for this email.
  await prisma.passwordResetToken.deleteMany({ where: { email: record.email } })

  return NextResponse.json({ ok: true })
}
