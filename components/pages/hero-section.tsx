'use client'

import { useState, useEffect } from "react"
import Image, { StaticImageData } from "next/image"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight, Flame } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import hero1 from "@/public/images/hero1.jpg"
import hero2 from "@/public/images/hero2.jpg"
import hero3 from "@/public/images/hero3.jpg"
import hotdeals1 from "@/public/images/hero-section/1.jpg"
import hotdeals2 from "@/public/images/hero-section/2.jpg"
import hotdeals3 from "@/public/images/hero-section/3.jpg"
import hotdeals4 from "@/public/images/hero-section/4.jpg"
import hotdeals5 from "@/public/images/hero-section/5.jpg"
import hotdeals6 from "@/public/images/hero-section/6.jpg"
import hotdeals7 from "@/public/images/hero-section/7.jpg"


interface ReviewGame {
  title: string
  rating: number
  originalPrice: string
  salePrice: string
  image: StaticImageData
}

const reviewGames: ReviewGame[] = [
  { title: "Red Dead Redemption 2", rating: 5, originalPrice: "$59.99", salePrice: "$16.99", image: hotdeals1 },
  { title: "Tiny Tina's Wonderlands", rating: 4, originalPrice: "$59.99", salePrice: "$27.00", image: hotdeals2 },
  { title: "Voltaire: The Vegan", rating: 5, originalPrice: "$44.99", salePrice: "$11.10", image:hotdeals3 },
  { title: "Little Nightmares II", rating: 5, originalPrice: "$29.99", salePrice: "$11.55", image: hotdeals4 },
  { title: "Hogwarts Legacy", rating: 5, originalPrice: "$59.99", salePrice: "$47.65", image:hotdeals5 },
  { title: "Red Dead Redemption 2", rating: 5, originalPrice: "$59.99", salePrice: "$16.99", image:  hotdeals6},
  { title: "Tiny Tina's Wonderlands", rating: 4, originalPrice: "$59.99", salePrice: "$27.00", image:hotdeals7 },
  { title: "Voltaire: The Vegan", rating: 5, originalPrice: "$44.99", salePrice: "$11.10", image: hotdeals4  },
  { title: "Little Nightmares II", rating: 5, originalPrice: "$29.99", salePrice: "$11.55", image: hotdeals2  },
]

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
          {reviewGames.map((game, index) => (
            <motion.div 
              key={index} 
              className="flex gap-3 bg-zinc-50/5 p-2 rounded-lg hover:bg-white/10 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Image
                src={game.image}
                alt={game.title}
                width={48}
                height={48}
                className="rounded-md object-contain "
              />
              <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-sm font-medium text-white uppercase tracking-wider">{game.title}</h3>
                <div className="flex items-center gap-1 my-0.5">
                  {Array.from({ length: game.rating }).map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-white text-white" />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 line-through uppercase tracking-wider">{game.originalPrice}</span>
                  <span className="text-sm font-bold text-white uppercase tracking-wider">{game.salePrice}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

