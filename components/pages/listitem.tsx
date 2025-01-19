'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from 'next/image'
import { useState } from 'react'

interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
}

const products: Product[] = [
  {
    id: 1,
    name: "Classic White Tee",
    category: "T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
  },
  {
    id: 2,
    name: "Cozy Hoodie",
    category: "Hoodie",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
  },
  {
    id: 3,
    name: "Slim Fit Jeans",
    category: "Jeans",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80"
  },
  {
    id: 4,
    name: "Leather Jacket",
    category: "Jacket",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"
  },
  {
    id: 5,
    name: "Khaki Chinos",
    category: "Pants",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80"
  },
  {
    id: 6,
    name: "Graphic Print Tee",
    category: "T-Shirt",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80"
  },
  {
    id: 7,
    name: "Zip-up Hoodie",
    category: "Hoodie",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80"
  },
  {
    id: 8,
    name: "Distressed Jeans",
    category: "Jeans",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80"
  },
  {
    id: 9,
    name: "Denim Jacket",
    category: "Jacket",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1523205771623-e0faa4d2813d?w=800&q=80"
  },
  {
    id: 10,
    name: "Cargo Pants",
    category: "Pants",
    price: 74.99,
    image: "https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&q=80"
  },
  {
    id: 11,
    name: "Pullover Hoodie",
    category: "Hoodie",
    price: 54.99,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
  },
  {
    id: 12,
    name: "V-Neck Tee",
    category: "T-Shirt",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80"
  }
]

export default function ProductGrid() {
  const [likedProducts, setLikedProducts] = useState<number[]>([])

  const toggleLike = (productId: number) => {
    setLikedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white">FEATURED PRODUCTS</h1>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-2">BEST SELLERS</h2>
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
            VIEW ALL PRODUCTS →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-zinc-900 border-none rounded-none overflow-hidden group">
              <CardContent className="p-0 relative aspect-square">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 ease-in-out group-hover:scale-105"
                />
              </CardContent>
              <CardFooter className="flex items-center justify-between p-4">
                <div>
                  <p className="text-sm text-gray-400">{product.category}</p>
                  <p className="font-semibold text-white">{product.name}</p>
                  <p className="font-semibold text-white mt-1">${product.price.toFixed(2)}</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-zinc-900 text-white hover:bg-zinc-900"
                    onClick={() => toggleLike(product.id)}
                    aria-label={likedProducts.includes(product.id) ? "Unlike" : "Like"}
                  >
                    <Heart className={`h-4 w-4 ${likedProducts.includes(product.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="bg-zinc-900 text-white hover:bg-zinc-900"
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

