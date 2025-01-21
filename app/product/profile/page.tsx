"use client"

import { useState } from "react"
import { Bell, CreditCard, Heart, Home, LogOut, Package, Settings, ShoppingBag, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  mockUser,
  mockOrders,
  mockWishlist,
  mockAddresses,
  mockPaymentMethods,
  mockNotifications,
} from "@/public/data/mock"
import { ProfileInfo } from "@/components/ui/profile-info"
import { OrderHistory } from "@/components/ui/order"
import { Wishlist } from "@/components/ui/wishlist"
import { AddressBook } from "@/components/ui/address-book"
import { PaymentMethods } from "@/components/ui/payment"
import { Notifications } from "@/components/ui/notification"
import { SecuritySettings } from "@/components/ui/security"
import Navbar from "@/components/pages/navbar"
import Link from "next/link"
import Footer from "@/components/pages/footer"

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  address: string;
  loyaltyPoints?: number; // Make this optional
};


export default function ProfilePage() {
  const [user, setUser] = useState(mockUser)
  const [activeTab, setActiveTab] = useState("personal-info")

  const sidebarItems = [
    { icon: User, label: "Personal Info", value: "personal-info" },
    { icon: ShoppingBag, label: "Orders", value: "orders" },
    { icon: Heart, label: "Wishlist", value: "wishlist" },
    { icon: Home, label: "Addresses", value: "addresses" },
    { icon: CreditCard, label: "Payment Methods", value: "payment" },
    { icon: Bell, label: "Notifications", value: "notifications" },
    { icon: Settings, label: "Security", value: "security" },
  ]

  return (
    <div className="bg-black text-zinc-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="lg:w-64 shrink-0 bg-zinc-900 border-zinc-800 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-white">Account</CardTitle>
              <CardDescription className="text-zinc-400">Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible scrollbar-hide">
                {sidebarItems.map((item) => (
                  <Button
                    key={item.value}
                    variant={activeTab === item.value ? "secondary" : "ghost"}
                    className={`justify-start h-12 text-left px-4 rounded-none flex-shrink-0 ${activeTab === item.value
                        ? "bg-zinc-800 hover:bg-zinc-800 text-zinc-100"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                      }`}
                    onClick={() => setActiveTab(item.value)}
                  >
                    <item.icon className="mr-2 h-5 w-5" />
                    <span className="hidden lg:inline">{item.label}</span>
                  </Button>
                ))}
              </nav>
            </CardContent>
            <Separator className="my-2 bg-zinc-800" />
            <Button
              variant="ghost"
              className="justify-start h-12 text-left px-4 rounded-none text-red-400 hover:bg-zinc-800 hover:text-red-300"
            >
              <LogOut className="mr-2 h-5 w-5" />
              <span className="hidden lg:inline">Log Out</span>
            </Button>
          </Card>

          <Card className="flex-1 bg-zinc-900 border-zinc-800 shadow-lg overflow-hidden">
            <CardContent className="p-0 h-full">
              <Tabs value={activeTab} className="h-full flex flex-col">
                <TabsList className="hidden">
                  {sidebarItems.map((item) => (
                    <TabsTrigger key={item.value} value={item.value}>
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="flex-1 overflow-y-auto scrollbar-hide p-6">
                  <TabsContent value="personal-info" className="mt-0 h-full">
                    <ProfileInfo user={user} setUser={(updatedUser) => setUser((prev) => ({ ...prev, ...updatedUser }))} />
                  </TabsContent>
                  <TabsContent value="orders" className="mt-0 h-full">
                    <OrderHistory orders={mockOrders} />
                  </TabsContent>
                  <TabsContent value="wishlist" className="mt-0 h-full">
                    <Wishlist items={mockWishlist} />
                  </TabsContent>
                  <TabsContent value="addresses" className="mt-0 h-full">
                    <AddressBook addresses={mockAddresses} />
                  </TabsContent>
                  <TabsContent value="payment" className="mt-0 h-full">
                    <PaymentMethods methods={mockPaymentMethods} />
                  </TabsContent>
                  <TabsContent value="notifications" className="mt-0 h-full">
                    <Notifications notifications={mockNotifications} />
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
      <Footer />
    </div>
  )
}

