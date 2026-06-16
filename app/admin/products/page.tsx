"use client"

import { useEffect, useMemo, useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Product = {
  slug: string
  name: string
  category: string
  price: number
  stock: number
  active: boolean
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [savingSlug, setSavingSlug] = useState<string | null>(null)
  // Local edit buffers keyed by slug so typing doesn't fight the saved state.
  const [edits, setEdits] = useState<Record<string, { stock: string; price: string }>>({})

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => (r.ok ? r.json() : { products: [] }))
      .then((d) => setProducts(d.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return products
    return products.filter(
      (p) => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    )
  }, [products, query])

  const bufFor = (p: Product) =>
    edits[p.slug] ?? { stock: String(p.stock), price: p.price.toFixed(2) }

  const setBuf = (slug: string, patch: Partial<{ stock: string; price: string }>) =>
    setEdits((e) => ({ ...e, [slug]: { ...(e[slug] ?? { stock: "", price: "" }), ...patch } }))

  const save = async (p: Product) => {
    const buf = bufFor(p)
    const stock = Math.floor(Number(buf.stock))
    const price = Number(buf.price)
    if (!Number.isFinite(stock) || stock < 0 || !Number.isFinite(price) || price < 0) return

    setSavingSlug(p.slug)
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: p.slug, stock, price }),
      })
      if (res.ok) {
        const { product } = await res.json()
        setProducts((list) => list.map((x) => (x.slug === p.slug ? product : x)))
        setEdits((e) => {
          const next = { ...e }
          delete next[p.slug]
          return next
        })
      }
    } finally {
      setSavingSlug(null)
    }
  }

  const toggleActive = async (p: Product) => {
    const res = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: p.slug, active: !p.active }),
    })
    if (res.ok) {
      const { product } = await res.json()
      setProducts((list) => list.map((x) => (x.slug === p.slug ? product : x)))
    }
  }

  const dirty = (p: Product) => {
    const buf = edits[p.slug]
    if (!buf) return false
    return buf.stock !== String(p.stock) || buf.price !== p.price.toFixed(2)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-wider">Inventory</h1>
          <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
            {products.length} products · {products.filter((p) => p.stock <= 5).length} low or out of stock
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="border-white/15 bg-white/[0.04] pl-9 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Product</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-gray-400">Price ($)</TableHead>
              <TableHead className="text-gray-400">Stock</TableHead>
              <TableHead className="text-gray-400">Status</TableHead>
              <TableHead className="text-right text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                  Loading inventory…
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="py-10 text-center text-gray-500">
                  No products match your search.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => {
                const buf = bufFor(p)
                return (
                  <TableRow key={p.slug} className="border-white/10 hover:bg-white/[0.02]">
                    <TableCell className="font-medium text-white">{p.name}</TableCell>
                    <TableCell className="text-gray-400">{p.category}</TableCell>
                    <TableCell>
                      <Input
                        value={buf.price}
                        onChange={(e) => setBuf(p.slug, { price: e.target.value })}
                        inputMode="decimal"
                        className="h-8 w-24 border-white/15 bg-black/40 text-white"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={buf.stock}
                        onChange={(e) => setBuf(p.slug, { stock: e.target.value })}
                        inputMode="numeric"
                        className={`h-8 w-20 border-white/15 bg-black/40 ${
                          p.stock <= 0 ? "text-red-400" : p.stock <= 5 ? "text-amber-400" : "text-white"
                        }`}
                      />
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-xs uppercase tracking-wider ${
                          p.active ? "text-green-400" : "text-gray-500"
                        }`}
                      >
                        {p.active ? "Active" : "Hidden"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          onClick={() => save(p)}
                          disabled={!dirty(p) || savingSlug === p.slug}
                          className="h-8 rounded-sm bg-white text-xs uppercase tracking-wider text-black hover:bg-gray-200 disabled:opacity-40"
                        >
                          {savingSlug === p.slug ? "Saving…" : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleActive(p)}
                          className="h-8 rounded-sm border-white/15 bg-transparent text-xs uppercase tracking-wider text-white hover:bg-white/5 hover:text-white"
                        >
                          {p.active ? "Hide" : "Show"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
