'use client'

import Image from "next/image"
import { Star, Facebook, Twitter, Youtube, Instagram, Heart, ShoppingCart, CuboidIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FullScreenImage } from "@/components/pages/fullscreen"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/pages/navbar"
import Link from "next/link"

type Size = 's' | 'm' | 'l'
type Category = 'T-Shirts' | 'Jeans' | 'Jackets' | 'Hoodies' | 'Sweaters' | 'Accessories' | 'Activewear' | 'Formal Wear'
type Review = { name: string; rating: number; comment: string }
type Product = { name: string; price: number; image: string }


export default function AtierSale() {
  const [selectedSize, setSelectedSize] = useState<Size>('m')
  const [quantity, setQuantity] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState<Category>('T-Shirts')
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description')
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")
  const [reviews, setReviews] = useState<Review[]>([
    { name: 'John Doe', rating: 5, comment: 'Great product! This clothing item exceeded my expectations. Comfortable and stylish!' },
    { name: 'Jane Smith', rating: 4, comment: 'Excellent quality. The material is top-notch. Definitely worth the price.' }
  ])
  const [newReview, setNewReview] = useState<Review>({ name: '', rating: 5, comment: '' })

  const prices: Record<Size, number> = {
    s: 650.00,
    m: 730.00,
    l: 800.00
  }

  const categories: Category[] = [
    'T-Shirts', 'Jeans', 'Jackets', 'Hoodies', 'Sweaters', 'Accessories', 'Activewear', 'Formal Wear'
  ]

  const productImages = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ]

  const products: Record<Category, Product[]> = {
    'T-Shirts': [
      { name: "Classic T-Shirt", price: 518.00, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Graphic Tee", price: 523.00, image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "V-Neck T-Shirt", price: 528.00, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Long Sleeve Tee", price: 730.00, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
    ],
    'Jeans': [
      { name: "Slim Fit Jeans", price: 618.00, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Bootcut Jeans", price: 623.00, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Skinny Jeans", price: 628.00, image: "https://images.unsplash.com/photo-1475178626620-a4d074967452?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Straight Leg Jeans", price: 830.00, image: "https://images.unsplash.com/photo-1582552938357-32b906df40cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
    ],
    'Jackets': [
      { name: "Leather Jacket", price: 918.00, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Denim Jacket", price: 723.00, image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Bomber Jacket", price: 828.00, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Windbreaker", price: 630.00, image: "https://images.unsplash.com/photo-1547063364-caf7d0be2d48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
    ],
    'Hoodies': [
      { name: "Pullover Hoodie", price: 518.00, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Zip-up Hoodie", price: 523.00, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Oversized Hoodie", price: 528.00, image: "https://images.unsplash.com/photo-1513789181297-6f2ec112c0bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Cropped Hoodie", price: 530.00, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
    ],
    'Sweaters': [
      { name: "Crewneck Sweater", price: 618.00, image: "https://images.unsplash.com/photo-1631541909061-71e349d1f203?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "V-neck Sweater", price: 623.00, image: "https://images.unsplash.com/photo-1638391904459-03e3c5354e9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Cardigan", price: 628.00, image: "https://images.unsplash.com/photo-1434510423563-c7e99bbc5bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Turtleneck Sweater", price: 630.00, image: "https://images.unsplash.com/photo-1608217051404-d33fd4db7627?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
    ],
    'Accessories': [
      { name: "Beanie", price: 218.00, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Scarf", price: 223.00, image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Gloves", price: 228.00, image: "https://images.unsplash.com/photo-1545469006-a78a529ded40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Sunglasses", price: 330.00, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
    ],
    'Activewear': [
      { name: "Running Shorts", price: 418.00, image: "https://images.unsplash.com/photo-1519753136092-dad46d3652b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Yoga Pants", price: 423.00, image: "https://images.unsplash.com/photo-1508985307703-52d13b2b58e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Sports Bra", price: 428.00, image: "https://images.unsplash.com/photo-1571566882372-1598d88abd90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Tank Top", price: 430.00, image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
    ],
    'Formal Wear': [
      { name: "Suit Jacket", price: 1018.00, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Dress Shirt", price: 523.00, image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Dress Pants", price: 628.00, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Tie", price: 230.00, image: "https://images.unsplash.com/photo-1578966356907-e9013ad1b0f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
    ]
  }

  const bestSellers = [
    {
      name: "Slim Fit Jeans",
      price: 519.00,
      rating: 5,
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Cotton Shirt",
      price: 520.00,
      rating: 4,
      image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    },
    {
      name: "Wool Coat",
      price: 718.00,
      rating: 5,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80"
    }
  ]


  
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-zinc-950">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-zinc-400 text-sm mb-8">
          Home / Best Seller / Premium Clothing
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <div className="md:col-span-3 space-y-8">
            <div>
              <h2 className="text-white font-bold mb-4">CATEGORY</h2>
              <ul className="space-y-2 text-zinc-400">
                {categories.map((category) => (
                  <li 
                    key={category}
                    className={`hover:text-white cursor-pointer ${selectedCategory === category ? 'text-white' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-white font-bold mb-4">HOT DEALS</h2>
              <div className="space-y-4">
                {bestSellers.map((product, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-20 h-20 bg-zinc-800 rounded-lg relative">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h3 className="text-white hover:text-white cursor-pointer">{product.name}</h3>
                      <div className="flex gap-1 my-1">
                        {[...Array(product.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-white text-white" />
                        ))}
                      </div>
                      <p className="text-white">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-white font-bold mb-4">SPECIAL OFFER</h2>
              <p className="text-zinc-400 text-sm">
                Get 20% off on all premium clothing items. Limited time offer!
              </p>
            </div>

            <div>
              <h2 className="text-white font-bold mb-4">FREE SHIPPING</h2>
              <p className="text-zinc-400 text-sm">
                Free shipping on all orders over $100
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-9">
            <div className="flex flex-col gap-8">
              {/* Product Images and Info */}
              <div className="flex flex-col md:flex-row gap-8">
                {/* Product Images */}
                <div className="w-full md:w-1/2">
                  <div className="aspect-square relative bg-zinc-800 rounded-lg overflow-hidden group">
                    <Image
                      src={mainImage || "/placeholder.svg"}
                      alt="Premium Clothing"
                      fill
                      className="object-cover"
                    />
                    <button 
                      className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setFullScreenImage(mainImage)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {productImages.map((image, index) => (
                      <button 
                        key={index} 
                        className="aspect-square relative bg-zinc-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-white"
                        onClick={() => setMainImage(image)}
                      >
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Product view ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="w-full md:w-1/2 space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Premium Clothing</h1>
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-white text-white" />
                        ))}
                      </div>
                      <span className="text-2xl font-bold text-white block">${prices[selectedSize].toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-zinc-400 mb-2">Size:</div>
                      <div className="flex gap-3">
                        {['S', 'M', 'L'].map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size.toLowerCase() as Size)}
                            className={`w-10 h-10 rounded-md border flex items-center justify-center
                              ${selectedSize === size.toLowerCase() 
                                ? 'border-white bg-white/20 text-white' 
                                : 'border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-zinc-400 mb-2">Color:</div>
                      <div className="flex gap-3">
                        <button className="w-8 h-8 rounded-md bg-black hover:ring-2 hover:ring-white ring-offset-2 ring-offset-zinc-900" />
                        <button className="w-8 h-8 rounded-md bg-zinc-500 hover:ring-2 hover:ring-white ring-offset-2 ring-offset-zinc-900" />
                        <button className="w-8 h-8 rounded-md bg-white hover:ring-2 hover:ring-zinc-500 ring-offset-2 ring-offset-zinc-900" />
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-zinc-400 mb-2">Quantity:</div>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 rounded-md border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 text-zinc-400"
                        >
                          -
                        </button>
                        <span className="w-12 text-center text-zinc-400">{quantity}</span>
                        <button 
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 rounded-md border border-zinc-700 flex items-center justify-center hover:bg-zinc-800 text-zinc-400"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-zinc-400">Product Type:</div>
                      <div className="text-zinc-200">Premium Clothing</div>
                    </div>

                    <div>
                      <div className="text-sm text-zinc-400">Availability:</div>
                      <div className="text-green-500">Many In Stock</div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      <div className="grid grid-cols-3 gap-3">
                        <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white">
                          <ShoppingCart className="h-5 w-5" />
                        </Button>
                        <Button className="w-full bg-zinc-700 hover:bg-zinc-600 text-white">Buy now</Button>
                        <Button variant="outline" className="w-full">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex justify-center gap-4 pt-4">
                                                <Button variant="ghost" size="icon" className="hover:text-white text-zinc-400">
                          <Facebook className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-white text-zinc-400">
                          <Twitter className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-white text-zinc-400">
                          <Youtube className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:text-white text-zinc-400">
                          <Instagram className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3D Model Button */}
              <div className="w-full flex justify-center">
                <Button 
                  className="w-full md:w-1/2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex items-center justify-center transition-all duration-300 transform hover:scale-105"
                  onClick={() => {/* Add 3D model view logic here */}}
                >
                  <CuboidIcon className="mr-2 h-5 w-5 animate-pulse" />
                  View 3D Model
                </Button>
              </div>

              {/* Tab Sections */}
              <div className="w-full flex flex-col items-center">
                <div className="w-full md:w-2/3 space-y-4">
                  <div className="flex justify-center border-b border-zinc-800 mb-4">
                    <button
                      className={`py-2 px-4 flex-1 text-center ${activeTab === 'description' ? 'text-white border-b-2 border-white' : 'text-zinc-400'}`}
                      onClick={() => setActiveTab('description')}
                    >
                      Product Details
                    </button>
                    <button
                      className={`py-2 px-4 flex-1 text-center ${activeTab === 'reviews' ? 'text-white border-b-2 border-white' : 'text-zinc-400'}`}
                      onClick={() => setActiveTab('reviews')}
                    >
                      Reviews
                    </button>
                    <button
                      className={`py-2 px-4 flex-1 text-center ${activeTab === 'shipping' ? 'text-white border-b-2 border-white' : 'text-zinc-400'}`}
                      onClick={() => setActiveTab('shipping')}
                    >
                      Shipping Details
                    </button>
                  </div>
                  <div className="text-zinc-400 h-64 overflow-y-auto">
                    {activeTab === 'description' && (
                      <div>
                        <p>Experience ultimate comfort and style with our Premium Clothing collection. Made from high-quality materials, this piece features:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                          <li>Premium cotton blend fabric</li>
                          <li>Modern fit and stylish design</li>
                          <li>Durable construction</li>
                          <li>Easy care instructions</li>
                          <li>Available in multiple colors</li>
                        </ul>
                      </div>
                    )}
                    {activeTab === 'reviews' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-white text-white" />
                            ))}
                          </div>
                          <span>4.8 out of 5</span>
                        </div>
                        <p>Based on {reviews.length} reviews</p>
                        <div className="space-y-4">
                          {reviews.map((review, index) => (
                            <div key={index} className="bg-zinc-900 p-4 rounded-lg">
                              <p className="font-semibold text-white">{review.name}</p>
                              <div className="flex gap-1 my-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <p className="text-sm">{review.comment}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2 bg-zinc-900 p-4 rounded-lg">
                          <h3 className="text-white font-semibold">Add Your Review</h3>
                          <Input
                            type="text"
                            placeholder="Your Name"
                            className="w-full bg-zinc-800 text-white"
                            value={newReview.name}
                            onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          />
                          <div className="flex items-center gap-2">
                            <span>Rating:</span>
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                onClick={() => setNewReview({ ...newReview, rating })}
                                className={`w-6 h-6 rounded-full ${newReview.rating >= rating ? 'bg-yellow-400' : 'bg-zinc-700'}`}
                              />
                            ))}
                          </div>
                          <Textarea
                            placeholder="Your Review"
                            className="w-full bg-zinc-800 text-white"
                            value={newReview.comment}
                            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                          />
                          <Button
                            onClick={() => {
                              if (newReview.name && newReview.comment) {
                                setReviews([...reviews, newReview])
                                setNewReview({ name: '', rating: 5, comment: '' })
                              }
                            }}
                            className="w-full bg-zinc-700 hover:bg-zinc-600 text-white"
                          >
                            Submit Review
                          </Button>
                        </div>
                      </div>
                    )}
                    {activeTab === 'shipping' && (
                      <ul className="space-y-2">
                        <li>Free standard shipping on orders over $100</li>
                        <li>Express delivery available (2-3 business days)</li>
                        <li>International shipping available</li>
                        <li>30-day return policy</li>
                        <li>Free returns within the US</li>
                        <li>Expedited shipping options available at checkout</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Related Products */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-6">FROM THIS COLLECTION</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products[selectedCategory]?.map((product, index) => (
                  <div key={index} className="group">
                    <div className="aspect-square relative bg-zinc-800 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <h3 className="text-white font-medium mb-2">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-white">${product.price.toFixed(2)}</span>
                      <Button variant="secondary" size="icon">
                        <ShoppingCart className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {fullScreenImage && (
        <FullScreenImage
          src={fullScreenImage}
          alt="Full-screen product image"
          onClose={() => setFullScreenImage(null)}
        />
      )}
    </div>
    <div className="border-t border-zinc-800">
        <div className="container mx-auto max-w-6xl p-12">
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-mono uppercase text-center">Newsletter</h2>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-400"
              />
              <Button variant="ghost" className="border-zinc-800 text-white border-2 border-b-zinc-800 hover:bg-zinc-800 hover:text-white">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

    <footer className="border-t border-zinc-800">
        <div className="container mx-auto max-w-7xl p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-mono text-white uppercase mb-4">BuyME</h3>
              <p className="text-sm text-zinc-400">We make the difference. Let&apos;s create & make the future together here right now.</p>
            </div>
            <div>
              <h3 className="font-mono text-white uppercase mb-4">Explore</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-white transition-colors">About us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Our brand</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Collection 2023</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-white uppercase mb-4">Visit</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li>Something South Carolina</li>
                <li>5th Avenue, #55582</li>
                <li>Brooklyn, 32</li>
              </ul>
            </div>
            <div>
              <h3 className="font-mono text-white uppercase mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-zinc-400">
                <li><Link href="#" className="hover:text-white transition-colors">Shipping</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Our product</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Reviews</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Returning</Link></li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-800">
            <p className="text-sm text-zinc-400">© BuyME</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

