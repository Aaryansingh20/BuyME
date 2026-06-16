import Stripe from "stripe"

// Stripe is optional: when STRIPE_SECRET_KEY is unset, checkout falls back to
// the direct order-placement flow so local dev works without keys.
const secretKey = process.env.STRIPE_SECRET_KEY

export const stripe = secretKey ? new Stripe(secretKey) : null
export const stripeEnabled = Boolean(secretKey)

// Charge currency. Default USD; set STRIPE_CURRENCY=inr (etc.) to charge in ₹.
export const STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY || "usd").toLowerCase()

// Convert a major-unit amount (e.g. dollars/rupees) to the smallest unit Stripe
// expects (cents/paise). Zero-decimal currencies (JPY, etc.) are not used here.
export function toMinorUnits(amount: number): number {
  return Math.round(amount * 100)
}
