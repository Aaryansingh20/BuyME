"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function ResetPasswordForm() {
  const params = useSearchParams()
  const router = useRouter()
  const token = params.get("token") ?? ""

  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({ password: "", confirm: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [done, setDone] = useState(false)

  const passwordsMatch = form.confirm.length > 0 && form.password === form.confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordsMatch) return
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters")
      return
    }
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Something went wrong")
        return
      }
      setDone(true)
      setTimeout(() => router.push("/login"), 2000)
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
        {done ? (
          <div className="text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-green-400" />
            <h1 className="mt-4 text-2xl font-bold uppercase tracking-wider text-white">Password Updated</h1>
            <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
              Redirecting you to sign in...
            </p>
          </div>
        ) : !token ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase tracking-wider text-white">Invalid Link</h1>
            <p className="mt-2 text-sm uppercase tracking-wider text-gray-400">
              This reset link is missing or invalid. Request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="mt-6 inline-block rounded-sm bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black hover:bg-gray-200"
            >
              Request New Link
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold uppercase tracking-wider text-white">Set New Password</h1>
            <p className="mt-1.5 text-sm uppercase tracking-wider text-gray-400">
              Choose a new password for your account.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="h-10 rounded-sm border-zinc-800 bg-zinc-900/80 pl-10 pr-10 text-sm text-white placeholder:text-gray-500 focus-visible:ring-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm" className="block text-xs font-medium uppercase tracking-wider text-gray-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="confirm"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    className="h-10 rounded-sm border-zinc-800 bg-zinc-900/80 pl-10 text-sm text-white placeholder:text-gray-500 focus-visible:ring-white"
                  />
                </div>
                {form.confirm.length > 0 && !passwordsMatch && (
                  <p className="text-xs uppercase tracking-wider text-red-400">Passwords do not match</p>
                )}
              </div>

              {error && (
                <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs uppercase tracking-wider text-red-400">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={!passwordsMatch || loading}
                className="h-11 w-full rounded-sm bg-white text-sm font-semibold uppercase tracking-wider text-black transition-all duration-300 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? "Updating..." : "Reset Password"}
              </Button>
            </form>
          </>
        )}
      </div>
    </motion.div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
