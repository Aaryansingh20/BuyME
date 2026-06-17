// Multi-currency support. All product/order amounts are STORED in the base
// currency (EUR — BuyME ships from Germany). The shopper can pick a display
// currency; we convert from base at render time using the static rates below.
// This file is framework-agnostic (no React, no next/headers) so it can be
// imported from both client components and server routes.

export type CurrencyCode = "EUR" | "USD" | "GBP" | "INR" | "JPY" | "CAD" | "AUD"

export interface Currency {
  code: CurrencyCode
  symbol: string
  label: string
  locale: string
  /** Units of this currency per 1 unit of the base currency. */
  rate: number
  /** Zero-decimal currencies (e.g. JPY) have no minor unit. */
  zeroDecimal?: boolean
}

export const BASE_CURRENCY: CurrencyCode = "EUR"

// Static reference rates relative to EUR. For a production store these would be
// refreshed from an FX feed; for now they're fixed and good enough.
export const CURRENCIES: Record<CurrencyCode, Currency> = {
  EUR: { code: "EUR", symbol: "€", label: "Euro", locale: "de-DE", rate: 1 },
  USD: { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US", rate: 1.08 },
  GBP: { code: "GBP", symbol: "£", label: "British Pound", locale: "en-GB", rate: 0.85 },
  INR: { code: "INR", symbol: "₹", label: "Indian Rupee", locale: "en-IN", rate: 90 },
  JPY: { code: "JPY", symbol: "¥", label: "Japanese Yen", locale: "ja-JP", rate: 168, zeroDecimal: true },
  CAD: { code: "CAD", symbol: "C$", label: "Canadian Dollar", locale: "en-CA", rate: 1.47 },
  AUD: { code: "AUD", symbol: "A$", label: "Australian Dollar", locale: "en-AU", rate: 1.63 },
}

export const CURRENCY_LIST: Currency[] = Object.values(CURRENCIES)
export const CURRENCY_COOKIE = "currency"
export const DEFAULT_CURRENCY: CurrencyCode = BASE_CURRENCY

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === "string" && value in CURRENCIES
}

/** Coerce any input (cookie value, request body, …) to a supported currency. */
export function normalizeCurrency(value: unknown): CurrencyCode {
  return isCurrencyCode(value) ? value : DEFAULT_CURRENCY
}

/** Convert a base-currency amount into `code`. */
export function convertFromBase(baseAmount: number, code: CurrencyCode): number {
  return baseAmount * CURRENCIES[code].rate
}

/** Format a base-currency amount for display in `code` (e.g. "€129.99"). */
export function formatMoney(baseAmount: number, code: CurrencyCode): string {
  const currency = CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY]
  const value = convertFromBase(baseAmount, code)
  const fractionDigits = currency.zeroDecimal ? 0 : 2
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }).format(value)
  } catch {
    // Fallback for environments without full ICU data.
    return `${currency.symbol}${value.toFixed(fractionDigits)}`
  }
}

/**
 * Convert a base amount into the smallest unit Stripe expects, in `code`.
 * e.g. €129.99 → USD → 14039 (cents); ¥ amounts use whole units.
 */
export function toStripeMinorUnits(baseAmount: number, code: CurrencyCode): number {
  const currency = CURRENCIES[code] ?? CURRENCIES[DEFAULT_CURRENCY]
  const value = convertFromBase(baseAmount, code)
  return Math.round(value * (currency.zeroDecimal ? 1 : 100))
}
