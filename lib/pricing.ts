// Shared cart/checkout pricing rules. Single source of truth so the cart page,
// checkout page, and the order API never disagree on shipping or totals.

export const FREE_SHIPPING_THRESHOLD = 100
export const SHIPPING_FEE = 9.99

export function computeShipping(subtotal: number): number {
  return subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100
}
