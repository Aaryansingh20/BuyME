"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/cartcontext"
import { useWishlist } from "@/hooks/wishlistcontext"
import { Price } from "@/components/ui/price"

export function Wishlist() {
  const { addToCart } = useCart()
  const { items, remove } = useWishlist()

  return (
    <Card className="bg-white/[0.04] border-white/10">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl uppercase tracking-wider text-white">Wishlist</CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider text-gray-400">
          Items you&apos;ve saved for later
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center text-gray-400">
            <Heart className="h-10 w-10" />
            <p className="mt-4 text-sm uppercase tracking-wider">Your wishlist is empty.</p>
            <Link
              href="/shop"
              className="mt-4 text-sm uppercase tracking-wider text-white underline-offset-4 hover:underline"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div
                key={item.slug}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-white/10 pb-4 last:border-0"
              >
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <Link href={`/product/${item.slug}`} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-zinc-900">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </Link>
                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-medium uppercase tracking-wider text-white hover:underline text-sm sm:text-base"
                    >
                      {item.name}
                    </Link>
                    <Price amount={item.price} className="text-xs sm:text-sm text-gray-400" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <Button
                    onClick={() => addToCart({ slug: item.slug, name: item.name, price: item.price, image: item.image })}
                    className="w-full sm:w-auto rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => remove(item.slug)}
                    className="w-full sm:w-auto rounded-sm border-white/15 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300 uppercase tracking-wider text-xs"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
