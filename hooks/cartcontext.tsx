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

// Guests get a cart that lives in the browser until they sign in. On login it is
// merged into their server cart (see reloadCart) so nothing they picked is lost.
const GUEST_KEY = "buyme_guest_cart_v1";

const readGuest = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuest = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
};

const mergeLine = (list: CartItem[], item: CartItem): CartItem[] => {
  const idx = list.findIndex((i) => i.slug === item.slug && i.size === item.size);
  if (idx >= 0) {
    const next = [...list];
    next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
    return next;
  }
  return [...list, item];
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  // null = unknown yet; false = guest (localStorage); true = signed in (server).
  const [authed, setAuthed] = useState<boolean | null>(null);

  const applyResponse = async (res: Response) => {
    if (res.ok) {
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    }
  };

  const reloadCart = useCallback(async () => {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        // Signed in. Fold any cart the shopper built as a guest into the server
        // cart exactly once, then forget the local copy.
        const guest = readGuest();
        if (guest.length) {
          writeGuest([]);
          await Promise.all(
            guest.map((it) =>
              fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(it),
              }).catch(() => {})
            )
          );
          await applyResponse(await fetch("/api/cart"));
        } else {
          await applyResponse(res);
        }
        setAuthed(true);
      } else if (res.status === 401) {
        setAuthed(false);
        setItems(readGuest());
      }
    } catch {
      setAuthed(false);
      setItems(readGuest());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadCart();
  }, [reloadCart]);

  const addToCart = async (item: AddToCartInput) => {
    const payload: CartItem = {
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: toImageUrl(item.image),
      size: item.size ?? "",
      quantity: item.quantity ?? 1,
    };
    // Optimistic update for snappy UI; persist locally while we're a guest.
    setItems((prev) => {
      const next = mergeLine(prev, payload);
      if (!authed) writeGuest(next);
      return next;
    });
    if (authed) {
      await applyResponse(
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      );
    }
  };

  const updateQuantity = async (slug: string, quantity: number, size = "") => {
    setItems((prev) => {
      const next =
        quantity <= 0
          ? prev.filter((i) => !(i.slug === slug && i.size === size))
          : prev.map((i) => (i.slug === slug && i.size === size ? { ...i, quantity } : i));
      if (!authed) writeGuest(next);
      return next;
    });
    if (authed) {
      await applyResponse(
        await fetch("/api/cart", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, size, quantity }),
        })
      );
    }
  };

  const removeFromCart = async (slug: string, size = "") => {
    setItems((prev) => {
      const next = prev.filter((i) => !(i.slug === slug && i.size === size));
      if (!authed) writeGuest(next);
      return next;
    });
    if (authed) {
      await applyResponse(
        await fetch(`/api/cart?slug=${encodeURIComponent(slug)}&size=${encodeURIComponent(size)}`, {
          method: "DELETE",
        })
      );
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (authed) {
      await applyResponse(await fetch("/api/cart", { method: "DELETE" }));
    } else {
      writeGuest([]);
    }
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
