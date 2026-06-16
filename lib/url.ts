// Canonical site URL for building absolute links in emails. Resolution order:
//   1. APP_URL              — set this in production (e.g. https://buyme-omega.vercel.app)
//   2. VERCEL_URL           — auto-set by Vercel to the deployment URL (no protocol)
//   3. the incoming request origin (good for local dev → http://localhost:3000)
//   4. localhost fallback
//
// Always set APP_URL in production so links point at your real domain, not a
// per-deployment Vercel URL.
export function getBaseUrl(reqUrl?: string): string {
  const configured = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL
  if (configured) return configured.replace(/\/+$/, "")
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (reqUrl) {
    try {
      return new URL(reqUrl).origin
    } catch {
      /* fall through */
    }
  }
  return "http://localhost:3000"
}
