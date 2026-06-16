"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { useState, useEffect } from "react"

interface Notification {
  id: string
  message: string
  read: boolean
  createdAt: string
}

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.notifications && setNotifications(data.notifications))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const toggleRead = async (id: string, read: boolean) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read } : n)))
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, read }),
    })
  }

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    })
  }

  const unread = notifications.filter((n) => !n.read).length

  return (
    <Card className="bg-white/[0.04] border-white/10">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl uppercase tracking-wider text-white">
          Notifications{unread > 0 ? ` (${unread})` : ""}
        </CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider text-gray-400">
          Your account activity and updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm uppercase tracking-wider text-gray-500">Loading…</p>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center text-gray-500">
            <Bell className="h-8 w-8" />
            <p className="mt-3 text-sm uppercase tracking-wider">No notifications yet.</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-center justify-between gap-4 border-b border-white/10 py-3 last:border-0"
                >
                  <div>
                    <p className={`text-sm font-medium ${notification.read ? "text-gray-400" : "text-white"}`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Switch
                    checked={!notification.read}
                    onCheckedChange={() => toggleRead(notification.id, notification.read)}
                  />
                </div>
              ))}
            </div>
            <Button
              onClick={markAllRead}
              className="mt-6 rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs"
              size="sm"
            >
              Mark All as Read
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
