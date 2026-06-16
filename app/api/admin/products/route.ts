import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const products = await prisma.product.findMany({ orderBy: { name: "asc" } })
  return NextResponse.json({ products })
}

export async function PATCH(req: Request) {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const slug = typeof body.slug === "string" ? body.slug : ""
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 })

  const existing = await prisma.product.findUnique({ where: { slug } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data: { stock?: number; price?: number; active?: boolean } = {}
  if (body.stock !== undefined) {
    const stock = Math.floor(Number(body.stock))
    if (!Number.isFinite(stock) || stock < 0) {
      return NextResponse.json({ error: "Stock must be a non-negative number" }, { status: 400 })
    }
    data.stock = stock
  }
  if (body.price !== undefined) {
    const price = Number(body.price)
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Price must be a non-negative number" }, { status: 400 })
    }
    data.price = price
  }
  if (typeof body.active === "boolean") data.active = body.active

  const product = await prisma.product.update({ where: { slug }, data })
  return NextResponse.json({ product })
}
