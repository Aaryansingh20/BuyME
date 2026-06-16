import { NextResponse } from "next/server"
import type Stripe from "stripe"
import { prisma } from "@/lib/prisma"
import { stripe } from "@/lib/stripe"
import { commitOrder } from "@/lib/orders"
import { sendOrderConfirmationEmail } from "@/lib/email"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Stripe calls this to confirm payment. We verify the signature against the raw
// body, then finalize the order (or drop the pending one if the session expired).
export async function POST(req: Request) {
  if (!stripe) return NextResponse.json({ error: "Stripe not configured" }, { status: 400 })
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 400 })

  const sig = req.headers.get("stripe-signature")
  const raw = await req.text()

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig ?? "", webhookSecret)
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const obj = event.data.object as { metadata?: Record<string, string> | null }
  const orderId = obj.metadata?.orderId

  if (event.type === "checkout.session.completed" && orderId) {
    // Idempotent: commits stock/cart/coupon and marks the order paid.
    const result = await commitOrder(orderId)
    if (result?.newlyPaid) {
      const { order } = result
      sendOrderConfirmationEmail(order.user.email, order.user.name, order).catch((e) =>
        console.error("[stripe webhook] confirmation email failed:", e)
      )
    }
  } else if (event.type === "checkout.session.expired" && orderId) {
    // Pending order never committed any inventory — just remove it if still unpaid.
    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (order && order.paymentStatus !== "paid") {
      await prisma.order.delete({ where: { id: orderId } }).catch(() => {})
    }
  }

  return NextResponse.json({ received: true })
}
