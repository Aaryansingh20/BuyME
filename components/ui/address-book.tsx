"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Home } from "lucide-react"

interface Address {
  id: string
  name: string
  address: string
  isDefault: boolean
}

interface AddressBookProps {
  addresses: Address[]
}

export function AddressBook({ addresses: initialAddresses }: AddressBookProps) {
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newAddress, setNewAddress] = useState<Omit<Address, "id" | "isDefault">>({ name: "", address: "" })

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = (id: string) => {
    setAddresses(addresses.map((addr) => (addr.id === id ? { ...addr, ...newAddress } : addr)))
    setEditingId(null)
    setNewAddress({ name: "", address: "" })
  }

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id))
  }

  const handleAdd = () => {
    if (newAddress.name && newAddress.address) {
      setAddresses([...addresses, { id: Date.now().toString(), ...newAddress, isDefault: false }])
      setNewAddress({ name: "", address: "" })
    }
  }

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map((addr) => ({ ...addr, isDefault: addr.id === id })))
  }

  return (
    <Card className="bg-zinc-900 border-zinc-800 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-zinc-100">Address Book</CardTitle>
        <CardDescription className="text-sm sm:text-base text-zinc-400">Manage your shipping addresses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {addresses.map((address) => (
            <div key={address.id} className="flex flex-col border-b border-zinc-800 pb-6 last:border-0 mb-6">
              {editingId === address.id ? (
                <div className="space-y-2 w-full">
                  <Input
                    value={newAddress.name || address.name}
                    onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                    className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600"
                    placeholder="Address Name"
                  />
                  <Input
                    value={newAddress.address || address.address}
                    onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                    className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600"
                    placeholder="Full Address"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={() => handleSave(address.id)}
                      className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200 flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="outline"
                      className="text-zinc-100 border-zinc-700 hover:bg-zinc-800 flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col">
                  <div className="flex items-start space-x-4 mb-4">
                    <div className="bg-zinc-800 p-2 rounded-full">
                      <Home className="h-5 w-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="font-medium text-zinc-100">{address.name}</p>
                      <p className="text-sm text-zinc-400">{address.address}</p>
                      {address.isDefault && (
                        <span className="text-xs bg-green-600 text-zinc-100 px-2 py-1 rounded-full mt-1 inline-block">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <Button
                      onClick={() => handleEdit(address.id)}
                      variant="outline"
                      className="w-full sm:w-auto bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(address.id)}
                      variant="outline"
                      className="w-full sm:w-auto bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                    >
                      Delete
                    </Button>
                    {!address.isDefault && (
                      <Button
                        onClick={() => handleSetDefault(address.id)}
                        variant="outline"
                        className="w-full sm:w-auto bg-zinc-100 text-zinc-900 hover:bg-zinc-200"
                      >
                        Set as Default
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2">
          <Input
            placeholder="Address Name (e.g., Home, Work)"
            value={newAddress.name}
            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
            className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600"
          />
          <Input
            placeholder="Full Address"
            value={newAddress.address}
            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
            className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-600 focus:ring-zinc-600"
          />
          <Button onClick={handleAdd} className="w-full bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
            Add New Address
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

