import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import Link from "next/link"
import Image from "next/image"
import { Search } from "lucide-react"
import { searchProducts } from "@/public/data/shop"

export default function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q ?? ""
  const results = searchProducts(query)

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-2xl font-bold uppercase tracking-wider">Search Results</h1>
          {query ? (
            <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
              {results.length} {results.length === 1 ? "result" : "results"} for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
              Type a product or category in the search bar.
            </p>
          )}

          {query && results.length === 0 ? (
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
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
              {results.map((product) => (
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
                  <p className="mt-1 font-semibold text-white">${product.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="mt-16 border-t border-zinc-800 py-16">
          <FooterServices />
        </div>
      </div>
    </>
  )
}
