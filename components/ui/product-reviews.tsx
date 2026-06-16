"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Star, BadgeCheck, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Review = { id: string; name: string; rating: number; comment: string; date: string; verified: boolean }

type Props = {
  slug: string
  // Lets the host page reflect the live average/count in its own header.
  onStats?: (average: number, count: number) => void
}

export function ProductReviews({ slug, onStats }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [average, setAverage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState<{ loggedIn: boolean; name: string }>({ loggedIn: false, name: "" })

  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Keep onStats in a ref so the host can pass an inline callback without
  // re-triggering the load effect each render.
  const onStatsRef = useRef(onStats)
  onStatsRef.current = onStats

  const load = useCallback(async () => {
    const res = await fetch(`/api/reviews?slug=${encodeURIComponent(slug)}`)
    if (!res.ok) return
    const data = await res.json()
    setReviews(data.reviews ?? [])
    setAverage(data.average ?? 0)
    onStatsRef.current?.(data.average ?? 0, data.count ?? 0)
  }, [slug])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setAuth({ loggedIn: Boolean(d?.user), name: d?.user?.name ?? "" }))
      .catch(() => setAuth({ loggedIn: false, name: "" }))
  }, [])

  const submit = async () => {
    setError("")
    if (!comment.trim()) {
      setError("Please write a few words before submitting.")
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, rating, comment }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error ?? "Could not submit your review.")
        return
      }
      setReviews(data.reviews ?? [])
      setAverage(data.average ?? 0)
      onStatsRef.current?.(data.average ?? 0, data.count ?? 0)
      setComment("")
      setRating(5)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const rounded = Math.round(average * 10) / 10

  return (
    <div className="space-y-6 text-left">
      {/* Summary */}
      <div className="flex items-center gap-5 rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
        <div className="text-center">
          <div className="text-4xl font-bold leading-none text-white">{rounded.toFixed(1)}</div>
          <div className="mt-2 flex justify-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < Math.round(average) ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"}`}
              />
            ))}
          </div>
        </div>
        <div className="h-12 w-px bg-zinc-800" />
        <div>
          <p className="text-sm font-medium text-white">
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </p>
          <p className="text-xs text-zinc-500">
            {reviews.length === 0 ? "Be the first to share your thoughts" : "From verified shoppers and the community"}
          </p>
        </div>
      </div>

      {/* Write a review */}
      {auth.loggedIn ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Write a review</h3>
            <span className="text-xs text-zinc-500">Posting as {auth.name || "you"}</span>
          </div>
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                aria-label={`Rate ${value} star${value === 1 ? "" : "s"}`}
                className="p-0.5"
              >
                <Star
                  className={`h-6 w-6 transition-colors ${
                    (hover || rating) >= value ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like or dislike? How is the fit and quality?"
            className="mt-3 min-h-[90px] border-zinc-800 bg-zinc-950 text-white placeholder:text-zinc-600"
          />
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
          <Button
            onClick={submit}
            disabled={submitting}
            className="mt-3 rounded-sm bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-gray-200 disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit review"}
          </Button>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 text-sm text-zinc-400">
          <Link href="/login" className="font-medium text-white underline">
            Sign in
          </Link>{" "}
          to write a review.
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading reviews…</p>
        ) : reviews.length === 0 ? (
          <div className="flex flex-col items-center rounded-xl border border-dashed border-zinc-800 py-10 text-center text-zinc-500">
            <MessageSquare className="h-8 w-8" />
            <p className="mt-3 text-sm">No reviews yet.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold uppercase text-white">
                  {review.name.charAt(0) || "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-white">{review.name}</p>
                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-green-400">
                        <BadgeCheck className="h-3 w-3" /> Verified Purchase
                      </span>
                    )}
                    <span className="ml-auto text-xs text-zinc-500">{review.date}</span>
                  </div>
                  <div className="mt-1 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"}`}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-zinc-300">{review.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
