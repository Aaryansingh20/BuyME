"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Star, Trash2, Search, BadgeCheck } from "lucide-react"
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

type Review = {
  id: string
  slug: string
  rating: number
  comment: string
  verified: boolean
  date: string
  userName: string
  userEmail: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [average, setAverage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    fetch("/api/admin/reviews")
      .then((r) => (r.ok ? r.json() : { reviews: [] }))
      .then((d) => {
        setReviews(d.reviews ?? [])
        setAverage(d.average ?? 0)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return reviews
    return reviews.filter(
      (r) =>
        r.userName.toLowerCase().includes(term) ||
        r.userEmail.toLowerCase().includes(term) ||
        r.slug.toLowerCase().includes(term) ||
        r.comment.toLowerCase().includes(term)
    )
  }, [reviews, query])

  const remove = async (id: string) => {
    const res = await fetch(`/api/admin/reviews?id=${encodeURIComponent(id)}`, { method: "DELETE" })
    if (res.ok) setReviews((list) => list.filter((r) => r.id !== id))
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-wider">Reviews</h1>
          <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
            {reviews.length} review{reviews.length === 1 ? "" : "s"} · {average.toFixed(1)} avg rating
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by user, product, text..."
            className="border-white/15 bg-white/[0.04] pl-9 text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04]">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-gray-400">Customer</TableHead>
              <TableHead className="text-gray-400">Product</TableHead>
              <TableHead className="text-gray-400">Rating</TableHead>
              <TableHead className="text-gray-400">Review</TableHead>
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-right text-gray-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="py-10 text-center text-gray-500">Loading reviews…</TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow className="border-white/10">
                <TableCell colSpan={6} className="py-10 text-center text-gray-500">No reviews found.</TableCell>
              </TableRow>
            ) : (
              filtered.map((r) => (
                <TableRow key={r.id} className="border-white/10 align-top hover:bg-white/[0.02]">
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-white">
                      {r.userName}
                      {r.verified && <BadgeCheck className="h-3.5 w-3.5 text-green-400" />}
                    </div>
                    <div className="text-xs text-gray-500">{r.userEmail}</div>
                  </TableCell>
                  <TableCell>
                    <Link href={`/product/${r.slug}`} className="text-gray-300 underline-offset-2 hover:underline">
                      {r.slug}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"}`}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-sm text-sm text-gray-300">{r.comment}</TableCell>
                  <TableCell className="text-xs text-gray-400">{r.date}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => remove(r.id)}
                      aria-label="Delete review"
                      className="h-8 rounded-sm border-white/15 bg-transparent text-gray-400 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
