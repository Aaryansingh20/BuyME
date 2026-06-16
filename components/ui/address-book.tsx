"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Home, Phone, Plus, MapPin } from "lucide-react"
import { AddressFields, emptyAddressForm, type AddressFormState } from "@/components/ui/address-fields"

interface Address {
  id: string
  name: string
  phone: string | null
  line1: string | null
  city: string | null
  state: string | null
  pincode: string | null
  country: string | null
  address: string
  isDefault: boolean
}

type FormState = AddressFormState
const emptyForm = emptyAddressForm

const primaryBtn = "rounded-sm bg-white text-black hover:bg-gray-200 uppercase tracking-wider text-xs"
const outlineBtn =
  "rounded-sm border-white/15 bg-transparent text-white hover:bg-white/5 hover:text-white uppercase tracking-wider text-xs"
const dangerBtn =
  "rounded-sm border-white/15 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300 uppercase tracking-wider text-xs"

function toForm(a: Address): FormState {
  return {
    name: a.name ?? "",
    phone: a.phone ?? "",
    line1: a.line1 ?? "",
    city: a.city ?? "",
    state: a.state ?? "",
    pincode: a.pincode ?? "",
    country: a.country ?? "",
  }
}

export function AddressBook() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValues, setEditValues] = useState<FormState>(emptyForm)
  const [adding, setAdding] = useState(false)
  const [newAddress, setNewAddress] = useState<FormState>(emptyForm)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/addresses")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data?.addresses && setAddresses(data.addresses))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleEdit = (addr: Address) => {
    setError("")
    setEditingId(addr.id)
    setEditValues(toForm(addr))
  }

  const handleSave = async (id: string) => {
    setError("")
    const res = await fetch("/api/addresses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...editValues }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error ?? "Could not save address")
      return
    }
    setAddresses(data.addresses)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/addresses?id=${id}`, { method: "DELETE" })
    if (res.ok) setAddresses((await res.json()).addresses)
  }

  const handleAdd = async () => {
    setError("")
    const res = await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newAddress),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      setError(data.error ?? "Could not add address")
      return
    }
    setAddresses(data.addresses)
    setNewAddress(emptyForm)
    setAdding(false)
  }

  const handleSetDefault = async (id: string) => {
    const res = await fetch("/api/addresses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isDefault: true }),
    })
    if (res.ok) setAddresses((await res.json()).addresses)
  }

  return (
    <Card className="bg-white/[0.04] border-white/10">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl uppercase tracking-wider text-white">Address Book</CardTitle>
        <CardDescription className="text-xs uppercase tracking-wider text-gray-400">
          Manage your shipping addresses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <p className="text-sm uppercase tracking-wider text-gray-500">Loading…</p>
          ) : addresses.length === 0 ? (
            <p className="text-sm uppercase tracking-wider text-gray-500">No addresses saved yet.</p>
          ) : (
            addresses.map((address) =>
              editingId === address.id ? (
                <div key={address.id} className="rounded-lg border border-white/10 bg-zinc-900/40 p-4">
                  <AddressFields value={editValues} onChange={setEditValues} />
                  {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Button onClick={() => handleSave(address.id)} className={`${primaryBtn} flex-1`}>
                      Save
                    </Button>
                    <Button onClick={() => setEditingId(null)} variant="outline" className={`${outlineBtn} flex-1`}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div key={address.id} className="rounded-lg border border-white/10 bg-zinc-900/40 p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-white/5 p-2">
                      <Home className="h-5 w-5 text-gray-300" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium uppercase tracking-wider text-white">{address.name}</p>
                        {address.isDefault && (
                          <span className="rounded-sm border border-white/15 bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gray-200">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-1 flex items-start gap-1.5 text-sm text-gray-400">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        {address.address}
                      </p>
                      {address.phone && (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          {address.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <Button onClick={() => handleEdit(address)} variant="outline" className={`w-full sm:w-auto ${outlineBtn}`}>
                      Edit
                    </Button>
                    <Button onClick={() => handleDelete(address.id)} variant="outline" className={`w-full sm:w-auto ${dangerBtn}`}>
                      Delete
                    </Button>
                    {!address.isDefault && (
                      <Button onClick={() => handleSetDefault(address.id)} variant="outline" className={`w-full sm:w-auto ${outlineBtn}`}>
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>

        {/* Add new */}
        <div className="mt-6">
          {adding ? (
            <div className="rounded-lg border border-white/10 bg-zinc-900/40 p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-white">New Address</h3>
              <AddressFields value={newAddress} onChange={setNewAddress} />
              {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button onClick={handleAdd} className={`${primaryBtn} flex-1`}>
                  Save Address
                </Button>
                <Button
                  onClick={() => {
                    setAdding(false)
                    setError("")
                    setNewAddress(emptyForm)
                  }}
                  variant="outline"
                  className={`${outlineBtn} flex-1`}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={() => { setAdding(true); setError("") }} size="sm" className={primaryBtn}>
              <Plus className="h-4 w-4" />
              Add New Address
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
