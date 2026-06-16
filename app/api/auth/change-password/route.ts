import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"
import { verifyPassword, hashPassword } from "@/lib/password"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let currentPassword = ""
  let newPassword = ""
  try {
    const body = await req.json()
    currentPassword = body.currentPassword ?? ""
    newPassword = body.newPassword ?? ""
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Both current and new password are required" }, { status: 400 })
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }
  if (!user.passwordHash) {
    return NextResponse.json(
      { error: "This account signs in with Google, so it has no password to change." },
      { status: 400 }
    )
  }

  const valid = await verifyPassword(currentPassword, user.passwordHash)
  if (!valid) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
  }

  await prisma.user.update({
    where: { id: session.id },
    data: { passwordHash: await hashPassword(newPassword) },
  })

  return NextResponse.json({ ok: true })
}
