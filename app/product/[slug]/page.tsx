"use client"

import Image, { type StaticImageData } from "next/image"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import Link from "next/link"
import { useParams, notFound, useRouter } from "next/navigation"
import { useCart } from "@/hooks/cartcontext"
import { useWishlist } from "@/hooks/wishlistcontext"
import { getProductBySlug, getRelatedProducts } from "@/public/data/shop"
import { ProductReviews } from "@/components/ui/product-reviews"

type Size = "s" | "m" | "l"

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const product = getProductBySlug(params.slug)
  const { addToCart } = useCart()
  const { has: inWishlist, toggle: toggleWishlist } = useWishlist()

  const [selectedSize, setSelectedSize] = useState<Size>("m")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description")
  const [averageRating, setAverageRating] = useState(0)
  const [stock, setStock] = useState<number | null>(null)
  const [mainImage, setMainImage] = useState<string | StaticImageData | undefined>(product?.image)

  const slug = product?.slug

  useEffect(() => {
    if (!slug) return
    fetch(`/api/products?slug=${encodeURIComponent(slug)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStock(d?.product ? (d.product.active ? d.product.stock : 0) : null))
      .catch(() => {})
  }, [slug])

  if (!product) {
    notFound()
  }

  const outOfStock = stock !== null && stock <= 0

  const related = getRelatedProducts(product.slug)
  const gallery: (string | StaticImageData)[] = [product.image, ...related.map((p) => p.image)].slice(0, 5)
  const activeImage = mainImage ?? product.image

  const priceMultiplier: Record<Size, number> = { s: 0.9, m: 1, l: 1.1 }
  const unitPrice = product.price * priceMultiplier[selectedSize]
  const displayPrice = unitPrice * quantity

  const handleAddToCart = () => {
    if (outOfStock) return
    addToCart({
      slug: product.slug,
      name: product.name,
      price: unitPrice,
      image: product.image,
      size: selectedSize.toUpperCase(),
      quantity,
    })
  }

  const handleBuyNow = () => {
    if (outOfStock) return
    handleAddToCart()
    router.push("/product/cartpage")
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-950">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">Home</Link> /{" "}
            <Link href="/shop" className="hover:text-white">Shop</Link> /{" "}
            <span className="text-zinc-200">{product.name}</span>
          </div>

          <div className="flex flex-col gap-8 md:flex-row">
            {/* Product Images */}
            <div className="w-full md:w-1/2">
              <div className="relative overflow-hidden rounded-lg bg-zinc-800" style={{ aspectRatio: "1 / 1" }}>
                <Image src={activeImage} alt={product.name} fill priority sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
              </div>
              <div className="mt-4 grid grid-cols-5 gap-3">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-lg bg-zinc-800 hover:ring-2 hover:ring-white"
                    onClick={() => setMainImage(image)}
                  >
                    <Image src={image} alt={`${product.name} view ${index + 1}`} fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="w-full space-y-6 md:w-1/2">
              <div>
                <p className="mb-1 text-sm uppercase tracking-wider text-zinc-400">{product.category}</p>
                <h1 className="mb-2 text-3xl font-bold text-white">{product.name}</h1>
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.round(averageRating) ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"}`}
                      />
                    ))}
                  </div>
                  <span className="block text-2xl font-bold text-white">${displayPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-sm text-zinc-400">Size:</div>
                  <div className="flex gap-3">
                    {(["S", "M", "L"] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size.toLowerCase() as Size)}
                        className={`flex h-10 w-10 items-center justify-center rounded-md border ${
                          selectedSize === size.toLowerCase()
                            ? "border-white bg-white/20 text-white"
                            : "border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm text-zinc-400">Color:</div>
                  <div className="flex gap-3">
                    <button className="h-8 w-8 rounded-md bg-black ring-offset-2 ring-offset-zinc-900 hover:ring-2 hover:ring-white" />
                    <button className="h-8 w-8 rounded-md bg-zinc-500 ring-offset-2 ring-offset-zinc-900 hover:ring-2 hover:ring-white" />
                    <button className="h-8 w-8 rounded-md bg-white ring-offset-2 ring-offset-zinc-900 hover:ring-2 hover:ring-zinc-500" />
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-sm text-zinc-400">Quantity:</div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-zinc-400">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-zinc-700 text-zinc-400 hover:bg-zinc-800"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  {outOfStock ? (
                    <p className="mb-3 text-sm font-medium uppercase tracking-wider text-red-400">Out of stock</p>
                  ) : stock !== null && stock <= 5 ? (
                    <p className="mb-3 text-sm font-medium uppercase tracking-wider text-amber-400">
                      Only {stock} left in stock
                    </p>
                  ) : null}
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      onClick={handleAddToCart}
                      disabled={outOfStock}
                      className="w-full rounded-sm border border-white/15 bg-transparent text-white hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ShoppingCart className="h-5 w-5" />
                    </Button>
                    <Button
                      onClick={handleBuyNow}
                      disabled={outOfStock}
                      className="w-full rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {outOfStock ? "Sold out" : "Buy now"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        toggleWishlist({
                          slug: product.slug,
                          name: product.name,
                          price: product.price,
                          image: product.image,
                        })
                      }
                      aria-label={inWishlist(product.slug) ? "Remove from wishlist" : "Add to wishlist"}
                      className="w-full rounded-sm border-white/15 bg-transparent text-white hover:bg-white/5"
                    >
                      <Heart className={`h-4 w-4 ${inWishlist(product.slug) ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="mt-12 flex w-full flex-col items-center border-t border-zinc-800 pt-8">
                  <div className="w-full space-y-4">
                    <div className="mb-4 flex justify-center border-b border-zinc-800">
                      {(["description", "reviews", "shipping"] as const).map((tab) => (
                        <button
                          key={tab}
                          className={`flex-1 px-4 py-2 text-center capitalize ${
                            activeTab === tab ? "border-b-2 border-white text-white" : "text-zinc-400"
                          }`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab === "description" ? "Product Details" : tab === "reviews" ? "Reviews" : "Shipping"}
                        </button>
                      ))}
                    </div>
                    <div
                      className={
                        activeTab === "reviews"
                          ? "text-zinc-400"
                          : "h-64 overflow-y-auto text-zinc-400"
                      }
                    >
                      {activeTab === "description" && (
                        <div>
                          <p>
                            Elevate your wardrobe with the {product.name}. Crafted from premium materials for
                            everyday comfort and a sharp, modern silhouette.
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5">
                            <li>Premium fabric blend</li>
                            <li>Modern fit and stylish design</li>
                            <li>Durable construction</li>
                            <li>Easy care instructions</li>
                            <li>Available in multiple colors</li>
                          </ul>
                        </div>
                      )}
                      {activeTab === "reviews" && (
                        <ProductReviews slug={product.slug} onStats={(avg) => setAverageRating(avg)} />
                      )}
                      {activeTab === "shipping" && (
                        <ul className="space-y-2">
                          <li>Free standard shipping on orders over $100</li>
                          <li>Express delivery available (2-3 business days)</li>
                          <li>International shipping available</li>
                          <li>30-day return policy</li>
                          <li>Free returns within the US</li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold text-white">YOU MAY ALSO LIKE</h2>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {related.map((item) => (
                <Link key={item.slug} href={`/product/${item.slug}`} className="group">
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-zinc-800">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mb-2 font-medium text-white">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-white">${item.price.toFixed(2)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-zinc-800 py-16">
          <FooterServices />
        </div>
      </div>
    </>
  )
}
