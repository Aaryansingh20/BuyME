import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { reverseOrderEffects } from "@/lib/orders"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"] as const

export async function GET() {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    },
  })
  return NextResponse.json({ orders })
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

  const id = typeof body.id === "string" ? body.id : ""
  const status = typeof body.status === "string" ? body.status : ""
  if (!id || !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid order or status" }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const updated = await prisma.$transaction(async (tx) => {
    // Cancelling (from a non-cancelled state) restocks inventory and frees the coupon.
    if (status === "Cancelled" && order.status !== "Cancelled") {
      await reverseOrderEffects(tx, order)
    }
    const o = await tx.order.update({ where: { id }, data: { status } })
    // Notify the customer of the status change.
    await tx.notification.create({
      data: {
        userId: o.userId,
        message: `Order #${o.id.slice(-6).toUpperCase()} is now ${status}.`,
      },
    })
    return o
  })

  return NextResponse.json({ order: updated })
}
