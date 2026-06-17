"use client";

import { useCurrency } from "@/hooks/currencycontext";

/**
 * Renders a base-currency `amount` in the shopper's selected display currency.
 * Works inside both client and server components (it's a client leaf), so it's
 * the single way prices are shown across the storefront.
 */
export function Price({ amount, className }: { amount: number; className?: string }) {
  const { format } = useCurrency();
  return <span className={className}>{format(amount)}</span>;
}
