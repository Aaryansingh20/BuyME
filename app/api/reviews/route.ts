import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"

export const runtime = "nodejs"

type Shaped = {
  id: string
  name: string
  rating: number
  comment: string
  verified: boolean
  date: string
}

async function listFor(slug: string) {
  const rows = await prisma.review.findMany({
    where: { slug },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  })
  const reviews: Shaped[] = rows.map((r) => ({
    id: r.id,
    name: r.user.name || "Anonymous",
    rating: r.rating,
    comment: r.comment,
    verified: r.verified,
    date: r.createdAt.toISOString().split("T")[0],
  }))
  const count = reviews.length
  const average = count === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / count
  return { reviews, count, average }
}

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug")
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 })
  return NextResponse.json(await listFor(slug))
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
  const comment = typeof body.comment === "string" ? body.comment.trim() : ""
  const rating = Math.round(Number(body.rating))

  if (!slug || !comment) {
    return NextResponse.json({ error: "Rating and review text are required" }, { status: 400 })
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
  }

  // "Verified purchase" if the user has an order containing this product.
  const purchased = await prisma.orderItem.findFirst({
    where: { slug, order: { userId: session.id } },
    select: { id: true },
  })

  await prisma.review.upsert({
    where: { userId_slug: { userId: session.id, slug } },
    update: { rating, comment, verified: Boolean(purchased) },
    create: { userId: session.id, slug, rating, comment, verified: Boolean(purchased) },
  })

  return NextResponse.json(await listFor(slug))
}

export async function DELETE(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  const review = await prisma.review.findUnique({ where: { id } })
  if (!review) return NextResponse.json({ error: "Not found" }, { status: 404 })
  // Owner or admin only.
  if (review.userId !== session.id && session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  await prisma.review.delete({ where: { id } })
  return NextResponse.json(await listFor(review.slug))
}
