// Brand logo lockup: a square "B" mark + the BUYME wordmark (with a muted "me").
// Presentational only — wrap it in your own <Link> where needed.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex select-none items-center gap-2 ${className}`}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-white text-base font-extrabold leading-none text-black shadow-sm">
        B
      </span>
      <span className="text-2xl font-bold uppercase leading-none tracking-[0.18em] text-white">
        Buy<span className="text-white/55">me</span>
      </span>
    </span>
  )
}
