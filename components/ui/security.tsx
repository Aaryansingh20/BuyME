"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { useState, useEffect, FormEvent } from "react"

const inputClass =
  "rounded-sm bg-zinc-900/80 text-white border-zinc-800 placeholder:text-gray-500 focus-visible:ring-white text-sm"
const labelClass = "text-xs uppercase tracking-wider text-gray-300"

interface LoginEvent {
  id: string
  device: string
  ip: string | null
  method: string
  createdAt: string
}

export function SecuritySettings() {
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [status, setStatus] = useState<{ type: "error" | "success"; message: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<LoginEvent[]>([])
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    fetch("/api/auth/login-history")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.history && setHistory(data.history))
      .catch(() => {})
      .finally(() => setHistoryLoading(false))
  }, [])

  const inputType = showPassword ? "text" : "password"

  const handlePasswordChange = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus(null)

    if (passwordData.new !== passwordData.confirm) {
      setStatus({ type: "error", message: "New passwords do not match" })
      return
    }
    if (passwordData.new.length < 8) {
      setStatus({ type: "error", message: "New password must be at least 8 characters" })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: "error", message: data.error ?? "Could not change password" })
        return
      }
      setStatus({ type: "success", message: "Password updated successfully" })
      setPasswordData({ current: "", new: "", confirm: "" })
    } catch {
      setStatus({ type: "error", message: "Something went wrong. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-white/[0.04] border-white/10">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl uppercase tracking-wider text-white">Security Settings</CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider text-gray-400">
          Manage your account security
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password" className={labelClass}>Current Password</Label>
            <div className="relative">
              <Input
                id="current-password"
                type={inputType}
                value={passwordData.current}
                onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                className={`${inputClass} pr-10`}
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
            <Label htmlFor="new-password" className={labelClass}>New Password</Label>
            <div className="relative">
              <Input
                id="new-password"
                type={inputType}
                value={passwordData.new}
                onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })}
                className={`${inputClass} pr-10`}
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
            <Label htmlFor="confirm-password" className={labelClass}>Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={inputType}
                value={passwordData.confirm}
                onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })}
                className={`${inputClass} pr-10`}
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
          {status && (
            <p
              className={`rounded-sm border px-3 py-2 text-xs uppercase tracking-wider ${
                status.type === "error"
                  ? "border-red-500/30 bg-red-500/10 text-red-400"
                  : "border-green-500/30 bg-green-500/10 text-green-400"
              }`}
            >
              {status.message}
            </p>
          )}
          <Button
            type="submit"
            disabled={loading}
            className="rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs disabled:opacity-60"
            size="sm"
          >
            {loading ? "Updating..." : "Change Password"}
          </Button>
        </form>
        <div className="flex items-center justify-between border-t border-white/10 pt-6">
          <div>
            <p className="font-medium uppercase tracking-wider text-white">Two-Factor Authentication</p>
            <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
          </div>
          <span className="rounded-sm border border-white/15 px-2 py-1 text-[10px] uppercase tracking-wider text-gray-400">
            Coming soon
          </span>
        </div>
        <div className="border-t border-white/10 pt-6">
          <p className="font-medium uppercase tracking-wider text-white">Login History</p>
          <p className="text-sm text-gray-400">Recent account activity</p>
          {historyLoading ? (
            <p className="mt-3 text-sm text-gray-500">Loading…</p>
          ) : history.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No recent sign-ins recorded yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {history.map((e) => (
                <li key={e.id} className="flex flex-wrap items-baseline gap-x-2 text-sm text-gray-300">
                  <span className="text-gray-400">
                    {new Date(e.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                  <span className="text-gray-600">—</span>
                  <span>
                    {e.device}
                    {e.method === "google" && " · via Google"}
                  </span>
                  {e.ip && <span className="text-xs text-gray-500">({e.ip})</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
