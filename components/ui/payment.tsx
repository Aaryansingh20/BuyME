"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, ShoppingCartIcon as PaypalIcon } from "lucide-react"

interface PaymentMethod {
  id: string
  type: "Credit Card" | "PayPal"
  last4?: string
  expiryDate?: string
  email?: string
}

interface PaymentMethodsProps {
  methods: PaymentMethod[]
}

interface NewMethod {
  type: "Credit Card" | "PayPal"
  last4: string
  expiryDate: string
  email?: string
}

export function PaymentMethods({ methods: initialMethods }: PaymentMethodsProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>(initialMethods)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newMethod, setNewMethod] = useState<NewMethod>({ type: "Credit Card", last4: "", expiryDate: "" })

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string) => {
    setMethods(methods.map((method) => (method.id === id ? { ...method, ...newMethod } : method)))
    setEditingId(null)
    setNewMethod({ type: "Credit Card", last4: "", expiryDate: "" })
  }

  const handleDelete = (id: string) => {
    setMethods(methods.filter((method) => method.id !== id))
  }

  const handleAdd = () => {
    if (newMethod.type && (newMethod.last4 || newMethod.email)) {
      setMethods([...methods, { id: Date.now().toString(), ...newMethod }])
      setNewMethod({ type: "Credit Card", last4: "", expiryDate: "" })
    }
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-zinc-100">Payment Methods</CardTitle>
        <CardDescription className="text-sm sm:text-base text-zinc-400">Manage your payment options</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {methods.map((method) => (
            <div
              key={method.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-800 pb-4 last:border-0"
            >
              {editingId === method.id ? (
                <div className="space-y-2 w-full">
                  <Label className="text-zinc-300 text-sm">Card Number (last 4 digits)</Label>
                  <Input
                    value={newMethod.last4 || method.last4 || ""}
                    onChange={(e) => setNewMethod({ ...newMethod, last4: e.target.value })}
                    className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                    maxLength={4}
                  />
                  <Label className="text-zinc-300 text-sm">Expiry Date</Label>
                  <Input
                    value={newMethod.expiryDate || method.expiryDate || ""}
                    onChange={(e) => setNewMethod({ ...newMethod, expiryDate: e.target.value })}
                    className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                    placeholder="MM/YY"
                  />
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
                    <Button
                      onClick={() => handleSave(method.id)}
                      className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 w-full sm:w-auto text-sm"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outline"
                      className="text-zinc-100 border-zinc-700 hover:bg-zinc-800 w-full sm:w-auto text-sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <div className="bg-zinc-800 p-2 rounded-full">
                      {method.type === "Credit Card" ? (
                        <CreditCard className="h-5 w-5 text-zinc-400" />
                      ) : (
                        <PaypalIcon className="h-5 w-5 text-zinc-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-100 text-sm sm:text-base">{method.type}</p>
                      {method.type === "Credit Card" ? (
                        <p className="text-xs sm:text-sm text-zinc-400">**** **** **** {method.last4}</p>
                      ) : (
                        <p className="text-xs sm:text-sm text-zinc-400">{method.email}</p>
                      )}
                      {method.expiryDate && (
                        <p className="text-xs sm:text-sm text-zinc-400">Expires: {method.expiryDate}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button
                      onClick={() => handleEdit(method.id)}
                      variant="outline"
                      className="text-zinc-900 hover:bg-zinc-200 w-full sm:w-auto text-sm"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(method.id)}
                      variant="outline"
                      className="text-red-400 border-zinc-700 hover:bg-zinc-800 w-full sm:w-auto text-sm"
                    >
                      Delete
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2">
          <Label className="text-zinc-300 text-sm">Payment Type</Label>
          <select
            value={newMethod.type}
            onChange={(e) => setNewMethod({ ...newMethod, type: e.target.value as "Credit Card" | "PayPal" })}
            className="w-full p-2 bg-zinc-800 text-zinc-100 border border-zinc-700 rounded-md focus:border-zinc-500 focus:ring-zinc-500 text-sm"
          >
            <option>Credit Card</option>
            <option>PayPal</option>
          </select>
          {newMethod.type === "Credit Card" ? (
            <>
              <Label className="text-zinc-300 text-sm">Card Number (last 4 digits)</Label>
              <Input
                value={newMethod.last4}
                onChange={(e) => setNewMethod({ ...newMethod, last4: e.target.value })}
                className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                maxLength={4}
              />
              <Label className="text-zinc-300 text-sm">Expiry Date</Label>
              <Input
                value={newMethod.expiryDate}
                onChange={(e) => setNewMethod({ ...newMethod, expiryDate: e.target.value })}
                className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                placeholder="MM/YY"
              />
            </>
          ) : (
            <>
              <Label className="text-zinc-300 text-sm">PayPal Email</Label>
              <Input
                value={newMethod.email || ""}
                onChange={(e) => setNewMethod({ ...newMethod, email: e.target.value })}
                className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-500 focus:ring-zinc-500 text-sm"
                type="email"
              />
            </>
          )}
          <Button
            onClick={handleAdd}
            className="bg-zinc-100 w-full sm:w-auto text-zinc-900 hover:bg-zinc-200 text-sm mt-4"
          >
            Add New Payment Method
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

