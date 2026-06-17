import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

const base =
  "flex h-9 min-w-9 items-center justify-center rounded-sm border px-3 text-xs uppercase tracking-wider transition-colors"

function Cell({
  href,
  children,
  active,
  disabled,
  label,
}: {
  href: string
  children: React.ReactNode
  active?: boolean
  disabled?: boolean
  label?: string
}) {
  if (disabled) {
    return (
      <span className={`${base} cursor-not-allowed border-white/10 text-gray-600`} aria-label={label}>
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className={`${base} ${active ? "border-white bg-white text-black" : "border-white/15 text-gray-300 hover:bg-white/5"}`}
    >
      {children}
    </Link>
  )
}

/**
 * URL-based pagination shared by the shop and search pages. `hrefFor(page)`
 * builds the link for a given 1-based page number.
 */
export function Pagination({
  current,
  pageCount,
  hrefFor,
}: {
  current: number
  pageCount: number
  hrefFor: (page: number) => string
}) {
  if (pageCount <= 1) return null
  return (
    <div className="mt-12 flex items-center justify-center gap-1">
      <Cell href={hrefFor(current - 1)} disabled={current <= 1} label="Previous page">
        <ChevronLeft className="h-4 w-4" />
      </Cell>
      {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
        <Cell key={n} href={hrefFor(n)} active={n === current}>
          {n}
        </Cell>
      ))}
      <Cell href={hrefFor(current + 1)} disabled={current >= pageCount} label="Next page">
        <ChevronRight className="h-4 w-4" />
      </Cell>
    </div>
  )
}
