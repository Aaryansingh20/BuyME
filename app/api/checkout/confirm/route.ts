import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"
import { stripe } from "@/lib/stripe"
import { commitOrder } from "@/lib/orders"
import { sendOrderConfirmationEmail } from "@/lib/email"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Called by the success page after returning from Stripe. Synchronously verifies
// the payment with Stripe and finalizes the order — so confirmation works even
// without webhook delivery (e.g. local dev), and acts as a safety net otherwise.
export async function POST(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const orderId = typeof body.orderId === "string" ? body.orderId : ""
  if (!orderId) return NextResponse.json({ error: "Missing order id" }, { status: 400 })

  const order = await prisma.order.findFirst({ where: { id: orderId, userId: session.id } })
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 })
  if (order.paymentStatus === "paid") return NextResponse.json({ paid: true })

  // No Stripe (fallback orders are already paid) or no session to check.
  if (!stripe || !order.stripeSessionId) return NextResponse.json({ paid: false })

  let paid = false
  try {
    const checkout = await stripe.checkout.sessions.retrieve(order.stripeSessionId)
    paid = checkout.payment_status === "paid"
  } catch (err) {
    console.error("[checkout confirm] stripe retrieve failed:", err)
    return NextResponse.json({ paid: false })
  }

  if (paid) {
    const result = await commitOrder(orderId)
    if (result?.newlyPaid) {
      sendOrderConfirmationEmail(result.order.user.email, result.order.user.name, result.order).catch((e) =>
        console.error("[checkout confirm] confirmation email failed:", e)
      )
    }
    return NextResponse.json({ paid: true })
  }

  return NextResponse.json({ paid: false })
}
