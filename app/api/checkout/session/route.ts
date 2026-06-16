import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"
import { placeOrderForUser } from "@/lib/orders"
import { stripe, stripeEnabled, STRIPE_CURRENCY, toMinorUnits } from "@/lib/stripe"
import { getBaseUrl } from "@/lib/url"
import { sendOrderConfirmationEmail } from "@/lib/email"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Lets the checkout page know whether real payments are on.
export async function GET() {
  return NextResponse.json({ stripe: stripeEnabled, currency: STRIPE_CURRENCY })
}

export async function POST(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  let body: Record<string, unknown> = {}
  try {
    body = await req.json()
  } catch {
    /* optional body */
  }
  const opts = {
    userId: session.id,
    addressId: typeof body.addressId === "string" ? body.addressId : undefined,
    paymentMethodId: typeof body.paymentMethodId === "string" ? body.paymentMethodId : undefined,
    couponCode: typeof body.couponCode === "string" ? body.couponCode : undefined,
  }

  // --- Stripe path: create a PENDING order (no stock/cart changes yet), then a
  // hosted Checkout Session. Inventory + cart commit only once payment confirms. ---
  if (stripeEnabled && stripe) {
    const result = await placeOrderForUser({
      ...opts,
      status: "Pending",
      paymentStatus: "unpaid",
      commit: false,
    })
    if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status })
    const order = result.order
    const base = getBaseUrl(req.url)
    const orderNo = order.id.slice(-6).toUpperCase()

    try {
      const checkout = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: session.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: STRIPE_CURRENCY,
              // Charge the exact server-computed total (after discount + shipping).
              unit_amount: toMinorUnits(order.total),
              product_data: {
                name: `BuyME Order #${orderNo} (${order.items.length} item${order.items.length === 1 ? "" : "s"})`,
              },
            },
          },
        ],
        success_url: `${base}/checkout/success?id=${order.id}`,
        cancel_url: `${base}/checkout?canceled=1`,
        metadata: { orderId: order.id },
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min hold
      })
      await prisma.order.update({ where: { id: order.id }, data: { stripeSessionId: checkout.id } })
      return NextResponse.json({ url: checkout.url })
    } catch (err) {
      // Couldn't start payment. The order is only a pending record (no stock/cart
      // changes yet), so just delete it.
      console.error("[checkout] stripe session failed:", err)
      await prisma.order.delete({ where: { id: order.id } }).catch(() => {})
      return NextResponse.json({ error: "Payment could not be started. Please try again." }, { status: 502 })
    }
  }

  // --- Fallback (no Stripe configured): place + mark paid + email ---
  const result = await placeOrderForUser({ ...opts, paymentStatus: "paid" })
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: result.status })
  sendOrderConfirmationEmail(session.email, session.name, result.order).catch((err) =>
    console.error("[checkout] confirmation email failed:", err)
  )
  return NextResponse.json({ url: `/checkout/success?id=${result.order.id}` })
}
