'use client'

import { Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from 'next/image'

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
    name: "Black Pantha",
    category: "Jeans",
    price: 36,
    image: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?w=800&q=80"
  },
  {
    id: 2,
    name: "Project 203 STAR",
    category: "Jacket",
    price: 82,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80"
  },
  {
    id: 3,
    name: "Gen-Z GLOBAL",
    category: "Jacket",
    price: 44,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80"
  },
  {
    id: 4,
    name: "Urban Stealth",
    category: "Hoodie",
    price: 65,
    image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800&q=80"
  },
  {
    id: 5,
    name: "Night Rider",
    category: "Jacket",
    price: 95,
    image: "https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=80"
  },
  {
    id: 6,
    name: "Shadow Tech",
    category: "Pants",
    price: 55,
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80"
  },
  {
    id: 7,
    name: "Cyber Deck",
    category: "T-Shirt",
    price: 28,
    image: "https://images.unsplash.com/photo-1583744946564-b52ac1c389c8?w=800&q=80"
  },
  {
    id: 8,
    name: "Matrix Flow",
    category: "Jacket",
    price: 120,
    image: "https://images.unsplash.com/photo-1604644401890-0bd678c83788?w=800&q=80"
  },
  {
    id: 9,
    name: "Digital Nomad",
    category: "Backpack",
    price: 75,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80"
  },
  {
    id: 10,
    name: "Ghost Protocol",
    category: "Sneakers",
    price: 90,
    image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80"
  },
  {
    id: 11,
    name: "Neon Pulse",
    category: "Hoodie",
    price: 70,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80"
  },
  {
    id: 12,
    name: "Binary Code",
    category: "T-Shirt",
    price: 32,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80"
  },
  {
    id: 13,
    name: "Data Stream",
    category: "Pants",
    price: 58,
    image: "https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800&q=80"
  },
  {
    id: 14,
    name: "Quantum Edge",
    category: "Jacket",
    price: 110,
    image: "https://images.unsplash.com/photo-1559582798-678dfc71ccd8?w=800&q=80"
  },
  {
    id: 15,
    name: "Cyber Punk",
    category: "Boots",
    price: 145,
    image: "https://images.unsplash.com/photo-1542327897-4141b355e20e?w=800&q=80"
  },
  {
    id: 16,
    name: "Tech Wear",
    category: "Vest",
    price: 85,
    image: "https://images.unsplash.com/photo-1617952236317-0bd127407984?w=800&q=80"
  }
]

export default function ProductGrid() {
  return (
    <div className="min-h-screen dark bg-background p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">NEW COLLECTION</h1>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-2">OUR BESTSELLER</h2>
          <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            CHECK OUT OUR FULL COLLECTION →
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-card border-none rounded-none overflow-hidden group">
              <CardContent className="p-0 relative aspect-[3/4]">
                <Image
                height={400}
                width={400}
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full brightness-90 group-hover:brightness-100 transition-all"
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-4 right-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Plus className="h-4 w-4" />
                  <span className="sr-only">Add to cart</span>
                </Button>
              </CardContent>
              <CardFooter className="flex justify-between p-4">
                <div>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                  <p className="font-semibold text-foreground">{product.name}</p>
                </div>
                <p className="font-semibold text-foreground">${product.price}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

