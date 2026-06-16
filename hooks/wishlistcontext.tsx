"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { StaticImageData } from "next/image";

export interface WishlistItem {
  slug: string;
  name: string;
  price: number;
  image: string;
}

type AddInput = { slug: string; name: string; price: number; image: string | StaticImageData };

type WishlistContextType = {
  items: WishlistItem[];
  count: number;
  has: (slug: string) => boolean;
  toggle: (item: AddInput) => Promise<void>;
  remove: (slug: string) => Promise<void>;
  reload: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const toImageUrl = (image: string | StaticImageData) => (typeof image === "string" ? image : image.src);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);

  const apply = async (res: Response) => {
    if (res.ok) {
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } else if (res.status === 401) {
      setItems([]);
    }
  };

  const reload = useCallback(async () => {
    try {
      await apply(await fetch("/api/wishlist"));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const has = (slug: string) => items.some((i) => i.slug === slug);

  const toggle = async (item: AddInput) => {
    const payload = { slug: item.slug, name: item.name, price: item.price, image: toImageUrl(item.image) };
    if (has(item.slug)) {
      setItems((prev) => prev.filter((i) => i.slug !== item.slug));
      await apply(await fetch(`/api/wishlist?slug=${encodeURIComponent(item.slug)}`, { method: "DELETE" }));
    } else {
      setItems((prev) => [payload, ...prev]);
      await apply(
        await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      );
    }
  };

  const remove = async (slug: string) => {
    setItems((prev) => prev.filter((i) => i.slug !== slug));
    await apply(await fetch(`/api/wishlist?slug=${encodeURIComponent(slug)}`, { method: "DELETE" }));
  };

  const count = items.length;

  return (
    <WishlistContext.Provider value={{ items, count, has, toggle, remove, reload }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
