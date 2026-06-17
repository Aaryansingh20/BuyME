// Loyalty points rules. Pure + framework-agnostic so both server (orders) and
// client (checkout UI) can share the exact same maths.

// Points equivalent to 1 unit of the base currency (EUR). 100 pts = €1.00.
export const POINTS_PER_UNIT = 100

/** Points earned on an order: 1 point per whole unit of subtotal. */
export function loyaltyPointsFor(subtotal: number): number {
  return Math.max(0, Math.floor(subtotal))
}

/** Convert a points amount into its base-currency value. */
export function pointsToMoney(points: number): number {
  return points / POINTS_PER_UNIT
}

/** Convert a base-currency value into the points needed to cover it. */
export function moneyToPoints(money: number): number {
  return Math.round(money * POINTS_PER_UNIT)
}

/**
 * The most points a shopper can spend on this order: capped by their balance
 * and by the amount still payable (so points can't drive the total negative).
 */
export function maxRedeemablePoints(balance: number, payableBeforePoints: number): number {
  return Math.max(0, Math.min(Math.floor(balance), moneyToPoints(Math.max(0, payableBeforePoints))))
}
