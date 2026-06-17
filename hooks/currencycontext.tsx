"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  type CurrencyCode,
  CURRENCY_COOKIE,
  convertFromBase,
  formatMoney,
  normalizeCurrency,
} from "@/lib/currency";

type CurrencyContextType = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  /** Format a base-currency amount in the active display currency. */
  format: (baseAmount: number) => string;
  /** Convert a base-currency amount into the active display currency. */
  convert: (baseAmount: number) => number;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const ONE_YEAR = 60 * 60 * 24 * 365;

export function CurrencyProvider({
  initialCurrency,
  children,
}: {
  initialCurrency: CurrencyCode;
  children: React.ReactNode;
}) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(initialCurrency);
  const router = useRouter();

  const setCurrency = useCallback(
    (code: CurrencyCode) => {
      const next = normalizeCurrency(code);
      setCurrencyState(next);
      document.cookie = `${CURRENCY_COOKIE}=${next};path=/;max-age=${ONE_YEAR};samesite=lax`;
      // Refresh so server components (orders, checkout success, …) re-read the cookie.
      router.refresh();
    },
    [router]
  );

  const format = useCallback((baseAmount: number) => formatMoney(baseAmount, currency), [currency]);
  const convert = useCallback((baseAmount: number) => convertFromBase(baseAmount, currency), [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, convert }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};
