"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  )
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: false,
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const passwordsMatch = form.confirm.length > 0 && form.password === form.confirm

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordsMatch || !form.agree) return
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? "Unable to create account")
        return
      }
      // Full reload so the cart loads fresh for the new account.
      window.location.assign("/")
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
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur-xl sm:p-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider text-white">Create Account</h1>
        <p className="mt-1.5 text-sm uppercase tracking-wider text-gray-400">
          Join BuyME and start your collection.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          {/* Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="block text-xs font-medium uppercase tracking-wider text-gray-300"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="name"
                type="text"
                required
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-10 rounded-sm border-zinc-800 bg-zinc-900/80 pl-10 text-sm text-white placeholder:text-gray-500 focus-visible:ring-white"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-medium uppercase tracking-wider text-gray-300"
            >
              Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-10 rounded-sm border-zinc-800 bg-zinc-900/80 pl-10 text-sm text-white placeholder:text-gray-500 focus-visible:ring-white"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-medium uppercase tracking-wider text-gray-300"
            >
              Password
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

          {/* Confirm password */}
          <div className="space-y-1.5">
            <label
              htmlFor="confirm"
              className="block text-xs font-medium uppercase tracking-wider text-gray-300"
            >
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
                className="h-10 rounded-sm border-zinc-800 bg-zinc-900/80 pl-10 pr-10 text-sm text-white placeholder:text-gray-500 focus-visible:ring-white"
              />
            </div>
            {form.confirm.length > 0 && !passwordsMatch && (
              <p className="text-xs uppercase tracking-wider text-red-400">
                Passwords do not match
              </p>
            )}
          </div>

          {/* Terms */}
          <label className="flex cursor-pointer items-start gap-2 text-xs uppercase tracking-wider text-gray-400">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={(e) => setForm({ ...form, agree: e.target.checked })}
              className="mt-0.5 h-4 w-4 cursor-pointer accent-white"
            />
            <span>
              I agree to the{" "}
              <Link href="#" className="text-white underline-offset-4 hover:underline">
                Terms
              </Link>{" "}
              &{" "}
              <Link href="#" className="text-white underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>

          {error && (
            <p className="rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs uppercase tracking-wider text-red-400">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={!passwordsMatch || !form.agree || loading}
            className="group h-11 w-full rounded-sm bg-white text-sm font-semibold uppercase tracking-wider text-black transition-all duration-300 hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "Creating..." : "Create Account"}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>

        {/* Divider */}
        <div className="my-4 flex items-center gap-4">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs uppercase tracking-wider text-gray-500">or</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        {/* Google */}
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-sm border-white/15 bg-transparent text-sm font-medium uppercase tracking-wider text-white hover:bg-white/5 hover:text-white"
        >
          <a href="/api/auth/google">
            <GoogleIcon />
            Continue with Google
          </a>
        </Button>
      </div>

      <p className="mt-4 text-center text-sm uppercase tracking-wider text-gray-400">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-white underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  )
}
