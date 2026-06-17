import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { searchProducts, type ShopProduct } from "@/public/data/shop"
import { Price } from "@/components/ui/price"
import { ShopToolbar } from "@/components/ui/shop-toolbar"
import { Pagination } from "@/components/ui/pagination"
import type { Metadata } from "next"

const PAGE_SIZE = 12

const SORTERS: Record<string, (a: ShopProduct, b: ShopProduct) => number> = {
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
  name: (a, b) => a.name.localeCompare(b.name),
  featured: (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
}

type SearchPageParams = { q?: string; sort?: string; min?: string; max?: string; page?: string }

export function generateMetadata({ searchParams }: { searchParams: SearchPageParams }): Metadata {
  const q = searchParams.q?.trim()
  // Search result pages are thin/duplicative — keep them out of the index.
  return { title: q ? `Search: ${q}` : "Search", robots: { index: false, follow: true } }
}

export default function SearchPage({ searchParams }: { searchParams: SearchPageParams }) {
  const query = searchParams.q ?? ""
  const sort = searchParams.sort && SORTERS[searchParams.sort] ? searchParams.sort : "featured"
  const min = Number.parseFloat(searchParams.min ?? "")
  const max = Number.parseFloat(searchParams.max ?? "")
  const page = Math.max(1, Number.parseInt(searchParams.page ?? "1", 10) || 1)

  let results = searchProducts(query)
  if (!Number.isNaN(min)) results = results.filter((p) => p.price >= min)
  if (!Number.isNaN(max)) results = results.filter((p) => p.price <= max)
  results = [...results].sort(SORTERS[sort])

  const total = results.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const products = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const buildHref = (updates: Partial<SearchPageParams>) => {
    const params = new URLSearchParams()
    const merged: SearchPageParams = {
      q: query || undefined,
      sort: sort === "featured" ? undefined : sort,
      min: searchParams.min,
      max: searchParams.max,
      ...updates,
    }
    for (const [key, value] of Object.entries(merged)) {
      if (value) params.set(key, value)
    }
    const qs = params.toString()
    return qs ? `/search?${qs}` : "/search"
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Search Results</h1>
          {query ? (
            <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
              {total} {total === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
              Type a product or category in the search bar.
            </p>
          )}

          {query && total === 0 ? (
            <div className="mt-16 flex flex-col items-center text-center text-gray-400">
              <Search className="h-10 w-10" />
              <p className="mt-4 uppercase tracking-wider">No products matched your search.</p>
              <Link
                href="/shop"
                className="mt-4 text-sm uppercase tracking-wider text-white underline-offset-4 hover:underline"
              >
                Browse all products
              </Link>
            </div>
          ) : query ? (
            <>
              <ShopToolbar total={total} />
              <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <Link key={product.slug} href={`/product/${product.slug}`} className="group">
                    <div className="relative mb-3 aspect-square overflow-hidden bg-zinc-900">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="text-xs uppercase tracking-wider text-gray-400">{product.category}</p>
                    <p className="font-semibold text-white">{product.name}</p>
                    <Price amount={product.price} className="mt-1 block font-semibold text-white" />
                  </Link>
                ))}
              </div>
              <Pagination
                current={current}
                pageCount={pageCount}
                hrefFor={(n) => buildHref({ page: n === 1 ? undefined : String(n) })}
              />
            </>
          ) : null}
        </div>
        <div className="mt-16 border-t border-zinc-800 py-16">
          <FooterServices />
        </div>
      </div>
    </>
  )
}
