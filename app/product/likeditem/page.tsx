'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, Trash2, Minus, Plus, Info } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Mock data for liked items
const initialLikedItems = [
  { 
    id: 1, 
    name: "Classic White T-Shirt", 
    price: 59.98, 
    image: "/placeholder.svg?height=80&width=80",
    size: "M",
    color: "White",
    quantity: 2,
  },
  { 
    id: 2, 
    name: "Leather Jacket", 
    price: 199.99, 
    image: "/placeholder.svg?height=80&width=80",
    size: "L",
    color: "Black",
    quantity: 1,
  },
  { 
    id: 3, 
    name: "Denim Jeans", 
    price: 59.99, 
    image: "/placeholder.svg?height=80&width=80",
    size: "32",
    color: "Blue",
    quantity: 1,
  },
]

export default function LikedItems() {
  const [likedItems, setLikedItems] = React.useState(initialLikedItems)
  const [discountCode, setDiscountCode] = React.useState('')
  const { toast } = useToast()

  const handleQuantityChange = (id: number, change: number) => {
    setLikedItems(items =>
      items.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    )
  }

  const handleRemoveItem = (id: number) => {
    setLikedItems(items => items.filter(item => item.id !== id))
    toast({
      description: "Item removed from liked items",
    })
  }

  const subTotal = likedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = 32.00 // This would typically be calculated based on the discount code
  const deliveryFee = 10.00
  const total = subTotal - discount + deliveryFee

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 flex items-center">
          <Heart className="mr-2" /> Liked Items
        </h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="space-y-6">
                {likedItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-medium truncate">{item.name}</h2>
                      <p className="text-sm text-zinc-400">
                        Size: {item.size}, Color: {item.color}
                      </p>
                      <div className="flex items-center mt-2">
                        <button 
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="text-zinc-400 hover:text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="mt-2 text-zinc-400 hover:text-white hover:bg-zinc-800"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Remove from liked items</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))}

                {likedItems.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-zinc-400">You haven&apos;t liked any items yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Sub Total</span>
                    <span>${subTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Discount (10%)</span>
                    <span className="text-red-500">-${discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Delivery fee</span>
                    <span>${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-zinc-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  type="text" 
                  placeholder="Discount voucher" 
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white"
                />
                <Button variant="outline" className="border-zinc-800 hover:bg-zinc-800">
                  Apply
                </Button>
              </div>
              <Button className="w-full bg-white text-black hover:bg-zinc-200">
                Checkout Now
              </Button>
            </div>

            <div className="flex items-center justify-center text-sm text-zinc-400">
              <Info className="h-4 w-4 mr-2" />
              <span>90 Day Limited Warranty against manufacturer&apos;s defects</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

