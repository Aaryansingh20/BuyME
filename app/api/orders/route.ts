import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"
import { reverseOrderEffects, placeOrderForUser } from "@/lib/orders"
import { sendOrderConfirmationEmail } from "@/lib/email"

export const runtime = "nodejs"

export async function GET() {
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  })

  return NextResponse.json({ orders })
}

// Direct order placement (no Stripe). Used as the fallback when Stripe isn't
// configured. Marks the order paid immediately and emails the confirmation.
export async function POST(req: Request) {
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    // Body is optional — callers may place an order with no checkout selections.
  }

  const result = await placeOrderForUser({
    userId: session.id,
    addressId: typeof body.addressId === "string" ? body.addressId : undefined,
    paymentMethodId: typeof body.paymentMethodId === "string" ? body.paymentMethodId : undefined,
    couponCode: typeof body.couponCode === "string" ? body.couponCode : undefined,
    paymentStatus: "paid",
  })
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }

  // Fire-and-forget confirmation email — never block checkout on mail.
  sendOrderConfirmationEmail(session.email, session.name, result.order).catch((err) =>
    console.error("[orders] confirmation email failed:", err)
  )

  return NextResponse.json({ order: result.order })
}

// Customer-initiated cancellation. Only orders that haven't shipped can be
// cancelled; cancelling restocks inventory and frees the coupon for reuse.
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
  if (!id) return NextResponse.json({ error: "Missing order id" }, { status: 400 })

  // Why the customer is cancelling — stored on the order and shown to admins.
  const rawReason = typeof body.reason === "string" ? body.reason.trim() : ""
  if (!rawReason) {
    return NextResponse.json({ error: "Please tell us why you're cancelling" }, { status: 400 })
  }
  const reason = rawReason.slice(0, 300)

  const order = await prisma.order.findFirst({
    where: { id, userId: session.id },
    include: { items: true },
  })
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  if (order.status === "Cancelled") {
    return NextResponse.json({ error: "This order is already cancelled" }, { status: 400 })
  }
  if (order.status !== "Processing") {
    return NextResponse.json(
      { error: "This order has already shipped and can no longer be cancelled" },
      { status: 400 }
    )
  }

  const updated = await prisma.$transaction(async (tx) => {
    await reverseOrderEffects(tx, order)
    const o = await tx.order.update({ where: { id }, data: { status: "Cancelled", cancelReason: reason } })
    await tx.notification.create({
      data: {
        userId: session.id,
        message: `Order #${o.id.slice(-6).toUpperCase()} was cancelled and any items restocked.`,
      },
    })
    return o
  })

  return NextResponse.json({ order: updated })
}
