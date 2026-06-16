import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import Link from "next/link"
import Image from "next/image"
import { shopProducts, categories } from "@/public/data/shop"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function ShopPage({ searchParams }: { searchParams: { category?: string } }) {
  const active = searchParams.category

  // Live availability from the inventory layer. Hidden products are dropped from
  // the storefront; sold-out ones stay visible with a badge.
  const inventory = await prisma.product.findMany({ select: { slug: true, stock: true, active: true } })
  const stockBySlug = new Map(inventory.map((p) => [p.slug, p]))
  const isHidden = (slug: string) => stockBySlug.get(slug)?.active === false
  const isSoldOut = (slug: string) => (stockBySlug.get(slug)?.stock ?? 1) <= 0

  const visible = shopProducts.filter((p) => !isHidden(p.slug))
  const products = active ? visible.filter((p) => p.category === active) : visible

  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-10">
          <div className="mb-2 text-sm text-zinc-400">
            <Link href="/" className="hover:text-white">Home</Link> /{" "}
            <span className="text-zinc-200">Shop</span>
          </div>
          <h1 className="text-3xl font-bold uppercase tracking-wider">All Products</h1>
          <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
            {products.length} {products.length === 1 ? "item" : "items"}
            {active ? ` in ${active}` : ""}
          </p>

          {/* Category filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/shop"
              className={`rounded-sm border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                !active ? "border-white bg-white text-black" : "border-white/15 text-gray-300 hover:bg-white/5"
              }`}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={`/shop?category=${encodeURIComponent(category)}`}
                className={`rounded-sm border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                  active === category
                    ? "border-white bg-white text-black"
                    : "border-white/15 text-gray-300 hover:bg-white/5"
                }`}
              >
                {category}
              </Link>
            ))}
          </div>

          {/* Product grid */}
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.slug} href={`/product/${product.slug}`} className="group">
                <div className="relative mb-3 aspect-square overflow-hidden bg-zinc-900">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className={`object-cover transition-transform duration-300 group-hover:scale-105 ${
                      isSoldOut(product.slug) ? "opacity-50" : ""
                    }`}
                  />
                  {isSoldOut(product.slug) && (
                    <span className="absolute left-2 top-2 rounded-sm bg-black/80 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                      Sold out
                    </span>
                  )}
                </div>
                <p className="text-xs uppercase tracking-wider text-gray-400">{product.category}</p>
                <p className="font-semibold text-white">{product.name}</p>
                <p className="mt-1 font-semibold text-white">${product.price.toFixed(2)}</p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-16 border-t border-zinc-800 py-16">
          <FooterServices />
        </div>
      </main>
    </>
  )
}
