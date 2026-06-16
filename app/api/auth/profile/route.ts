import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"

export const runtime = "nodejs"

export async function PATCH(req: Request) {
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const data: {
    name?: string
    phone?: string | null
    address?: string | null
    avatar?: string | null
    dateOfBirth?: string | null
    gender?: string | null
  } = {}
  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim()
  if (typeof body.phone === "string") data.phone = body.phone.trim() || null
  if (typeof body.address === "string") data.address = body.address.trim() || null
  if (typeof body.avatar === "string") data.avatar = body.avatar || null
  if (typeof body.dateOfBirth === "string") data.dateOfBirth = body.dateOfBirth.trim() || null
  if (typeof body.gender === "string") data.gender = body.gender.trim() || null

  const user = await prisma.user.update({
    where: { id: session.id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      address: true,
      avatar: true,
      dateOfBirth: true,
      gender: true,
      loyaltyPoints: true,
    },
  })

  return NextResponse.json({ user })
}
