import Stripe from "stripe"

// Stripe is optional: when STRIPE_SECRET_KEY is unset, checkout falls back to
// the direct order-placement flow so local dev works without keys.
const secretKey = process.env.STRIPE_SECRET_KEY

export const stripe = secretKey ? new Stripe(secretKey) : null
export const stripeEnabled = Boolean(secretKey)

// Default charge currency when the shopper hasn't picked one. Matches the base
// currency (EUR); override with STRIPE_CURRENCY. The actual charge currency is
// chosen per-checkout from the shopper's selected display currency, and the
// minor-unit conversion lives in lib/currency.ts (toStripeMinorUnits).
export const STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY || "eur").toLowerCase()
