"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Wallet } from "lucide-react"

interface PaymentMethod {
  id: string
  type: "Credit Card" | "PayPal"
  last4?: string | null
  expiryDate?: string | null
  email?: string | null
}

interface NewMethod {
  type: "Credit Card" | "PayPal"
  last4: string
  expiryDate: string
  email?: string
}

const inputClass =
  "rounded-sm bg-zinc-900/80 text-white border-zinc-800 placeholder:text-gray-500 focus-visible:ring-white text-sm"
const labelClass = "text-xs uppercase tracking-wider text-gray-300"
const primaryBtn = "rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs"
const outlineBtn =
  "rounded-sm border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white uppercase tracking-wider text-xs"
const dangerBtn =
  "rounded-sm border-white/15 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300 uppercase tracking-wider text-xs"

export function PaymentMethods() {
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState({ last4: "", expiryDate: "" })
  const [newMethod, setNewMethod] = useState<NewMethod>({ type: "Credit Card", last4: "", expiryDate: "", email: "" })

  useEffect(() => {
    fetch("/api/payment-methods")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.methods && setMethods(data.methods))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleEdit = (method: PaymentMethod) => {
    setEditingId(method.id)
    setEditValues({ last4: method.last4 ?? "", expiryDate: method.expiryDate ?? "" })
  }

  const handleSave = async (id: string) => {
    const res = await fetch("/api/payment-methods", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editValues }),
    })
    if (res.ok) setMethods((await res.json()).methods)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/payment-methods?id=${id}`, { method: "DELETE" })
    if (res.ok) setMethods((await res.json()).methods)
  }

  const handleAdd = async () => {
    if (newMethod.type === "Credit Card" && !newMethod.last4) return
    if (newMethod.type === "PayPal" && !newMethod.email) return
    const res = await fetch("/api/payment-methods", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMethod),
    })
    if (res.ok) {
      setMethods((await res.json()).methods)
      setNewMethod({ type: "Credit Card", last4: "", expiryDate: "", email: "" })
    }
  }

  return (
    <Card className="bg-white/[0.04] border-white/10">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl uppercase tracking-wider text-white">Payment Methods</CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider text-gray-400">
          Manage your payment options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {loading ? (
            <p className="text-sm uppercase tracking-wider text-gray-500">Loading…</p>
          ) : methods.length === 0 ? (
            <p className="text-sm uppercase tracking-wider text-gray-500">No payment methods saved yet.</p>
          ) : (
            methods.map((method) => (
              <div
                key={method.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 last:border-0"
              >
                {editingId === method.id ? (
                  <div className="space-y-2 w-full">
                    <Label className={labelClass}>Card Number (last 4 digits)</Label>
                    <Input
                      value={editValues.last4}
                      onChange={(e) => setEditValues({ ...editValues, last4: e.target.value })}
                      className={inputClass}
                      maxLength={4}
                    />
                    <Label className={labelClass}>Expiry Date</Label>
                    <Input
                      value={editValues.expiryDate}
                      onChange={(e) => setEditValues({ ...editValues, expiryDate: e.target.value })}
                      className={inputClass}
                      placeholder="MM/YY"
                    />
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                      <Button onClick={() => handleSave(method.id)} className={`w-full sm:w-auto ${primaryBtn}`}>
                        Save
                      </Button>
                      <Button onClick={() => setEditingId(null)} variant="outline" className={`w-full sm:w-auto ${outlineBtn}`}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                      <div className="bg-white/5 p-2 rounded-full">
                        {method.type === "Credit Card" ? (
                          <CreditCard className="h-5 w-5 text-gray-300" />
                        ) : (
                          <Wallet className="h-5 w-5 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium uppercase tracking-wider text-white text-sm sm:text-base">{method.type}</p>
                        {method.type === "Credit Card" ? (
                          <p className="text-xs sm:text-sm text-gray-400">**** **** **** {method.last4}</p>
                        ) : (
                          <p className="text-xs sm:text-sm text-gray-400">{method.email}</p>
                        )}
                        {method.expiryDate && (
                          <p className="text-xs sm:text-sm text-gray-400">Expires: {method.expiryDate}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      {method.type === "Credit Card" && (
                        <Button onClick={() => handleEdit(method)} variant="outline" className={`w-full sm:w-auto ${outlineBtn}`}>
                          Edit
                        </Button>
                      )}
                      <Button onClick={() => handleDelete(method.id)} variant="outline" className={`w-full sm:w-auto ${dangerBtn}`}>
                        Delete
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
        <div className="mt-6 space-y-2">
          <Label className={labelClass}>Payment Type</Label>
          <select
            value={newMethod.type}
            onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value as "Credit Card" | "PayPal" })}
            className="w-full rounded-sm border border-zinc-800 bg-zinc-900/80 p-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white"
          >
            <option>Credit Card</option>
            <option>PayPal</option>
          </select>
          {newMethod.type === "Credit Card" ? (
            <>
              <Label className={labelClass}>Card Number (last 4 digits)</Label>
              <Input
                value={newMethod.last4}
                onChange={(e) => setNewMethod({ ...newMethod, last4: e.target.value })}
                className={inputClass}
                maxLength={4}
              />
              <Label className={labelClass}>Expiry Date</Label>
              <Input
                value={newMethod.expiryDate}
                onChange={(e) => setNewMethod({ ...newMethod, expiryDate: e.target.value })}
                className={inputClass}
                placeholder="MM/YY"
              />
            </>
          ) : (
            <>
              <Label className={labelClass}>PayPal Email</Label>
              <Input
                value={newMethod.email || ""}
                onChange={(e) => setNewMethod({ ...newMethod, email: e.target.value })}
                className={inputClass}
                type="email"
              />
            </>
          )}
          <Button onClick={handleAdd} className={`w-full sm:w-auto mt-4 ${primaryBtn}`}>
            Add New Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
