import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"

export const runtime = "nodejs"

const sel = { slug: true, name: true, price: true, image: true }

async function wishlistFor(userId: string) {
  return prisma.wishlistItem.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, select: sel })
}

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  return NextResponse.json({ items: await wishlistFor(session.id) })
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

  if (!slug || !name || !Number.isFinite(price)) {
    return NextResponse.json({ error: "Invalid wishlist item" }, { status: 400 })
  }

  await prisma.wishlistItem.upsert({
    where: { userId_slug: { userId: session.id, slug } },
    update: { name, price, image },
    create: { userId: session.id, slug, name, price, image },
  })

  return NextResponse.json({ items: await wishlistFor(session.id) })
}

export async function DELETE(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const slug = new URL(req.url).searchParams.get("slug")
  if (slug) {
    await prisma.wishlistItem.deleteMany({ where: { userId: session.id, slug } })
  } else {
    await prisma.wishlistItem.deleteMany({ where: { userId: session.id } })
  }

  return NextResponse.json({ items: await wishlistFor(session.id) })
}
