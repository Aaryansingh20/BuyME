import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashToken } from "@/lib/tokens"
import { hashPassword } from "@/lib/password"

export const runtime = "nodejs"

export async function POST(req: Request) {
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
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
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
