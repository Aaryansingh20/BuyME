import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Public stock/availability for the storefront. With ?slug= returns one product;
// otherwise returns the full availability map (used by the shop grid).
export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("slug")

  if (slug) {
    const product = await prisma.product.findUnique({
      where: { slug },
      select: { slug: true, stock: true, active: true, price: true },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ product })
  }

  const products = await prisma.product.findMany({
    select: { slug: true, stock: true, active: true },
  })
  return NextResponse.json({ products })
}
