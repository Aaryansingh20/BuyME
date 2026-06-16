'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from 'next/image'
import Link from 'next/link'
import { featuredProducts } from "@/public/data/shop"
import { useCart } from "@/hooks/cartcontext"
import { useWishlist } from "@/hooks/wishlistcontext"

export default function ProductGrid() {
  const { addToCart } = useCart()
  const { has, toggle } = useWishlist()

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">FEATURED PRODUCTS</h1>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">BEST SELLERS</h2>
          <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors">
            VIEW ALL PRODUCTS →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.slug} className="bg-zinc-900 border-none rounded-none overflow-hidden group">
              <Link href={`/product/${product.slug}`} className="block">
                <CardContent className="p-0 relative aspect-square">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                  />
                </CardContent>
              </Link>
              <CardFooter className="flex items-center justify-between p-4">
                <Link href={`/product/${product.slug}`} className="min-w-0">
                  <p className="text-sm text-gray-400">{product.category}</p>
                  <p className="font-semibold text-white truncate">{product.name}</p>
                  <p className="font-semibold text-white mt-1">${product.price.toFixed(2)}</p>
                </Link>
                <div className="flex space-x-2 shrink-0">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-zinc-900 text-white hover:bg-zinc-800"
                    onClick={() =>
                      toggle({
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                    }
                    aria-label={has(product.slug) ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart className={`h-4 w-4 ${has(product.slug) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-zinc-900 text-white hover:bg-zinc-800"
                    onClick={() =>
                      addToCart({
                        slug: product.slug,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                    }
                    aria-label="Add to cart"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
