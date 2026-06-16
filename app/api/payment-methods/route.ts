import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"

export const runtime = "nodejs"

const sel = { id: true, type: true, last4: true, expiryDate: true, email: true }

async function listFor(userId: string) {
  return prisma.paymentMethod.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: sel,
  })
}

// Keep only digits and cap at 4 — we never store a full card number.
function last4Of(value: unknown): string {
  return typeof value === "string" ? value.replace(/\D/g, "").slice(-4) : ""
}

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  return NextResponse.json({ methods: await listFor(session.id) })
}

export async function POST(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const type = body.type === "PayPal" ? "PayPal" : "Credit Card"

  if (type === "Credit Card") {
    const last4 = last4Of(body.last4)
    const expiryDate = typeof body.expiryDate === "string" ? body.expiryDate.trim() : ""
    if (!last4) return NextResponse.json({ error: "Card number is required" }, { status: 400 })
    await prisma.paymentMethod.create({
      data: { userId: session.id, type, last4, expiryDate },
    })
  } else {
    const email = typeof body.email === "string" ? body.email.trim() : ""
    if (!email) return NextResponse.json({ error: "PayPal email is required" }, { status: 400 })
    await prisma.paymentMethod.create({
      data: { userId: session.id, type, email },
    })
  }

  return NextResponse.json({ methods: await listFor(session.id) })
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

  const id = typeof body.id === "string" ? body.id : ""
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const existing = await prisma.paymentMethod.findFirst({ where: { id, userId: session.id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data: { last4?: string; expiryDate?: string; email?: string } = {}
  if (body.last4 !== undefined) data.last4 = last4Of(body.last4)
  if (typeof body.expiryDate === "string") data.expiryDate = body.expiryDate.trim()
  if (typeof body.email === "string") data.email = body.email.trim()
  await prisma.paymentMethod.update({ where: { id }, data })

  return NextResponse.json({ methods: await listFor(session.id) })
}

export async function DELETE(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.paymentMethod.deleteMany({ where: { id, userId: session.id } })
  return NextResponse.json({ methods: await listFor(session.id) })
}
