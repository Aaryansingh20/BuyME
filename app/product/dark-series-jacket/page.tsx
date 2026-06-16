'use client'

import Image from "next/image"
import { Star, Heart, ShoppingCart, CuboidIcon as Cube } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/pages/navbar"
import Link from "next/link"
import dynamic from "next/dynamic"
import darkseriesjacket from "@/public/images/one-3view.jpg"
import { ProductReviews } from "@/components/ui/product-reviews"
import { useCart } from "@/hooks/cartcontext"
import { useWishlist } from "@/hooks/wishlistcontext"

const PRODUCT_SLUG = "dark-series-jacket"
const PRODUCT_NAME = "Dark series jacket"

type Size = 's' | 'm' | 'l'
type Category = 'T-Shirts' | 'Jeans' | 'Jackets' | 'Hoodies' | 'Sweaters' | 'Accessories' | 'Activewear' | 'Formal Wear'
type Product = { name: string; price: number; image: string }

const Product3DViewer = dynamic(() => import("@/components/Product3DViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-white">Loading 3D model...</div>
  ),
})

export default function Darkseriesjacket() {
  const [selectedSize, setSelectedSize] = useState<Size>('m')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description')
  const [mainImage, setMainImage] = useState("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80")
  const [reviewStats, setReviewStats] = useState({ average: 0, count: 0 })
  const [is3DView, setIs3DView] = useState(false);

  const prices: Record<Size, number> = {
    s: 650.00,
    m: 730.00,
    l: 800.00
  }

  const productImages = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
  ]

  const products: Record<Category, Product[]> = {
    'Jackets': [
      { name: "Leather Jacket", price: 918.00, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Denim Jacket", price: 723.00, image: "https://images.unsplash.com/photo-1601333144130-8cbb312386b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Bomber Jacket", price: 828.00, image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" },
      { name: "Windbreaker", price: 630.00, image: "https://images.unsplash.com/photo-1547063364-caf7d0be2d48?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80" }
    ],
    'T-Shirts': [],
    'Jeans': [],
    'Hoodies': [],
    'Sweaters': [],
    'Accessories': [],
    'Activewear': [],
    'Formal Wear': []
  }

  const router = useRouter()
  const { addToCart } = useCart()
  const { has: inWishlist, toggle: toggleWishlist } = useWishlist()

  const toggleView = () => {
    setIs3DView(!is3DView);
  };

  const handleAddToCart = () =>
    addToCart({
      slug: PRODUCT_SLUG,
      name: PRODUCT_NAME,
      price: prices[selectedSize],
      image: darkseriesjacket,
      size: selectedSize.toUpperCase(),
      quantity,
    })

  const handleBuyNow = async () => {
    await handleAddToCart()
    router.push("/product/cartpage")
  }

  const handleToggleWishlist = () =>
    toggleWishlist({ slug: PRODUCT_SLUG, name: PRODUCT_NAME, price: prices[selectedSize], image: darkseriesjacket })

  return (
    <>
    <Navbar/>
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="text-zinc-400 text-sm mb-8">
          Home / Best Seller /Dark series jacket
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Images / 3D View */}
          <div className="w-full md:w-1/2">
            <div className="relative bg-zinc-800 rounded-lg overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
              {is3DView ? (
                <Product3DViewer modelPath="/3dmodel//dark-series-jacket.glb" />
              ) : (
                <Image
                  src={darkseriesjacket || "/placeholder.svg"}
                  alt="Premium Clothing"
                  fill
                  className="object-contain bg-[#b6b6b6]"
                />
              )}
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <button 
                    key={index} 
                    className="aspect-square relative bg-zinc-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-white"
                    onClick={() => {
                      setMainImage(image)
                      setIs3DView(false)
                    }}
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
              <Button
                onClick={toggleView}
                className={`bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-all duration-500 ease-in-out hover:scale-105 flex items-center space-x-2 ${
                  is3DView ? 'ring-2 ring-white' : ''
                }`}
              >
                <Cube className="w-5 h-5" />
                <span>{is3DView ? '2D View' : '3D View'}</span>
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Dark series jacket</h1>
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.round(reviewStats.average) ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`} />
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

              <div className="pt-4 flex flex-col gap-3">
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    onClick={handleAddToCart}
                    aria-label="Add to cart"
                    className="w-full bg-zinc-700 hover:bg-zinc-600 text-white"
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </Button>
                  <Button onClick={handleBuyNow} className="w-full bg-zinc-700 hover:bg-zinc-600 text-white">
                    Buy now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleToggleWishlist}
                    aria-label={inWishlist(PRODUCT_SLUG) ? "Remove from wishlist" : "Add to wishlist"}
                    className="w-full"
                  >
                    <Heart className={`h-4 w-4 ${inWishlist(PRODUCT_SLUG) ? "fill-red-500 text-red-500" : ""}`} />
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Product tabs — full width below the product */}
        <div className="mt-12 border-t border-zinc-800 pt-8">
          <div className="mx-auto w-full max-w-4xl space-y-4">
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
            <div className="h-[34rem] overflow-y-auto pr-2 text-zinc-400">
              {activeTab === 'description' && (
                <div className="space-y-4">
                  <p>
                    Experience ultimate comfort and style with our Premium Clothing collection. Crafted from
                    high-quality materials and finished with meticulous attention to detail, this piece is built to be a
                    staple in your wardrobe for years to come.
                  </p>
                  <div>
                    <h4 className="mb-2 font-semibold text-white">Highlights</h4>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Premium cotton blend fabric</li>
                      <li>Modern fit and stylish design</li>
                      <li>Durable, reinforced construction</li>
                      <li>Breathable and lightweight for all-day wear</li>
                      <li>Available in multiple colors</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-white">Materials &amp; Care</h4>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>80% cotton, 20% polyester</li>
                      <li>Machine wash cold, inside out</li>
                      <li>Do not bleach; tumble dry low</li>
                      <li>Warm iron if needed</li>
                    </ul>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <ProductReviews slug="dark-series-jacket" onStats={(a, c) => setReviewStats({ average: a, count: c })} />
              )}
              {activeTab === 'shipping' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-white">Delivery</h4>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>Free standard shipping on orders over $100</li>
                      <li>Standard delivery: 4–6 business days</li>
                      <li>Express delivery available (2–3 business days)</li>
                      <li>International shipping available to most countries</li>
                      <li>Orders are processed within 24 hours on business days</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-white">Returns</h4>
                    <ul className="list-disc space-y-1 pl-5">
                      <li>30-day hassle-free return policy</li>
                      <li>Free returns within the US</li>
                      <li>Items must be unworn with original tags attached</li>
                      <li>Refunds are issued to your original payment method</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">FROM THIS COLLECTION</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products['Jackets']?.map((product, index) => (
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
    <footer className="border-t border-zinc-800">
      <div className="container mx-auto max-w-7xl p-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-zinc-400">© BuyME</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
              </svg>
            </Link>
            <Link href="#" className="text-zinc-400 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
}

