"use client"

import { useState } from "react"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useCart } from "@/hooks/cartcontext"
import { shopProducts } from "@/public/data/shop"

interface Order {
  id: string
  fullId: string
  date: string
  items: string[]
  total: number
  status: string
  placedAt: string
  shippedAt: string | null
  deliveredAt: string | null
  trackingNumber: string | null
  carrier: string | null
}

const TRACK_STEPS = ["Processing", "Shipped", "Delivered"] as const

function fmt(at: string | null): string {
  return at ? new Date(at).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : ""
}

type CancelResult = { ok: true } | { ok: false; error: string }

interface OrderHistoryProps {
  orders: Order[]
  onCancel?: (fullId: string, reason: string) => Promise<CancelResult> | void
}

const statusColor: Record<string, string> = {
  Delivered: "text-green-400",
  Shipped: "text-blue-400",
  Processing: "text-yellow-400",
  Cancelled: "text-red-400",
}

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Found a better price elsewhere",
  "No longer needed",
  "Delivery is taking too long",
  "Other",
]

export function OrderHistory({ orders, onCancel }: OrderHistoryProps) {
  const { addToCart } = useCart()
  const [trackingId, setTrackingId] = useState<string | null>(null)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const [reason, setReason] = useState("")
  const [note, setNote] = useState("")
  const [cancelling, setCancelling] = useState<string | null>(null)
  const [cancelError, setCancelError] = useState<Record<string, string>>({})

  const reorder = (items: string[]) => {
    items.forEach((name) => {
      const product = shopProducts.find((p) => p.name === name)
      if (product) {
        addToCart({ slug: product.slug, name: product.name, price: product.price, image: product.image })
      }
    })
  }

  const openCancel = (order: Order) => {
    setCancelingId(order.fullId)
    setReason("")
    setNote("")
    setCancelError((e) => ({ ...e, [order.fullId]: "" }))
  }

  const submitCancel = async (order: Order) => {
    if (!onCancel) return
    const finalReason = reason === "Other" ? note.trim() : reason
    if (!finalReason) {
      setCancelError((e) => ({
        ...e,
        [order.fullId]: reason === "Other" ? "Please add a short note." : "Please pick a reason.",
      }))
      return
    }
    setCancelError((e) => ({ ...e, [order.fullId]: "" }))
    setCancelling(order.fullId)
    try {
      const result = await onCancel(order.fullId, finalReason)
      if (result && !result.ok) {
        setCancelError((e) => ({ ...e, [order.fullId]: result.error }))
      } else {
        setCancelingId(null) // success — parent refreshes the list
      }
    } finally {
      setCancelling(null)
    }
  }

  return (
    <Card className="bg-white/[0.04] border-white/10">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl uppercase tracking-wider text-white">Order History</CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider text-gray-400">
          View your past orders and their status
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center text-gray-400">
            <Package className="h-10 w-10" />
            <p className="mt-4 text-sm uppercase tracking-wider">You have no orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: Order) => (
              <div key={order.id} className="border-b border-white/10 pb-4 last:border-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="flex items-start sm:items-center space-x-4 mb-4 sm:mb-0">
                    <div className="bg-white/5 p-3 rounded-full">
                      <Package className="h-5 w-5 sm:h-6 sm:w-6 text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base uppercase tracking-wider text-white">Order #{order.id}</p>
                      <p className="text-xs sm:text-sm text-gray-400">{order.date}</p>
                      <p className="text-xs sm:text-sm text-gray-400">{order.items.join(", ")}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-medium text-sm sm:text-base text-white">${order.total.toFixed(2)}</p>
                    <p className={`text-xs sm:text-sm uppercase tracking-wider ${statusColor[order.status] ?? "text-gray-400"}`}>
                      {order.status}
                    </p>
                    <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mt-2">
                      {order.status !== "Cancelled" && (
                        <Button
                          size="sm"
                          onClick={() => setTrackingId((id) => (id === order.fullId ? null : order.fullId))}
                          className="w-full sm:w-auto rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs"
                        >
                          {trackingId === order.fullId ? "Hide Tracking" : "Track Order"}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => reorder(order.items)}
                        className="w-full sm:w-auto rounded-sm border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white uppercase tracking-wider text-xs"
                      >
                        Reorder
                      </Button>
                      {onCancel && order.status === "Processing" && cancelingId !== order.fullId && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openCancel(order)}
                          className="w-full sm:w-auto rounded-sm border-white/15 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300 uppercase tracking-wider text-xs"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tracking timeline */}
                {trackingId === order.fullId && order.status !== "Cancelled" && (
                  <div className="mt-4 rounded-lg border border-white/10 bg-zinc-900/50 p-4">
                    {order.carrier || order.trackingNumber ? (
                      <p className="text-xs text-gray-400">
                        {order.carrier && <span className="text-white">{order.carrier}</span>}
                        {order.carrier && order.trackingNumber && " · "}
                        {order.trackingNumber && (
                          <span className="font-mono tracking-wider text-white">{order.trackingNumber}</span>
                        )}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500">
                        Tracking details will appear here once your order ships.
                      </p>
                    )}
                    <ol className="mt-4 space-y-4">
                      {TRACK_STEPS.map((step, i) => {
                        const current = Math.max(0, TRACK_STEPS.indexOf(order.status as (typeof TRACK_STEPS)[number]))
                        const reached = i <= current
                        const at = step === "Processing" ? order.placedAt : step === "Shipped" ? order.shippedAt : order.deliveredAt
                        return (
                          <li key={step} className="flex items-start gap-3">
                            <span
                              className={`mt-1 h-3 w-3 shrink-0 rounded-full ${reached ? "bg-white" : "border border-white/30"}`}
                            />
                            <div>
                              <p className={`text-sm uppercase tracking-wider ${reached ? "text-white" : "text-gray-500"}`}>
                                {step}
                              </p>
                              {reached && at && <p className="text-xs text-gray-500">{fmt(at)}</p>}
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </div>
                )}

                {/* Cancellation reason panel */}
                {cancelingId === order.fullId && (
                  <div className="mt-4 rounded-lg border border-white/10 bg-zinc-900/50 p-4">
                    <p className="text-sm font-medium text-white">Why are you cancelling this order?</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Your items will be restocked and any coupon freed up. Tell us what went wrong so we can improve.
                    </p>
                    <div className="mt-3 space-y-2">
                      {CANCEL_REASONS.map((r) => (
                        <label key={r} className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
                          <input
                            type="radio"
                            name={`reason-${order.fullId}`}
                            checked={reason === r}
                            onChange={() => setReason(r)}
                            className="accent-white"
                          />
                          {r}
                        </label>
                      ))}
                    </div>
                    {reason === "Other" && (
                      <Textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Tell us a bit more…"
                        className="mt-3 min-h-[70px] border-zinc-800 bg-zinc-950 text-white placeholder:text-zinc-600"
                      />
                    )}
                    {cancelError[order.fullId] && (
                      <p className="mt-2 text-xs text-red-400">{cancelError[order.fullId]}</p>
                    )}
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <Button
                        size="sm"
                        onClick={() => submitCancel(order)}
                        disabled={cancelling === order.fullId}
                        className="rounded-sm bg-red-500/90 text-white hover:bg-red-500 uppercase tracking-wider text-xs disabled:opacity-50"
                      >
                        {cancelling === order.fullId ? "Cancelling…" : "Confirm Cancellation"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setCancelingId(null)}
                        className="rounded-sm border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white uppercase tracking-wider text-xs"
                      >
                        Keep Order
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
