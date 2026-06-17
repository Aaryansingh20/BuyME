"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, Users, ShoppingBag, TrendingUp, AlertTriangle, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { formatMoney, BASE_CURRENCY } from "@/lib/currency"

type Stats = {
  totalOrders: number
  productCount: number
  customerCount: number
  revenue: number
  lowStock: number
}

type EmailInfo = { transport: "smtp" | "resend" | "none"; from: string; configured: boolean }

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const [emailInfo, setEmailInfo] = useState<EmailInfo | null>(null)
  const [testTo, setTestTo] = useState("")
  const [sending, setSending] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false))
    fetch("/api/admin/email")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setEmailInfo(d))
      .catch(() => {})
  }, [])

  const sendTest = async () => {
    setTestResult(null)
    setSending(true)
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: testTo }),
      })
      const data = await res.json().catch(() => ({}))
      setTestResult(
        res.ok
          ? { ok: true, message: `Sent via ${data.transport}. Check the inbox (and spam).` }
          : { ok: false, message: data.error ?? "Send failed" }
      )
    } catch {
      setTestResult({ ok: false, message: "Request failed" })
    } finally {
      setSending(false)
    }
  }

  const transportLabel: Record<string, { text: string; cls: string }> = {
    smtp: { text: "SMTP (delivers to anyone)", cls: "text-green-400" },
    resend: { text: "Resend (sandbox unless domain verified)", cls: "text-amber-400" },
    none: { text: "Not configured (emails won't send)", cls: "text-red-400" },
  }

  const cards = [
    { label: "Total Orders", value: stats ? stats.totalOrders.toLocaleString() : "—", icon: ShoppingBag },
    { label: "Products", value: stats ? stats.productCount.toLocaleString() : "—", icon: Package },
    { label: "Customers", value: stats ? stats.customerCount.toLocaleString() : "—", icon: Users },
    {
      label: "Revenue",
      value: stats ? formatMoney(stats.revenue, BASE_CURRENCY) : "—",
      icon: TrendingUp,
    },
  ]

  return (
    <>
      <h1 className="text-3xl font-bold uppercase tracking-wider">Dashboard</h1>
      <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
        Welcome back, admin. Here is your store at a glance.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-gray-400" />
            <p className="mt-4 text-3xl font-bold text-white">{loading ? "…" : value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-gray-400">{label}</p>
          </div>
        ))}
      </div>

      {stats && stats.lowStock > 0 && (
        <Link
          href="/admin/products"
          className="mt-6 flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-300 transition-colors hover:bg-amber-500/15"
        >
          <AlertTriangle className="h-5 w-5" />
          {stats.lowStock} product{stats.lowStock === 1 ? "" : "s"} low or out of stock — review inventory.
        </Link>
      )}

      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
        <h2 className="flex items-center gap-2 text-lg font-semibold uppercase tracking-wider">
          <Mail className="h-5 w-5" /> Email delivery
        </h2>
        <p className="mt-2 text-sm text-gray-400">
          Active provider:{" "}
          {emailInfo ? (
            <span className={transportLabel[emailInfo.transport]?.cls}>
              {transportLabel[emailInfo.transport]?.text}
            </span>
          ) : (
            "…"
          )}
          {emailInfo?.from && <span className="text-gray-500"> · from {emailInfo.from}</span>}
        </p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            value={testTo}
            onChange={(e) => setTestTo(e.target.value)}
            placeholder="Send a test email to..."
            className="border-white/15 bg-black/40 text-white placeholder:text-gray-500 sm:max-w-xs"
          />
          <Button
            onClick={sendTest}
            disabled={sending || !testTo.trim()}
            className="rounded-sm bg-white text-xs uppercase tracking-wider text-black hover:bg-gray-200 disabled:opacity-40"
          >
            {sending ? "Sending…" : "Send test"}
          </Button>
        </div>
        {testResult && (
          <p className={`mt-3 text-sm ${testResult.ok ? "text-green-400" : "text-red-400"}`}>{testResult.message}</p>
        )}
      </div>

      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-sm">
        <h2 className="text-lg font-semibold uppercase tracking-wider">Quick links</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-sm border border-white/15 px-4 py-2 text-xs uppercase tracking-wider text-gray-200 transition-colors hover:bg-white/5"
          >
            View storefront
          </Link>
          <Link
            href="/admin/products"
            className="rounded-sm border border-white/15 px-4 py-2 text-xs uppercase tracking-wider text-gray-200 transition-colors hover:bg-white/5"
          >
            Manage inventory
          </Link>
          <Link
            href="/admin/orders"
            className="rounded-sm border border-white/15 px-4 py-2 text-xs uppercase tracking-wider text-gray-200 transition-colors hover:bg-white/5"
          >
            Manage orders
          </Link>
          <Link
            href="/admin/reviews"
            className="rounded-sm border border-white/15 px-4 py-2 text-xs uppercase tracking-wider text-gray-200 transition-colors hover:bg-white/5"
          >
            Manage reviews
          </Link>
          <Link
            href="/admin/coupons"
            className="rounded-sm border border-white/15 px-4 py-2 text-xs uppercase tracking-wider text-gray-200 transition-colors hover:bg-white/5"
          >
            Manage coupons
          </Link>
        </div>
      </div>
    </>
  )
}
