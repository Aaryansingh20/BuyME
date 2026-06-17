import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { shopProducts, getProductBySlug, getRelatedProducts } from "@/public/data/shop"
import { ProductDetail } from "@/components/ui/product-detail"
import { formatMoney, BASE_CURRENCY } from "@/lib/currency"

const imageSrc = (image: string | { src: string }) => (typeof image === "string" ? image : image.src)

export function generateStaticParams() {
  return shopProducts.map((p) => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const product = getProductBySlug(params.slug)
  if (!product) return { title: "Product not found" }
  const description = `Shop the ${product.name} — premium ${product.category.toLowerCase()} at BUYME. ${formatMoney(
    product.price,
    BASE_CURRENCY
  )}.`
  return {
    title: product.name,
    description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: [{ url: imageSrc(product.image), alt: product.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [imageSrc(product.image)],
    },
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug)
  if (!product) notFound()
  const related = getRelatedProducts(product.slug)

  // Product structured data so search engines can show rich results (price, rating).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    category: product.category,
    image: imageSrc(product.image),
    description: `Premium ${product.category.toLowerCase()} from BUYME.`,
    brand: { "@type": "Brand", name: "BUYME" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      bestRating: 5,
      ratingCount: 1,
    },
    offers: {
      "@type": "Offer",
      price: product.price.toFixed(2),
      priceCurrency: BASE_CURRENCY,
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail product={product} related={related} />
    </>
  )
}
