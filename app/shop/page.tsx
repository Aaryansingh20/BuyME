import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import Link from "next/link"
import Image from "next/image"
import { shopProducts, categories, type ShopProduct } from "@/public/data/shop"
import { prisma } from "@/lib/prisma"
import { Price } from "@/components/ui/price"
import { ShopToolbar } from "@/components/ui/shop-toolbar"
import { Pagination } from "@/components/ui/pagination"

export const dynamic = "force-dynamic"

export const metadata = {
  title: "Shop All Products",
  description: "Browse the full BUYME collection — jackets, jeans, hoodies, formal wear and more.",
  alternates: { canonical: "/shop" },
}

const PAGE_SIZE = 12

type ShopSearchParams = {
  category?: string
  sort?: string
  min?: string
  max?: string
  page?: string
}

const SORTERS: Record<string, (a: ShopProduct, b: ShopProduct) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.name.localeCompare(b.name),
  featured: (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
}

export default async function ShopPage({ searchParams }: { searchParams: ShopSearchParams }) {
  const active = searchParams.category
  const sort = searchParams.sort && SORTERS[searchParams.sort] ? searchParams.sort : "featured"
  const min = Number.parseFloat(searchParams.min ?? "")
  const max = Number.parseFloat(searchParams.max ?? "")
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1)

  // Live availability from the inventory layer. Hidden products are dropped from
  // the storefront; sold-out ones stay visible with a badge.
  const inventory = await prisma.product.findMany({ select: { slug: true, stock: true, active: true } })
  const stockBySlug = new Map(inventory.map((p) => [p.slug, p]))
  const isHidden = (slug: string) => stockBySlug.get(slug)?.active === false
  const isSoldOut = (slug: string) => (stockBySlug.get(slug)?.stock ?? 1) <= 0

  // category → price → sort
  let filtered = shopProducts.filter((p) => !isHidden(p.slug))
  if (active) filtered = filtered.filter((p) => p.category === active)
  if (!Number.isNaN(min)) filtered = filtered.filter((p) => p.price >= min)
  if (!Number.isNaN(max)) filtered = filtered.filter((p) => p.price <= max)
  filtered = [...filtered].sort(SORTERS[sort])

  const total = filtered.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const products = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  // Build a /shop URL preserving the active filters/sort, overriding as given.
  const buildHref = (updates: Partial<ShopSearchParams>) => {
    const params = new URLSearchParams()
    const merged = { category: active, sort: sort === "featured" ? undefined : sort, min: searchParams.min, max: searchParams.max, ...updates }
    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value)
    }
    const qs = params.toString()
    return qs ? `/shop?${qs}` : "/shop"
  }

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
            {total} {total === 1 ? "item" : "items"}
            {active ? ` in ${active}` : ""}
          </p>

          {/* Category filter */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href={buildHref({ category: undefined })}
              className={`rounded-sm border px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                !active ? "border-white bg-white text-black" : "border-white/15 text-gray-300 hover:bg-white/5"
              }`}
            >
              All
            </Link>
            {categories.map((category) => (
              <Link
                key={category}
                href={buildHref({ category })}
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

          {/* Sort + price toolbar */}
          <ShopToolbar total={total} />

          {/* Product grid */}
          {products.length === 0 ? (
            <p className="mt-16 text-center text-sm uppercase tracking-wider text-gray-500">
              No products match these filters.
            </p>
          ) : (
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
                  <Price amount={product.price} className="mt-1 block font-semibold text-white" />
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            current={current}
            pageCount={pageCount}
            hrefFor={(n) => buildHref({ page: n === 1 ? undefined : String(n) })}
          />
        </div>
        <div className="mt-16 border-t border-zinc-800 py-16">
          <FooterServices />
        </div>
      </main>
    </>
  )
}
