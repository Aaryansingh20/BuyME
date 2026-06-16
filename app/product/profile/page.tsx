"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, CreditCard, Heart, Home, LogOut, Package, Settings, ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type OrderView = { id: string; fullId: string; date: string; items: string[]; total: number; status: string }
import { ProfileInfo } from "@/components/ui/profile-info"
import { OrderHistory } from "@/components/ui/order"
import { Wishlist } from "@/components/ui/wishlist"
import { AddressBook } from "@/components/ui/address-book"
import { PaymentMethods } from "@/components/ui/payment"
import { Notifications } from "@/components/ui/notification"
import { SecuritySettings } from "@/components/ui/security"
import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import Image from "next/image"
import profileBg from "@/public/auth-bg.jpg"

const emptyUser = { name: "", email: "", phone: "", address: "", avatar: "", dateOfBirth: "", gender: "" }

export default function ProfilePage() {
  const [user, setUser] = useState(emptyUser)
  const [orders, setOrders] = useState<OrderView[]>([])
  const [activeTab, setActiveTab] = useState("personal-info")

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get("tab")
    const valid = ["personal-info", "orders", "wishlist", "addresses", "payment", "notifications", "security"]
    if (tab && valid.includes(tab)) setActiveTab(tab)
  }, [])

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          const u = data.user
          setUser({
            name: u.name ?? "",
            email: u.email ?? "",
            phone: u.phone ?? "",
            address: u.address ?? "",
            avatar: u.avatar ?? "",
            dateOfBirth: u.dateOfBirth ?? "",
            gender: u.gender ?? "",
          })
        }
      })
      .catch(() => {})
  }, [])

  const loadOrders = useCallback(() => {
    type ApiOrder = {
      id: string
      createdAt: string
      total: number
      status: string
      items: { name: string }[]
    }
    return fetch("/api/orders")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.orders) {
          setOrders(
            (data.orders as ApiOrder[]).map((o) => ({
              id: o.id.slice(-6).toUpperCase(),
              fullId: o.id,
              date: new Date(o.createdAt).toLocaleDateString(),
              items: o.items.map((i) => i.name),
              total: o.total,
              status: o.status,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    loadOrders()
  }, [loadOrders])

  const cancelOrder = async (fullId: string) => {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: fullId }),
    })
    if (res.ok) {
      await loadOrders()
      return { ok: true as const }
    }
    const data = await res.json().catch(() => ({}))
    return { ok: false as const, error: data.error ?? "Could not cancel order" }
  }

  const updateProfile = async (updated: Partial<typeof emptyUser>) => {
    setUser((prev) => ({ ...prev, ...updated }))
    await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    })
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    // Full reload so the cart/session state resets for the next user.
    window.location.assign("/login")
  }

  const sidebarItems = [
    { icon: User, label: "Personal Info", value: "personal-info" },
    { icon: ShoppingBag, label: "Orders", value: "orders" },
    { icon: Heart, label: "Wishlist", value: "wishlist" },
    { icon: Home, label: "Addresses", value: "addresses" },
    { icon: CreditCard, label: "Payment", value: "payment" },
    { icon: Bell, label: "Notifications", value: "notifications" },
    { icon: Settings, label: "Security", value: "security" },
  ]

  return (
    <div className="relative min-h-screen text-zinc-100">
      {/* Fixed full-bleed wallpaper behind the content (cards stay translucent on top). */}
      <div className="fixed inset-0">
        <Image src={profileBg} alt="" fill priority className="object-cover object-center" />
        {/* Lighter, tinted overlay so the wallpaper shows through with some depth. */}
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-950/50 via-black/35 to-zinc-900/55" />
      </div>

      <div className="relative z-10">
      <Navbar />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[72vh]">
          <Card className="lg:w-64 shrink-0 bg-white/[0.04] border-white/10 lg:flex lg:flex-col lg:h-full">
            <CardHeader>
              <CardTitle className="text-lg uppercase tracking-wider text-white">Account</CardTitle>
              <CardDescription className="text-xs uppercase tracking-wider text-gray-400">
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col">
                <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible scrollbar-hide">
                  {sidebarItems.map((item) => (
                    <Button
                      key={item.value}
                      variant="ghost"
                      className={`justify-start h-12 text-left px-4 rounded-none flex-shrink-0 text-xs uppercase tracking-wider ${
                        activeTab === item.value
                          ? "bg-white/10 text-white hover:bg-white/10"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                      onClick={() => setActiveTab(item.value)}
                    >
                      <item.icon className="mr-2 h-5 w-5" />
                      <span className="hidden lg:inline">{item.label}</span>
                    </Button>
                  ))}
                </div>
                <Separator className="my-2 bg-white/10 lg:hidden" />
                <div className="flex lg:hidden">
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="justify-start h-12 text-left px-4 rounded-none text-xs uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 flex-1"
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    <span>Log Out</span>
                  </Button>
                </div>
              </nav>
            </CardContent>
            <div className="hidden lg:block lg:mt-auto">
              <Separator className="my-2 bg-white/10" />
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="justify-start h-12 text-left px-4 rounded-none text-xs uppercase tracking-wider text-red-400 hover:bg-red-500/10 hover:text-red-300 w-full"
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span>Log Out</span>
              </Button>
            </div>
          </Card>

          <Card className="flex-1 bg-transparent border-none overflow-hidden lg:h-full">
            <CardContent className="p-0 h-full">
              <Tabs value={activeTab} className="h-full flex flex-col">
                <TabsList className="hidden">
                  {sidebarItems.map((item) => (
                    <TabsTrigger key={item.value} value={item.value}>
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="h-[68vh] min-h-[480px] lg:h-full overflow-y-auto scrollbar-hide [&_[role=tabpanel]]:h-full [&_[role=tabpanel]>*]:min-h-full">
                  <TabsContent value="personal-info" className="mt-0 h-full">
                    <ProfileInfo key={user.email || "loading"} user={user} setUser={updateProfile} />
                  </TabsContent>
                  <TabsContent value="orders" className="mt-0 h-full">
                    <OrderHistory orders={orders} onCancel={cancelOrder} />
                  </TabsContent>
                  <TabsContent value="wishlist" className="mt-0 h-full">
                    <Wishlist />
                  </TabsContent>
                  <TabsContent value="addresses" className="mt-0 h-full">
                    <AddressBook />
                  </TabsContent>
                  <TabsContent value="payment" className="mt-0 h-full">
                    <PaymentMethods />
                  </TabsContent>
                  <TabsContent value="notifications" className="mt-0 h-full">
                    <Notifications />
                  </TabsContent>
                  <TabsContent value="security" className="mt-0 h-full">
                    <SecuritySettings />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <FooterServices />
      </div>
    </div>
  )
}

