"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { StaticImageData } from "next/image";

export interface CartItem {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
}

type AddToCartInput = {
  slug: string;
  name: string;
  price: number;
  image: string | StaticImageData;
  size?: string;
  quantity?: number;
};

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  loading: boolean;
  addToCart: (item: AddToCartInput) => Promise<void>;
  removeFromCart: (slug: string, size?: string) => Promise<void>;
  updateQuantity: (slug: string, quantity: number, size?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  reloadCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// StaticImageData (local imports) → store its resolved URL string so it serializes to the DB.
const toImageUrl = (image: string | StaticImageData) =>
  typeof image === "string" ? image : image.src;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const applyResponse = async (res: Response) => {
    if (res.ok) {
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } else if (res.status === 401) {
      // Not logged in — empty cart.
      setItems([]);
    }
  };

  const reloadCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      await applyResponse(res);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadCart();
  }, [reloadCart]);

  const addToCart = async (item: AddToCartInput) => {
    const payload = {
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: toImageUrl(item.image),
      size: item.size ?? "",
      quantity: item.quantity ?? 1,
    };
    // Optimistic update for snappy UI.
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.slug === payload.slug && i.size === payload.size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + payload.quantity };
        return next;
      }
      return [...prev, payload];
    });
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    await applyResponse(res);
  };

  const updateQuantity = async (slug: string, quantity: number, size = "") => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.slug === slug && i.size === size))
        : prev.map((i) => (i.slug === slug && i.size === size ? { ...i, quantity } : i))
    );
    const res = await fetch("/api/cart", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, size, quantity }),
    });
    await applyResponse(res);
  };

  const removeFromCart = async (slug: string, size = "") => {
    setItems((prev) => prev.filter((i) => !(i.slug === slug && i.size === size)));
    const res = await fetch(`/api/cart?slug=${encodeURIComponent(slug)}&size=${encodeURIComponent(size)}`, {
      method: "DELETE",
    });
    await applyResponse(res);
  };

  const clearCart = async () => {
    setItems([]);
    const res = await fetch("/api/cart", { method: "DELETE" });
    await applyResponse(res);
  };

  const count = items.reduce((n, i) => n + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, loading, addToCart, removeFromCart, updateQuantity, clearCart, reloadCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
