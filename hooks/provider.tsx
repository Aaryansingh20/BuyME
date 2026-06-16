"use client";

import { CartProvider } from "@/hooks/cartcontext";
import { WishlistProvider } from "@/hooks/wishlistcontext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
}
