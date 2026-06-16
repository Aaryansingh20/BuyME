import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"

export const runtime = "nodejs"

type LineSelect = {
  slug: string
  name: string
  price: number
  image: string
  size: string
  quantity: number
}

const lineSelect = { slug: true, name: true, price: true, image: true, size: true, quantity: true }

async function cartFor(userId: string): Promise<LineSelect[]> {
  return prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: lineSelect,
  })
}

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  return NextResponse.json({ items: await cartFor(session.id) })
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

  const slug = typeof body.slug === "string" ? body.slug : ""
  const name = typeof body.name === "string" ? body.name : ""
  const price = typeof body.price === "number" ? body.price : Number(body.price)
  const image = typeof body.image === "string" ? body.image : ""
  const size = typeof body.size === "string" ? body.size : ""
  const quantity = Number.isFinite(Number(body.quantity)) && Number(body.quantity) > 0 ? Number(body.quantity) : 1

  if (!slug || !name || !Number.isFinite(price)) {
    return NextResponse.json({ error: "Invalid cart item" }, { status: 400 })
  }

  await prisma.cartItem.upsert({
    where: { userId_slug_size: { userId: session.id, slug, size } },
    update: { quantity: { increment: quantity }, name, price, image },
    create: { userId: session.id, slug, name, price, image, size, quantity },
  })

  return NextResponse.json({ items: await cartFor(session.id) })
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

  const slug = typeof body.slug === "string" ? body.slug : ""
  const size = typeof body.size === "string" ? body.size : ""
  const quantity = Number(body.quantity)

  if (!slug || !Number.isFinite(quantity)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (quantity <= 0) {
    await prisma.cartItem.deleteMany({ where: { userId: session.id, slug, size } })
  } else {
    await prisma.cartItem.updateMany({ where: { userId: session.id, slug, size }, data: { quantity } })
  }

  return NextResponse.json({ items: await cartFor(session.id) })
}

export async function DELETE(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const slug = searchParams.get("slug")
  const size = searchParams.get("size") ?? ""

  if (slug) {
    await prisma.cartItem.deleteMany({ where: { userId: session.id, slug, size } })
  } else {
    await prisma.cartItem.deleteMany({ where: { userId: session.id } })
  }

  return NextResponse.json({ items: await cartFor(session.id) })
}
