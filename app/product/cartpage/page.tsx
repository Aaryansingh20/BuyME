"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import { useCart } from "@/hooks/cartcontext"
import { FREE_SHIPPING_THRESHOLD, computeShipping } from "@/lib/pricing"

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart()

  const shipping = computeShipping(subtotal)
  const total = subtotal + shipping

  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Shopping Cart</h1>

          {items.length === 0 ? (
            <div className="flex flex-col items-center py-24 text-center text-gray-400">
              <ShoppingBag className="h-12 w-12" />
              <p className="mt-4 uppercase tracking-wider">Your cart is empty.</p>
              <Link
                href="/shop"
                className="mt-6 rounded-sm bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-gray-200"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 lg:grid-cols-3">
              {/* Items */}
              <div className="lg:col-span-2">
                <div className="rounded-xl border border-white/10 bg-white/[0.04]">
                  {items.map((item) => (
                    <div
                      key={`${item.slug}-${item.size ?? ""}`}
                      className="flex flex-col gap-4 border-b border-white/10 p-4 last:border-0 sm:flex-row sm:items-center"
                    >
                      <div className="flex flex-1 items-center gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-zinc-900">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/product/${item.slug}`}
                            className="font-medium uppercase tracking-wider text-white hover:underline"
                          >
                            {item.name}
                          </Link>
                          {item.size && (
                            <p className="text-xs uppercase tracking-wider text-gray-400">Size: {item.size}</p>
                          )}
                          <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        {/* Quantity */}
                        <div className="flex items-center rounded-sm border border-white/15">
                          <button
                            onClick={() => updateQuantity(item.slug, item.quantity - 1, item.size)}
                            className="flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:text-white"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm text-white">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.slug, item.quantity + 1, item.size)}
                            className="flex h-8 w-8 items-center justify-center text-gray-400 transition-colors hover:text-white"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <span className="w-20 text-right font-semibold text-white">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.slug, item.size)}
                          className="text-gray-400 transition-colors hover:text-red-400"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-gray-400 transition-colors hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-xs uppercase tracking-wider text-gray-400 transition-colors hover:text-red-400"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
                  <h2 className="text-lg font-bold uppercase tracking-wider">Order Summary</h2>
                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex justify-between text-gray-300">
                      <span className="uppercase tracking-wider">Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span className="uppercase tracking-wider">Shipping</span>
                      <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-xs text-gray-500">
                        Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping.
                      </p>
                    )}
                    <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                      <span className="uppercase tracking-wider">Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="mt-6 flex h-11 w-full items-center justify-center rounded-sm bg-white text-sm font-semibold uppercase tracking-wider text-black transition-colors hover:bg-gray-200"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-16 border-t border-zinc-800 py-16">
          <FooterServices />
        </div>
      </main>
    </>
  )
}
