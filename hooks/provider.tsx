"use client";

import { CartProvider } from "@/hooks/cartcontext";
import { WishlistProvider } from "@/hooks/wishlistcontext";
import { CurrencyProvider } from "@/hooks/currencycontext";
import { ChatWidget } from "@/components/chat/chat-widget";
import type { CurrencyCode } from "@/lib/currency";

export function Providers({
  initialCurrency,
  children,
}: {
  initialCurrency: CurrencyCode;
  children: React.ReactNode;
}) {
  return (
    <CurrencyProvider initialCurrency={initialCurrency}>
      <CartProvider>
        <WishlistProvider>
          {children}
          <ChatWidget />
        </WishlistProvider>
      </CartProvider>
    </CurrencyProvider>
  );
}
