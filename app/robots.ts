import type { MetadataRoute } from "next"
import { getBaseUrl } from "@/lib/url"

export default function robots(): MetadataRoute.Robots {
  const base = getBaseUrl()
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Keep private/account + admin + API surfaces out of the index.
      disallow: ["/admin", "/api", "/checkout", "/product/profile", "/product/cartpage"],
    },
    sitemap: `${base}/sitemap.xml`,
  }
}
