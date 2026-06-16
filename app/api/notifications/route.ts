import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"

export const runtime = "nodejs"

const sel = { id: true, message: true, read: true, createdAt: true }

async function listFor(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: sel,
  })
}

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  return NextResponse.json({ notifications: await listFor(session.id) })
}

export async function PATCH(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (body.all === true) {
    // Mark every notification read.
    await prisma.notification.updateMany({ where: { userId: session.id }, data: { read: true } })
  } else {
    const id = typeof body.id === "string" ? body.id : ""
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
    const read = typeof body.read === "boolean" ? body.read : true
    await prisma.notification.updateMany({ where: { id, userId: session.id }, data: { read } })
  }

  return NextResponse.json({ notifications: await listFor(session.id) })
}

export async function DELETE(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const id = new URL(req.url).searchParams.get("id")
  if (id) {
    await prisma.notification.deleteMany({ where: { id, userId: session.id } })
  } else {
    await prisma.notification.deleteMany({ where: { userId: session.id } })
  }
  return NextResponse.json({ notifications: await listFor(session.id) })
}
