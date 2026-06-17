"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { Price } from "@/components/ui/price";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "name", label: "Name: A–Z" },
] as const;

// Price brackets are defined in the BASE currency (EUR); labels render in the
// shopper's currency via <Price>. min/max go into the URL for the server to filter.
const PRICE_RANGES: { key: string; label: React.ReactNode; min?: number; max?: number }[] = [
  { key: "u50", label: <>Under <Price amount={50} /></>, max: 50 },
  { key: "50-100", label: <><Price amount={50} />–<Price amount={100} /></>, min: 50, max: 100 },
  { key: "100-200", label: <><Price amount={100} />–<Price amount={200} /></>, min: 100, max: 200 },
  { key: "200", label: <><Price amount={200} /> +</>, min: 200 },
];

export function ShopToolbar({ total }: { total: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const sort = params.get("sort") ?? "featured";
  const min = params.get("min");
  const max = params.get("max");

  // Build a URL from the current params with the given overrides. Any change to
  // sort/price resets pagination back to page 1.
  const buildHref = (updates: Record<string, string | undefined>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined) next.delete(key);
      else next.set(key, value);
    }
    next.delete("page");
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const activeRange = (r: (typeof PRICE_RANGES)[number]) =>
    (r.min?.toString() ?? null) === min && (r.max?.toString() ?? null) === max;

  const priceActive = Boolean(min || max);

  return (
    <div className="mt-6 flex flex-col gap-4 border-y border-white/10 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Price brackets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs uppercase tracking-wider text-gray-500">Price</span>
        {PRICE_RANGES.map((r) => {
          const isActive = activeRange(r);
          return (
            <button
              key={r.key}
              onClick={() =>
                router.push(
                  buildHref({
                    min: isActive ? undefined : r.min?.toString(),
                    max: isActive ? undefined : r.max?.toString(),
                  })
                )
              }
              className={`rounded-sm border px-3 py-1 text-xs uppercase tracking-wider transition-colors ${
                isActive ? "border-white bg-white text-black" : "border-white/15 text-gray-300 hover:bg-white/5"
              }`}
            >
              {r.label}
            </button>
          );
        })}
        {priceActive && (
          <button
            onClick={() => router.push(buildHref({ min: undefined, max: undefined }))}
            className="text-xs uppercase tracking-wider text-gray-500 underline-offset-2 hover:text-white hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Sort + count */}
      <div className="flex items-center gap-3">
        <span className="hidden text-xs uppercase tracking-wider text-gray-500 sm:inline">{total} items</span>
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => router.push(buildHref({ sort: e.target.value }))}
            className="appearance-none rounded-sm border border-white/15 bg-black/40 py-2 pl-3 pr-9 text-xs uppercase tracking-wider text-white outline-none focus:ring-1 focus:ring-white/30"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-black text-white">
                {o.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
    </div>
  );
}
