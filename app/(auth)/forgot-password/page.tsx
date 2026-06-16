"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [devUrl, setDevUrl] = useState<string | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Something went wrong")
        return
      }
      setSent(true)
      if (data.devResetUrl) setDevUrl(data.devResetUrl)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-7">
        {sent ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
            <h1 className="mt-4 text-2xl font-bold uppercase tracking-wider text-white">Check Your Email</h1>
            <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
              If an account exists for {email}, we&apos;ve sent a link to reset your password.
            </p>
            {devUrl && (
              <div className="mt-6 rounded-sm border border-white/10 bg-zinc-900/80 p-3 text-left">
                <p className="text-[10px] uppercase tracking-wider text-gray-500">Dev mode — reset link:</p>
                <Link href={devUrl} className="break-all text-xs text-white underline-offset-4 hover:underline">
                  {devUrl}
                </Link>
              </div>
            )}
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-white">Forgot Password</h1>
            <p className="mt-1.5 text-sm uppercase tracking-wider text-gray-400">
              Enter your email and we&apos;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-gray-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 rounded-sm border-zinc-800 bg-zinc-900/80 pl-10 text-sm text-white placeholder:text-gray-500 focus-visible:ring-white"
                  />
                </div>
              </div>

              {error && (
                <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs uppercase tracking-wider text-red-400">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full rounded-sm bg-white text-sm font-semibold uppercase tracking-wider text-black transition-all duration-300 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          </>
        )}
      </div>

      <Link
        href="/login"
        className="mt-6 flex items-center justify-center gap-2 text-sm uppercase tracking-wider text-gray-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to sign in
      </Link>
    </motion.div>
  )
}
