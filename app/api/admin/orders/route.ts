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
  if (!id) return NextResponse.json({ error: "Missing order id" }, { status: 400 })

  const hasStatus = typeof body.status === "string"
  const status = hasStatus ? (body.status as string) : ""
  if (hasStatus && !STATUSES.includes(status as (typeof STATUSES)[number])) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }
  const hasTracking = body.trackingNumber !== undefined || body.carrier !== undefined
  if (!hasStatus && !hasTracking) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
  }

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } })
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Build the update set.
  const data: {
    status?: string
    shippedAt?: Date
    deliveredAt?: Date
    trackingNumber?: string | null
    carrier?: string | null
  } = {}
  if (hasStatus) {
    data.status = status
    // Stamp the timeline the first time each milestone is reached.
    if (status === "Shipped" && !order.shippedAt) data.shippedAt = new Date()
    if (status === "Delivered" && !order.deliveredAt) data.deliveredAt = new Date()
  }
  if (body.trackingNumber !== undefined) {
    const t = typeof body.trackingNumber === "string" ? body.trackingNumber.trim() : ""
    data.trackingNumber = t || null
  }
  if (body.carrier !== undefined) {
    const c = typeof body.carrier === "string" ? body.carrier.trim() : ""
    data.carrier = c || null
  }

  const updated = await prisma.$transaction(async (tx) => {
    // Cancelling (from a non-cancelled state) restocks inventory and frees the coupon.
    if (hasStatus && status === "Cancelled" && order.status !== "Cancelled") {
      await reverseOrderEffects(tx, order)
    }
    const o = await tx.order.update({ where: { id }, data })
    // Notify the customer when the status changes (not for tracking-only edits).
    if (hasStatus && status !== order.status) {
      await tx.notification.create({
        data: {
          userId: o.userId,
          message:
            status === "Shipped" && o.trackingNumber
              ? `Order #${o.id.slice(-6).toUpperCase()} has shipped — tracking ${o.trackingNumber}.`
              : `Order #${o.id.slice(-6).toUpperCase()} is now ${status}.`,
        },
      })
    }
    return o
  })

  return NextResponse.json({ order: updated })
}
