import type { StaticImageData } from "next/image"
import { shopProducts, featuredProducts, type ShopProduct } from "./shop"
import womenHero from "@/public/shop/tailored-blazer.jpg"
import handbagHero from "@/public/shop/urban-cargo-pants.jpg"
import watchHero from "@/public/shop/graphic-print-tee.jpg"
import accessoriesHero from "@/public/shop/oversized-hoodie.jpg"
import newArrivalsHero from "@/public/shop/wool-blend-overcoat.jpg"
import summerHero from "@/public/shop/slim-fit-jeans.jpg"
import nikeHero from "@/public/shop/knit-pullover-sweater.jpg"
import flashHero from "@/public/shop/classic-white-shirt.jpg"
import clearanceHero from "@/public/shop/streetwear-set.jpg"

export interface Collection {
  slug: string
  title: string
  tagline: string
  discount?: string
  description: string
  highlights: string[]
  hero: StaticImageData
  categories: string[] // shop categories to feature; empty means all
}

export const collections: Collection[] = [
  {
    slug: "women-style",
    title: "Women's Style",
    tagline: "New Arrivals",
    discount: "Up to 70% Off",
    description:
      "Define your silhouette with our women's edit — sharp tailoring, soft knits and statement outerwear built to layer through every season.",
    highlights: ["Fresh seasonal arrivals", "Tailored & relaxed fits", "Up to 70% off selected styles"],
    hero: womenHero,
    categories: ["Coats", "Formal Wear", "Jackets", "Sweaters"],
  },
  {
    slug: "handbags",
    title: "Carry The Look",
    tagline: "Everyday Essentials",
    description:
      "The finishing piece. Functional, considered carry pieces and everyday staples designed to move with your wardrobe.",
    highlights: ["Built for everyday", "Premium materials", "Designed to last"],
    hero: handbagHero,
    categories: [],
  },
  {
    slug: "watches",
    title: "Time Pieces",
    tagline: "Signature Details",
    description:
      "It's all in the details. A curated drop of accent pieces and accessories to complete any outfit with quiet confidence.",
    highlights: ["Minimal, timeless design", "Versatile styling", "Limited quantities"],
    hero: watchHero,
    categories: [],
  },
  {
    slug: "accessories",
    title: "Accessories",
    tagline: "Finish The Fit",
    discount: "Min. 40-60% Off",
    description:
      "Round out your look with our accessories edit — the small upgrades that pull an outfit together, now at up to 60% off.",
    highlights: ["40-60% off across the range", "Mix-and-match essentials", "New styles added weekly"],
    hero: accessoriesHero,
    categories: [],
  },
  {
    slug: "new-arrivals",
    title: "New Arrivals",
    tagline: "Just Dropped",
    description:
      "Discover the latest trends first. Our newest pieces, fresh off the rail and ready to define your next look.",
    highlights: ["The latest drops", "Trend-led pieces", "First access for members"],
    hero: newArrivalsHero,
    categories: [],
  },
  {
    slug: "summer-sale",
    title: "Summer Sale",
    tagline: "Seasonal Edit",
    discount: "Up to 70% Off",
    description:
      "Lightweight layers and warm-weather staples at their best prices. Shop the summer sale before it's gone.",
    highlights: ["Up to 70% off", "Breathable fabrics", "Limited-time pricing"],
    hero: summerHero,
    categories: ["T-Shirts", "Shirts", "Activewear", "Pants"],
  },
  {
    slug: "nike",
    title: "Brand Spotlight",
    tagline: "Featured Brand",
    description:
      "Engineered for movement. Discover the latest innovations in sportswear and athletic-inspired pieces built for performance and street style alike.",
    highlights: ["Performance-ready fabrics", "Athletic-inspired fits", "Street-ready styling"],
    hero: nikeHero,
    categories: ["Activewear", "Hoodies"],
  },
  {
    slug: "flash-sale",
    title: "Flash Sale",
    tagline: "24 Hours Only",
    discount: "Up to 80% Off",
    description:
      "Here today, gone tomorrow. Select items at up to 80% off for 24 hours only — once they're gone, they're gone.",
    highlights: ["24 hours only", "Up to 80% off", "While stocks last"],
    hero: flashHero,
    categories: ["Hoodies", "Jeans", "Sweaters"],
  },
  {
    slug: "clearance",
    title: "Clearance",
    tagline: "Final Markdowns",
    discount: "Extra 20% Off",
    description:
      "Final markdowns on end-of-line pieces, with an extra 20% off already reduced prices. Last chance to grab them.",
    highlights: ["Extra 20% off reduced prices", "End-of-line styles", "Final sale — no returns"],
    hero: clearanceHero,
    categories: ["Pants", "Jeans", "T-Shirts"],
  },
]

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug)
}

export function getCollectionProducts(collection: Collection): ShopProduct[] {
  if (collection.categories.length === 0) return featuredProducts
  const filtered = shopProducts.filter((p) => collection.categories.includes(p.category))
  return filtered.length > 0 ? filtered : featuredProducts
}
