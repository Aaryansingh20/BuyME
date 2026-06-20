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

// Like the cart, a guest's wishlist lives in the browser until they sign in, at
// which point it is merged into their server wishlist.
const GUEST_KEY = "buyme_guest_wishlist_v1";

const readGuest = (): WishlistItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(GUEST_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeGuest = (items: WishlistItem[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  // null = unknown yet; false = guest (localStorage); true = signed in (server).
  const [authed, setAuthed] = useState<boolean | null>(null);

  const apply = async (res: Response) => {
    if (res.ok) {
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    }
  };

  const reload = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        // Signed in. Merge any guest wishlist into the server one, once.
        const guest = readGuest();
        if (guest.length) {
          writeGuest([]);
          await Promise.all(
            guest.map((it) =>
              fetch("/api/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(it),
              }).catch(() => {})
            )
          );
          await apply(await fetch("/api/wishlist"));
        } else {
          await apply(res);
        }
        setAuthed(true);
      } else if (res.status === 401) {
        setAuthed(false);
        setItems(readGuest());
      }
    } catch {
      setAuthed(false);
      setItems(readGuest());
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const has = (slug: string) => items.some((i) => i.slug === slug);

  const toggle = async (item: AddInput) => {
    const payload = { slug: item.slug, name: item.name, price: item.price, image: toImageUrl(item.image) };
    const removing = has(item.slug);
    setItems((prev) => {
      const next = removing ? prev.filter((i) => i.slug !== item.slug) : [payload, ...prev];
      if (!authed) writeGuest(next);
      return next;
    });
    if (!authed) return;
    if (removing) {
      await apply(await fetch(`/api/wishlist?slug=${encodeURIComponent(item.slug)}`, { method: "DELETE" }));
    } else {
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
    setItems((prev) => {
      const next = prev.filter((i) => i.slug !== slug);
      if (!authed) writeGuest(next);
      return next;
    });
    if (authed) {
      await apply(await fetch(`/api/wishlist?slug=${encodeURIComponent(slug)}`, { method: "DELETE" }));
    }
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
