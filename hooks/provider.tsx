"use client";

import { CartProvider } from "@/hooks/cartcontext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
