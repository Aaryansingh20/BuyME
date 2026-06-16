"use client"

import { Input } from "@/components/ui/input"

export type AddressFormState = {
  name: string
  phone: string
  line1: string
  city: string
  state: string
  pincode: string
  country: string
}

export const emptyAddressForm: AddressFormState = {
  name: "",
  phone: "",
  line1: "",
  city: "",
  state: "",
  pincode: "",
  country: "",
}

const defaultInputClass =
  "rounded-sm bg-zinc-900/80 text-white border-zinc-800 placeholder:text-gray-500 focus-visible:ring-white text-sm"

// Structured address inputs, shared by the profile Address Book and checkout.
export function AddressFields({
  value,
  onChange,
  inputClassName = defaultInputClass,
}: {
  value: AddressFormState
  onChange: (next: AddressFormState) => void
  inputClassName?: string
}) {
  const set = (patch: Partial<AddressFormState>) => onChange({ ...value, ...patch })
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      <Input placeholder="Label (e.g. Home, Work)" value={value.name} onChange={(e) => set({ name: e.target.value })} className={inputClassName} />
      <Input placeholder="Phone number" value={value.phone} onChange={(e) => set({ phone: e.target.value })} className={inputClassName} />
      <Input placeholder="Street address" value={value.line1} onChange={(e) => set({ line1: e.target.value })} className={`${inputClassName} sm:col-span-2`} />
      <Input placeholder="City" value={value.city} onChange={(e) => set({ city: e.target.value })} className={inputClassName} />
      <Input placeholder="State / Province" value={value.state} onChange={(e) => set({ state: e.target.value })} className={inputClassName} />
      <Input placeholder="PIN / ZIP code" value={value.pincode} onChange={(e) => set({ pincode: e.target.value })} className={inputClassName} />
      <Input placeholder="Country" value={value.country} onChange={(e) => set({ country: e.target.value })} className={inputClassName} />
    </div>
  )
}
