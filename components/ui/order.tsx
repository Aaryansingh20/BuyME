"use client"

import { useState } from "react"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
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
}

type CancelResult = { ok: true } | { ok: false; error: string }

interface OrderHistoryProps {
  orders: Order[]
  onCancel?: (fullId: string) => Promise<CancelResult> | void
}

const statusColor: Record<string, string> = {
  Delivered: "text-green-400",
  Shipped: "text-blue-400",
  Processing: "text-yellow-400",
  Cancelled: "text-red-400",
}

export function OrderHistory({ orders, onCancel }: OrderHistoryProps) {
  const { addToCart } = useCart()
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

  const handleCancel = async (order: Order) => {
    if (!onCancel) return
    if (!window.confirm("Cancel this order? Items will be restocked.")) return
    setCancelError((e) => ({ ...e, [order.fullId]: "" }))
    setCancelling(order.fullId)
    try {
      const result = await onCancel(order.fullId)
      if (result && !result.ok) {
        setCancelError((e) => ({ ...e, [order.fullId]: result.error }))
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
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 last:border-0"
            >
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
                  <Button
                    size="sm"
                    className="w-full sm:w-auto rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs"
                  >
                    Track Order
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => reorder(order.items)}
                    className="w-full sm:w-auto rounded-sm border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white uppercase tracking-wider text-xs"
                  >
                    Reorder
                  </Button>
                  {onCancel && order.status === "Processing" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCancel(order)}
                      disabled={cancelling === order.fullId}
                      className="w-full sm:w-auto rounded-sm border-white/15 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300 uppercase tracking-wider text-xs disabled:opacity-50"
                    >
                      {cancelling === order.fullId ? "Cancelling..." : "Cancel"}
                    </Button>
                  )}
                </div>
                {cancelError[order.fullId] && (
                  <p className="mt-2 text-xs text-red-400 sm:text-right">{cancelError[order.fullId]}</p>
                )}
              </div>
            </div>
          ))}
        </div>
        )}
      </CardContent>
    </Card>
  )
}
