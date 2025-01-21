"use client"

import { useState } from "react"
import Image from "next/image"
import { Minus, Plus, Trash2, Info, ShoppingCartIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Navbar from "@/components/pages/navbar"
import Link from "next/link"

// Initial cart items
const initialCartItems = [
  {
    id: 1,
    name: "Classic White T-Shirt",
    details: "Size: M, Color: White",
    price: 29.99,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    name: "Denim Jeans",
    details: "Size: 32, Color: Blue",
    price: 59.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Leather Jacket",
    details: "Size: L, Color: Black",
    price: 199.99,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
]

// Available products to add
const availableProducts = [
  {
    id: 4,
    name: "Sneakers",
    details: "Size: 10, Color: White",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 5,
    name: "Sunglasses",
    details: "One Size, Color: Black",
    price: 129.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
  },
]

export default function ShoppingCart() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity >= 0) {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
    }
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const addToCart = (product: (typeof availableProducts)[0]) => {
    const existingItem = cartItems.find((item) => item.id === product.id)
    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + 1)
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }])
    }
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold mb-8 tracking-wider">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-zinc-900 border-zinc-800 mb-6">
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="hidden lg:grid lg:grid-cols-12 text-sm text-white tracking-wider">
                      <div className="lg:col-span-6">Product Code</div>
                      <div className="lg:col-span-2 text-center">Quantity</div>
                      <div className="lg:col-span-2 text-center">Total</div>
                      <div className="lg:col-span-2 text-center">Action</div>
                    </div>

                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col lg:grid lg:grid-cols-12 items-center py-4 border-b border-zinc-800"
                      >
                        <div className="w-full lg:col-span-6 flex items-center gap-4 mb-4 lg:mb-0">
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

                        <div className="flex justify-between items-center w-full lg:col-span-6 lg:grid lg:grid-cols-6 gap-4">
                          <div className="lg:col-span-2 flex justify-center">
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

                          <div className="lg:col-span-2 text-center text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>

                          <div className="lg:col-span-2 flex justify-center">
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
                          <ShoppingCartIcon className="h-4 w-4" />
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
                      <span>10 Day Limited Warranty against manufacturer&apos;s defects</span>
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
      {/* Footer */}
      <footer className="border-t text-white  border-zinc-800">
        <div className="container mx-auto max-w-7xl p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-mono uppercase mb-4">BuyME</h3>
              <p className="text-sm text-zinc-400">
                We make the difference. Let&apos;s create & make the future together here right now.
              </p>
            </div>
            <div>
              <h3 className="font-mono uppercase mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Our brand
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Collection 2023
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono uppercase mb-4">Visit</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Something South Carolina</li>
                <li>5th Avenue, #55582</li>
                <li>Brooklyn, 32</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono uppercase mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Shipping
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Our product
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Reviews
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Returning
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-400">© BuyME</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.153-1.772 4.902 4.902 0 01-1.772-1.153c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

