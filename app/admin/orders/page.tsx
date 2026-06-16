"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type OrderItem = { id: string; name: string; quantity: number }
type Order = {
  id: string
  total: number
  status: string
  createdAt: string
  couponCode: string | null
  shippingAddress: string | null
  paymentLabel: string | null
  items: OrderItem[]
  user: { name: string; email: string }
}

const STATUSES = ["Processing", "Shipped", "Delivered", "Cancelled"]

const statusColor: Record<string, string> = {
  Delivered: "text-green-400",
  Shipped: "text-blue-400",
  Processing: "text-yellow-400",
  Cancelled: "text-red-400",
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/orders")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const revenue = useMemo(
    () => orders.filter((o) => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0),
    [orders]
  )

  const changeStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setOrders((list) => list.map((o) => (o.id === id ? { ...o, status } : o)))
      }
    } finally {
      setUpdating(null)
    }
  }

  return (
    <>
      <h1 className="text-3xl font-bold uppercase tracking-wider">Orders</h1>
      <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
        {orders.length} orders · ${revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} revenue
      </p>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Order</TableHead>
              <TableHead className="text-gray-400">Customer</TableHead>
              <TableHead className="text-gray-400">Items</TableHead>
              <TableHead className="text-gray-400">Total</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                  Loading orders…
                </TableCell>
              </TableRow>
            ) : orders.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                  No orders yet.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((o) => (
                <TableRow key={o.id} className="border-white/10 align-top hover:bg-white/[0.02]">
                  <TableCell className="font-mono text-xs text-white">
                    #{o.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    <div className="text-white">{o.user.name}</div>
                    <div className="text-xs text-gray-500">{o.user.email}</div>
                  </TableCell>
                  <TableCell className="max-w-xs text-xs text-gray-400">
                    {o.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                  </TableCell>
                  <TableCell className="font-semibold text-white">${o.total.toFixed(2)}</TableCell>
                  <TableCell className="text-xs text-gray-400">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <select
                      value={o.status}
                      disabled={updating === o.id}
                      onChange={(e) => changeStatus(o.id, e.target.value)}
                      className={`rounded-sm border border-white/15 bg-black/40 px-2 py-1 text-xs uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-white/30 ${
                        statusColor[o.status] ?? "text-gray-300"
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-black text-white">
                          {s}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
