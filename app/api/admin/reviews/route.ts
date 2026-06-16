import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const rows = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  })

  const reviews = rows.map((r) => ({
    id: r.id,
    slug: r.slug,
    rating: r.rating,
    comment: r.comment,
    verified: r.verified,
    date: r.createdAt.toISOString().split("T")[0],
    userName: r.user.name || "Anonymous",
    userEmail: r.user.email,
  }))

  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  return NextResponse.json({ reviews, count: reviews.length, average })
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.review.delete({ where: { id } }).catch(() => {})
  return NextResponse.json({ ok: true })
}
