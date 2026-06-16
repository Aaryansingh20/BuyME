import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const [totalOrders, productCount, customerCount, revenueAgg, lowStock] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count({ where: { role: "user" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "Cancelled" } } }),
    prisma.product.count({ where: { stock: { lte: 5 } } }),
  ])

  return NextResponse.json({
    totalOrders,
    productCount,
    customerCount,
    revenue: revenueAgg._sum.total ?? 0,
    lowStock,
  })
}
