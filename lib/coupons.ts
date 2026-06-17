import { round2 } from "./pricing"
import { formatMoney, BASE_CURRENCY } from "./currency"

// Minimal shape we need to evaluate a coupon — matches the Prisma Coupon model.
export type CouponLike = {
  code: string
  type: string // "percent" | "fixed"
  value: number
  minSubtotal: number
  maxRedemptions: number | null
  timesUsed: number
  active: boolean
  expiresAt: Date | null
}

export type CouponResult =
  | { ok: true; code: string; type: string; value: number; discount: number }
  | { ok: false; error: string }

// Pure validation + discount calculation. Used by both the public /validate route
// and the order route (which re-checks at purchase time — never trust the client).
export function evaluateCoupon(coupon: CouponLike | null, subtotal: number): CouponResult {
  if (!coupon || !coupon.active) {
    return { ok: false, error: "Invalid coupon code" }
  }
  if (coupon.expiresAt && coupon.expiresAt.getTime() < Date.now()) {
    return { ok: false, error: "This coupon has expired" }
  }
  if (coupon.maxRedemptions !== null && coupon.timesUsed >= coupon.maxRedemptions) {
    return { ok: false, error: "This coupon is no longer available" }
  }
  if (subtotal < coupon.minSubtotal) {
    return { ok: false, error: `Spend at least ${formatMoney(coupon.minSubtotal, BASE_CURRENCY)} to use this code` }
  }

  const raw = coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value
  // Never discount more than the subtotal.
  const discount = round2(Math.min(raw, subtotal))

  return { ok: true, code: coupon.code, type: coupon.type, value: coupon.value, discount }
}

export function normalizeCode(code: unknown): string {
  return typeof code === "string" ? code.trim().toUpperCase() : ""
}
