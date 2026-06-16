"use client"

import { useEffect, useState } from "react"
import { Trash2, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Coupon = {
  id: string
  code: string
  type: string
  value: number
  minSubtotal: number
  maxRedemptions: number | null
  timesUsed: number
  active: boolean
  expiresAt: string | null
}

const emptyForm = { code: "", type: "percent", value: "", minSubtotal: "", maxRedemptions: "", expiresAt: "" }

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...emptyForm })
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  const load = () =>
    fetch("/api/admin/coupons")
      .then((r) => (r.ok ? r.json() : { coupons: [] }))
      .then((d) => setCoupons(d.coupons ?? []))
      .catch(() => {})

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [])

  const create = async () => {
    setError("")
    setCreating(true)
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: form.value,
          minSubtotal: form.minSubtotal || 0,
          maxRedemptions: form.maxRedemptions || null,
          expiresAt: form.expiresAt || null,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? "Could not create coupon")
        return
      }
      setForm({ ...emptyForm })
      await load()
    } finally {
      setCreating(false)
    }
  }

  const toggle = async (c: Coupon) => {
    const res = await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, active: !c.active }),
    })
    if (res.ok) setCoupons((list) => list.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)))
  }

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/coupons?id=${encodeURIComponent(id)}`, { method: "DELETE" })
    if (res.ok) setCoupons((list) => list.filter((x) => x.id !== id))
  }

  const fmtValue = (c: Coupon) => (c.type === "percent" ? `${c.value}%` : `$${c.value.toFixed(2)}`)

  return (
    <>
      <h1 className="text-3xl font-bold uppercase tracking-wider">Coupons</h1>
      <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">{coupons.length} codes</p>

      {/* Create form */}
      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="text-lg font-semibold uppercase tracking-wider">New Coupon</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            placeholder="CODE"
            className="border-white/15 bg-black/40 uppercase text-white placeholder:text-gray-500"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="rounded-md border border-white/15 bg-black/40 px-3 text-sm text-white focus:outline-none"
          >
            <option value="percent" className="bg-black">Percent %</option>
            <option value="fixed" className="bg-black">Fixed $</option>
          </select>
          <Input
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            placeholder="Value"
            inputMode="decimal"
            className="border-white/15 bg-black/40 text-white placeholder:text-gray-500"
          />
          <Input
            value={form.minSubtotal}
            onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })}
            placeholder="Min $"
            inputMode="decimal"
            className="border-white/15 bg-black/40 text-white placeholder:text-gray-500"
          />
          <Input
            value={form.maxRedemptions}
            onChange={(e) => setForm({ ...form, maxRedemptions: e.target.value })}
            placeholder="Max uses"
            inputMode="numeric"
            className="border-white/15 bg-black/40 text-white placeholder:text-gray-500"
          />
          <Input
            type="date"
            value={form.expiresAt}
            onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            className="border-white/15 bg-black/40 text-white"
          />
        </div>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        <Button
          onClick={create}
          disabled={creating || !form.code.trim() || !form.value}
          className="mt-4 h-9 rounded-sm bg-white text-xs uppercase tracking-wider text-black hover:bg-gray-200 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
          {creating ? "Creating…" : "Create coupon"}
        </Button>
      </div>

      {/* List */}
      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Code</TableHead>
              <TableHead className="text-gray-400">Discount</TableHead>
              <TableHead className="text-gray-400">Min</TableHead>
              <TableHead className="text-gray-400">Used</TableHead>
              <TableHead className="text-gray-400">Expires</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-right text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={7} className="py-10 text-center text-gray-500">Loading…</TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={7} className="py-10 text-center text-gray-500">No coupons yet.</TableCell>
              </TableRow>
            ) : (
              coupons.map((c) => (
                <TableRow key={c.id} className="border-white/10 hover:bg-white/[0.02]">
                  <TableCell className="font-mono font-medium text-white">{c.code}</TableCell>
                  <TableCell className="text-gray-300">{fmtValue(c)}</TableCell>
                  <TableCell className="text-gray-400">{c.minSubtotal > 0 ? `$${c.minSubtotal.toFixed(2)}` : "—"}</TableCell>
                  <TableCell className="text-gray-400">
                    {c.timesUsed}
                    {c.maxRedemptions !== null ? ` / ${c.maxRedemptions}` : ""}
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "—"}
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs uppercase tracking-wider ${c.active ? "text-green-400" : "text-gray-500"}`}>
                      {c.active ? "Active" : "Disabled"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggle(c)}
                        className="h-8 rounded-sm border-white/15 bg-transparent text-xs uppercase tracking-wider text-white hover:bg-white/5 hover:text-white"
                      >
                        {c.active ? "Disable" : "Enable"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => remove(c.id)}
                        aria-label="Delete coupon"
                        className="h-8 rounded-sm border-white/15 bg-transparent text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
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
