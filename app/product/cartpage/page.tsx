'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus, Trash2, Info, ShoppingCartIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Navbar from '@/components/pages/navbar'
import FooterServices from '@/components/pages/footer'

// Initial cart items
const initialCartItems = [
  {
    id: 1,
    name: 'Classic White T-Shirt',
    details: 'Size: M, Color: White',
    price: 29.99,
    quantity: 2,
    image: ''
  },
  {
    id: 2,
    name: 'Denim Jeans',
    details: 'Size: 32, Color: Blue',
    price: 59.99,
    quantity: 1,
    image: ''
  },
  {
    id: 3,
    name: 'Leather Jacket',
    details: 'Size: L, Color: Black',
    price: 199.99,
    quantity: 1,
    image: ''
  }
]

// Available products to add
const availableProducts = [
  {
    id: 4,
    name: 'Sneakers',
    details: 'Size: 10, Color: White',
    price: 89.99,
    image: ''
  },
  {
    id: 5,
    name: 'Sunglasses',
    details: 'One Size, Color: Black',
    price: 129.99,
    image: ''
  }
]

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const addToCart = (product: typeof availableProducts[0]) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div>
    <Navbar/>
    <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8 tracking-wider">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="bg-zinc-900 border-zinc-800 mb-6">
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-12 text-sm text-white tracking-wider">
                    <div className="col-span-6">Product Code</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-center">Total</div>
                    <div className="col-span-2 text-center">Action</div>
                  </div>
                  
                  {cartItems.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 items-center py-4 border-b border-zinc-800">
                      <div className="col-span-6 flex items-center gap-4">
                        <div className="w-20 h-20 bg-zinc-800 rounded-lg overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium tracking-wider text-white">{item.name}</h3>
                          <p className="text-sm text-zinc-400">{item.details}</p>
                        </div>
                      </div>
                      
                      <div className="col-span-2 flex justify-center">
                        <div className="flex items-center border border-zinc-700 rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-white">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-center text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      
                      <div className="col-span-2 flex justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-xl text-white font-semibold mb-4 tracking-wider">Add More Items</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availableProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 border border-zinc-800 rounded-lg">
                      <div className="w-16 h-16 bg-zinc-800 rounded-lg overflow-hidden">
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium text-white">{product.name}</h3>
                        <p className="text-sm text-zinc-400">{product.details}</p>
                        <p className="text-sm text-white">${product.price.toFixed(2)}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 h-8 w-8 rounded-full bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
                        onClick={() => addToCart(product)}
                      >
                  <ShoppingCartIcon className='h-4 w-4'  />
                  </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="font-semibold mb-4 tracking-wider text-white">Order Summary</h2>
                
                <div className="flex items-center gap-2 mb-6">
                  <Input
                    placeholder="Discount voucher"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-zinc-500"
                  />
                  <Button variant="outline" className="shrink-0 border-zinc-700 bg-black text-white">
                    Apply
                  </Button>
                </div>
                
                <div className="space-y-3 text-sm tracking-wider">
                  <div className="flex justify-between text-white">
                    <span>Sub Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white">Discount (10%)</span>
                    <span className="text-red-500">-${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Delivery fee</span>
                    <span>$10.00</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-zinc-800 font-medium text-white">
                    <span>Total</span>
                    <span>${(total * 0.9 + 10).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-zinc-400">
                  <div className="flex items-center gap-2 mb-2">
                    <span>90 Day Limited Warranty against manufacturer&apos;s defects</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-zinc-400 hover:text-white transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Details about warranty coverage</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                
                <Button className="w-full mt-6 bg-white text-black hover:bg-zinc-200 tracking-wider">
                  Checkout Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <FooterServices/>
    </div>
  )
}

