"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, Clock } from "lucide-react"
import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import { useCart } from "@/hooks/cartcontext"

type OrderItem = { id: string; name: string; quantity: number; price: number; size: string }
type Order = {
  id: string
  subtotal: number
  shipping: number
  discount: number
  total: number
  couponCode: string | null
  shippingAddress: string | null
  paymentLabel: string | null
  status: string
  paymentStatus: string
  createdAt: string
  items: OrderItem[]
}

function SuccessInner() {
  const params = useSearchParams()
  const id = params.get("id")
  const { reloadCart } = useCart()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) {
      setLoading(false)
      return
    }
    let active = true
    ;(async () => {
      // Confirm payment with Stripe (commits the order if paid). No-op for
      // already-paid / non-Stripe orders.
      await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id }),
      }).catch(() => {})

      const data = await fetch("/api/orders")
        .then((r) => (r.ok ? r.json() : { orders: [] }))
        .catch(() => ({ orders: [] }))
      if (!active) return
      const found: Order | null = (data.orders ?? []).find((o: Order) => o.id === id) ?? null
      setOrder(found)
      if (found?.paymentStatus === "paid") reloadCart() // sync the now-empty cart
      setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [id, reloadCart])

  const paid = order?.paymentStatus === "paid"

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-lg text-center">
        {loading || paid ? (
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-400" />
        ) : (
          <Clock className="mx-auto h-16 w-16 text-amber-400" />
        )}
        <h1 className="mt-6 text-3xl font-bold uppercase tracking-wider">
          {loading ? "Confirming Payment" : paid ? "Order Confirmed" : "Payment Pending"}
        </h1>
        <p className="mt-3 text-sm uppercase tracking-wider text-gray-400">
          {loading
            ? "Please wait while we confirm your payment…"
            : paid
              ? `Thank you for shopping with BuyME.${order ? ` Your order #${order.id.slice(-6).toUpperCase()} is confirmed.` : ""}`
              : "We haven't received your payment yet. If you completed it, refresh this page in a moment."}
        </p>
      </div>

      {loading ? (
        <p className="mt-10 text-center text-sm text-gray-500">Loading your order…</p>
      ) : order ? (
        <div className="mx-auto mt-10 max-w-lg rounded-xl border border-white/10 bg-white/[0.04] p-6">
          <div className="space-y-3 border-b border-white/10 pb-4">
            {order.items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-gray-300">
                  {i.name}
                  {i.size ? ` (${i.size})` : ""} × {i.quantity}
                </span>
                <span className="text-white">${(i.price * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-300">
              <span className="uppercase tracking-wider">Subtotal</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-400">
                <span className="uppercase tracking-wider">Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                <span>−${order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-300">
              <span className="uppercase tracking-wider">Shipping</span>
              <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between border-t border-white/10 pt-2 text-base font-semibold text-white">
              <span className="uppercase tracking-wider">Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
          {(order.shippingAddress || order.paymentLabel) && (
            <div className="mt-4 space-y-1 border-t border-white/10 pt-4 text-xs uppercase tracking-wider text-gray-400">
              {order.shippingAddress && <p>Ship to: {order.shippingAddress}</p>}
              {order.paymentLabel && <p>Paid with: {order.paymentLabel}</p>}
            </div>
          )}
        </div>
      ) : null}

      <div className="mt-10 flex justify-center gap-3">
        <Link
          href="/shop"
          className="rounded-sm bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-gray-200"
        >
          Continue Shopping
        </Link>
        <Link
          href="/product/profile"
          className="rounded-sm border border-white/15 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/5"
        >
          View Orders
        </Link>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white">
        <Suspense fallback={<div className="py-24 text-center text-gray-500">Loading…</div>}>
          <SuccessInner />
        </Suspense>
      </main>
      <FooterServices />
    </>
  )
}
