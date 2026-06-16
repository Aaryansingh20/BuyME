'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import hero1 from "@/public/images/hero1.jpg"
import hero2 from "@/public/images/hero2.jpg"
import hero3 from "@/public/images/hero3.jpg"
import { featuredProducts } from "@/public/data/shop"

// Hot deals are drawn from the featured catalogue so each one links to its product page.
const hotDeals = featuredProducts.slice(0, 9).map((p) => ({
  ...p,
  originalPrice: p.price * 1.4,
}))

const heroContent = [
  {
    image: hero1,
    title: "Atlier 20% off",
    description: "Experience epic zombie-slaying action in Los Angeles",
    price: "Starting at USD $59.99",
    platforms: ["PS4", "XBOX", "PC"]
  },
  {
    image: hero2,
    title: "Final Sale 20% off",
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring",
    price: "Starting at USD $49.99",
    platforms: ["PS5", "XBOX", "PC"]
  },
  {
    image: hero3,
    title: "Final Sale upto 40% off",
    description: "Become a cyberpunk, an urban mercenary equipped with cybernetic enhancements",
    price: "Starting at USD $39.99",
    platforms: ["PS4", "XBOX", "PC", "STADIA"]
  }
]

export default function MonochromeHeroSectionWithReviews() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroContent.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + heroContent.length) % heroContent.length)
  }

  useEffect(() => {
    const timer = setInterval(nextImage, 5000) // Auto-advance every 5 seconds
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex h-[calc(100vh-64px)] w-full flex-col overflow-hidden bg-black p-4 lg:flex-row lg:space-x-4">
      {/* Hero Section */}
      <motion.div 
        className="relative flex-grow rounded-xl overflow-hidden shadow-2xl"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Image Slider */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentImageIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={heroContent[currentImageIndex].image}
              alt={heroContent[currentImageIndex].title}
              fill
              className="object-cover"
              priority
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button 
          onClick={prevImage} 
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button 
          onClick={nextImage} 
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-6">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Game Logo */}
            <h1 className="mb-2 text-3xl font-bold text-white md:text-4xl lg:text-5xl uppercase tracking-wider">
              {heroContent[currentImageIndex].title}
            </h1>

            {/* Game Description */}
            <p className="mb-4 max-w-xl text-sm text-gray-300 md:text-base uppercase tracking-wider">
              {heroContent[currentImageIndex].description}
            </p>

            {/* Platform Icons */}
            <div className="mb-4 flex gap-2">
              {heroContent[currentImageIndex].platforms.map((platform, index) => (
                <div key={index} className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                  <span className="text-xs font-medium text-white uppercase tracking-wider">{platform}</span>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Button 
                className="bg-white text-black px-6 py-2 text-sm font-semibold hover:bg-gray-200 uppercase tracking-wider transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                Pre-order Now!
              </Button>
              <div className="text-sm font-medium text-white">
                {heroContent[currentImageIndex].price}
              </div>
            </div>
          </motion.div>

          {/* Slide Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {heroContent.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Review Boxes */}
      <motion.div 
        className="w-full bg-zinc-300/10 backdrop-blur-md p-4 rounded-xl lg:w-80 mt-4 lg:mt-0 shadow-xl flex flex-col"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white uppercase tracking-wider">
          <Flame className="h-5 w-5 text-white" />
          Hot Deals
        </h2>
        <div className="space-y-3 flex-grow overflow-auto scrollbar-hide ">
          {hotDeals.map((deal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={`/product/${deal.slug}`}
                className="flex gap-3 bg-zinc-50/5 p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Image
                  src={deal.image}
                  alt={deal.name}
                  width={48}
                  height={48}
                  className="rounded-md object-cover h-12 w-12"
                />
                <div className="flex-grow flex flex-col justify-center min-w-0">
                  <h3 className="text-sm font-medium text-white uppercase tracking-wider truncate">{deal.name}</h3>
                  <div className="flex items-center gap-1 my-0.5">
                    {Array.from({ length: deal.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-white text-white" />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 line-through uppercase tracking-wider">${deal.originalPrice.toFixed(2)}</span>
                    <span className="text-sm font-bold text-white uppercase tracking-wider">${deal.price.toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

