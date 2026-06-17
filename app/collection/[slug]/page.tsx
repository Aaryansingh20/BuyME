import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import Image from "next/image"
import Link from "next/link"
import { Check } from "lucide-react"
import { notFound } from "next/navigation"
import { collections, getCollection, getCollectionProducts } from "@/public/data/collections"
import { Price } from "@/components/ui/price"
import type { Metadata } from "next"

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const collection = getCollection(params.slug)
  if (!collection) return { title: "Collection not found" }
  return {
    title: collection.title,
    description: collection.description,
    alternates: { canonical: `/collection/${collection.slug}` },
    openGraph: {
      title: collection.title,
      description: collection.description,
      images: [{ url: collection.hero.src, alt: collection.title }],
    },
  }
}

export default function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = getCollection(params.slug)
  if (!collection) {
    notFound()
  }
  const products = getCollectionProducts(collection)

  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white">
        {/* Hero banner */}
        <section className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
          <Image src={collection.hero} alt={collection.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 pb-10 md:px-8 md:pb-16">
              {collection.discount && (
                <span className="mb-4 inline-block rounded-sm bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wider text-black">
                  {collection.discount}
                </span>
              )}
              <p className="text-sm uppercase tracking-[0.3em] text-gray-300">{collection.tagline}</p>
              <h1 className="mt-2 text-4xl font-bold uppercase tracking-wider md:text-6xl">{collection.title}</h1>
              <p className="mt-4 max-w-xl text-sm uppercase tracking-wider text-gray-300">{collection.description}</p>
            </div>
          </div>
        </section>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 pt-6 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white">Home</Link> /{" "}
          <span className="text-zinc-200">{collection.title}</span>
        </div>

        {/* Highlights */}
        <section className="container mx-auto px-4 pt-8">
          <div className="grid gap-4 sm:grid-cols-3">
            {collection.highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Check className="h-3.5 w-3.5 text-white" />
                </span>
                <span className="text-sm uppercase tracking-wider text-gray-200">{highlight}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Products */}
        <section className="container mx-auto px-4 py-12">
          <h2 className="mb-6 text-2xl font-bold uppercase tracking-wider">Shop The Collection</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <Link key={product.slug} href={`/product/${product.slug}`} className="group">
                <div className="relative mb-3 aspect-square overflow-hidden bg-zinc-900">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <p className="text-xs uppercase tracking-wider text-gray-400">{product.category}</p>
                <p className="font-semibold text-white">{product.name}</p>
                <Price amount={product.price} className="mt-1 block font-semibold text-white" />
              </Link>
            ))}
          </div>
        </section>
        <div className="mt-8 border-t border-zinc-800 py-16">
          <FooterServices />
        </div>
      </main>
    </>
  )
}
