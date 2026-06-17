import type { MetadataRoute } from "next"
import { shopProducts } from "@/public/data/shop"
import { collections } from "@/public/data/collections"
import { getBaseUrl } from "@/lib/url"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getBaseUrl()
  const now = new Date()

  const staticRoutes = ["", "/shop", "/login", "/register"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }))

  const productRoutes = shopProducts.map((p) => ({
    url: `${base}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const collectionRoutes = collections.map((c) => ({
    url: `${base}/collection/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...productRoutes, ...collectionRoutes]
}
