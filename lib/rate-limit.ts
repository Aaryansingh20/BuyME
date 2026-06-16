// Lightweight in-memory rate limiter (sliding fixed-window).
//
// Protects email-sending endpoints from abuse (someone hammering "forgot
// password" to spam inboxes or burn the daily Gmail quota).
//
// Note: state lives in process memory, so on serverless it's per-instance and
// resets on cold start. That's fine here — it's a meaningful speed bump, and the
// per-email cooldown (DB-backed) is the hard guarantee against inbox spam.

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export interface RateLimitResult {
  ok: boolean
  retryAfter: number // seconds until the window resets
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now()
  const bucket = buckets.get(key)

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count++
  return { ok: true, retryAfter: 0 }
}

// Best-effort client IP from common proxy headers (Vercel sets x-forwarded-for).
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) return xff.split(",")[0]!.trim()
  return req.headers.get("x-real-ip")?.trim() || "unknown"
}
