"use client";

import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/hooks/currencycontext";
import { CURRENCY_LIST, CURRENCIES } from "@/lib/currency";

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const active = CURRENCIES[currency];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 rounded-sm px-2 py-1 text-sm uppercase tracking-wider text-white outline-none transition-colors hover:text-gray-300">
        <span>{active.symbol}</span>
        <span className="hidden sm:inline">{active.code}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[180px] rounded-md border border-gray-700 bg-black p-1">
        {CURRENCY_LIST.map((c) => (
          <DropdownMenuItem
            key={c.code}
            onSelect={() => setCurrency(c.code)}
            className={`flex cursor-pointer items-center justify-between gap-3 rounded-sm px-3 py-2 text-sm uppercase tracking-wider transition-colors focus:bg-gray-800 ${
              c.code === currency ? "text-white" : "text-gray-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="w-4 text-center">{c.symbol}</span>
              {c.code}
            </span>
            <span className="text-[10px] normal-case tracking-normal text-gray-500">{c.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
