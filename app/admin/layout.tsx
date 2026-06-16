"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/coupons", label: "Coupons" },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await fetch("/api/auth/logout", { method: "POST" })
    // Full reload so the cart/session state resets for the next user.
    window.location.assign("/login")
  }

  return (
    <main className="min-h-screen text-white">
      <header className="border-b border-gray-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-2xl font-bold uppercase tracking-[0.3em] text-white">
              BuyME
            </Link>
            <span className="rounded-sm border border-white/20 px-2 py-0.5 text-xs uppercase tracking-wider text-gray-300">
              Admin
            </span>
          </div>
          <Button
            onClick={handleLogout}
            disabled={loading}
            variant="outline"
            className="h-9 rounded-sm border-white/15 bg-transparent text-xs font-medium uppercase tracking-wider text-white hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            {loading ? "Signing out..." : "Sign out"}
          </Button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 px-6">
          {NAV.map((item) => {
            const active = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 px-4 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                  active
                    ? "border-white text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </main>
  )
}
