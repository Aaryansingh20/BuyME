"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingBag, Tag, X, MapPin, CreditCard, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/pages/navbar"
import FooterServices from "@/components/pages/footer"
import { useCart } from "@/hooks/cartcontext"
import { FREE_SHIPPING_THRESHOLD, computeShipping } from "@/lib/pricing"
import { AddressFields, emptyAddressForm } from "@/components/ui/address-fields"

type Address = { id: string; name: string; address: string; phone: string | null; isDefault: boolean }
type PaymentMethod = { id: string; type: string; last4: string | null; expiryDate: string | null; email: string | null }
type Applied = { code: string; discount: number }

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, reloadCart } = useCart()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [addressId, setAddressId] = useState("")
  const [paymentMethodId, setPaymentMethodId] = useState("")
  const [loaded, setLoaded] = useState(false)

  const [addingAddress, setAddingAddress] = useState(false)
  const [addrForm, setAddrForm] = useState(emptyAddressForm)
  const [addrError, setAddrError] = useState("")
  const [savingAddr, setSavingAddr] = useState(false)

  const [addingCard, setAddingCard] = useState(false)
  const [cardForm, setCardForm] = useState({ type: "Credit Card" as "Credit Card" | "PayPal", number: "", expiryDate: "", email: "" })
  const [cardError, setCardError] = useState("")
  const [savingCard, setSavingCard] = useState(false)

  const [couponInput, setCouponInput] = useState("")
  const [applied, setApplied] = useState<Applied | null>(null)
  const [couponError, setCouponError] = useState("")
  const [checkingCoupon, setCheckingCoupon] = useState(false)

  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState("")
  const [stripeEnabled, setStripeEnabled] = useState(false)
  const [canceled, setCanceled] = useState(false)

  useEffect(() => {
    Promise.all([
      fetch("/api/addresses").then((r) => (r.ok ? r.json() : { addresses: [] })),
      fetch("/api/payment-methods").then((r) => (r.ok ? r.json() : { methods: [] })),
    ])
      .then(([a, m]) => {
        const addrs: Address[] = a.addresses ?? []
        const mths: PaymentMethod[] = m.methods ?? []
        setAddresses(addrs)
        setMethods(mths)
        setAddressId(addrs.find((x) => x.isDefault)?.id ?? addrs[0]?.id ?? "")
        setPaymentMethodId(mths[0]?.id ?? "")
      })
      .catch(() => {})
      .finally(() => setLoaded(true))

    fetch("/api/checkout/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStripeEnabled(Boolean(d?.stripe)))
      .catch(() => {})

    setCanceled(new URLSearchParams(window.location.search).get("canceled") === "1")
  }, [])

  const discount = applied?.discount ?? 0
  const shipping = computeShipping(subtotal)
  const total = Math.max(0, subtotal - discount) + shipping

  const applyCoupon = async () => {
    setCouponError("")
    if (!couponInput.trim()) return
    setCheckingCoupon(true)
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput, subtotal }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setApplied(null)
        setCouponError(data.error ?? "Invalid coupon")
        return
      }
      setApplied({ code: data.code, discount: data.discount })
      setCouponInput("")
    } catch {
      setCouponError("Could not validate coupon. Try again.")
    } finally {
      setCheckingCoupon(false)
    }
  }

  const saveAddress = async () => {
    setAddrError("")
    setSavingAddr(true)
    try {
      const prevIds = new Set(addresses.map((a) => a.id))
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(addrForm),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setAddrError(data.error ?? "Could not save address")
        return
      }
      const list: Address[] = data.addresses ?? []
      setAddresses(list)
      // Select the address we just added.
      const added = list.find((a) => !prevIds.has(a.id))
      setAddressId(added?.id ?? list.find((a) => a.isDefault)?.id ?? list[0]?.id ?? "")
      setAddrForm(emptyAddressForm)
      setAddingAddress(false)
    } finally {
      setSavingAddr(false)
    }
  }

  const saveCard = async () => {
    setCardError("")
    if (cardForm.type === "Credit Card" && cardForm.number.replace(/\D/g, "").length < 4) {
      setCardError("Enter a valid card number")
      return
    }
    if (cardForm.type === "PayPal" && !cardForm.email.trim()) {
      setCardError("Enter your PayPal email")
      return
    }
    setSavingCard(true)
    try {
      const prevIds = new Set(methods.map((m) => m.id))
      const res = await fetch("/api/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: cardForm.type,
          last4: cardForm.number,
          expiryDate: cardForm.expiryDate,
          email: cardForm.email,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setCardError(data.error ?? "Could not save card")
        return
      }
      const list: PaymentMethod[] = data.methods ?? []
      setMethods(list)
      // Select the method we just added.
      const added = list.find((m) => !prevIds.has(m.id))
      if (added) setPaymentMethodId(added.id)
      setCardForm({ type: "Credit Card", number: "", expiryDate: "", email: "" })
      setAddingCard(false)
    } finally {
      setSavingCard(false)
    }
  }

  const placeOrder = async () => {
    setError("")
    // Safety net in case the button is reached without a complete address.
    const addr = addresses.find((a) => a.id === addressId)
    if (!addr) {
      setError("Please add and select a shipping address before paying.")
      return
    }
    if (!addr.phone?.trim()) {
      setError("Please add a phone number to your shipping address before paying.")
      return
    }
    setPlacing(true)
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: addressId || undefined,
          paymentMethodId: paymentMethodId || undefined,
          couponCode: applied?.code,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        // A stale coupon (e.g. just hit its redemption cap) — drop it and let the user retry.
        if (res.status === 400 && applied) setApplied(null)
        setError(data.error ?? "Could not place order")
        return
      }
      const url = data.url as string
      if (/^https?:\/\//i.test(url)) {
        // External Stripe Checkout — hand the whole window over. (Cart is cleared
        // only after payment is confirmed.)
        window.location.href = url
      } else {
        // Fallback flow (no Stripe) — order already placed.
        await reloadCart()
        router.push(url)
      }
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setPlacing(false)
    }
  }

  // A delivery needs a complete shipping address with a contact number before
  // the customer can pay. Surface exactly what's missing.
  const selectedAddress = addresses.find((a) => a.id === addressId)
  const missingForCheckout: string[] =
    !selectedAddress
      ? ["a shipping address"]
      : !selectedAddress.phone?.trim()
        ? ["a phone number on your address"]
        : []
  const canPay = loaded && missingForCheckout.length === 0

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen text-white">
          <div className="container mx-auto flex flex-col items-center py-24 text-center text-gray-400">
            <ShoppingBag className="h-12 w-12" />
            <p className="mt-4 uppercase tracking-wider">Your cart is empty.</p>
            <Link
              href="/shop"
              className="mt-6 rounded-sm bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-gray-200"
            >
              Browse Products
            </Link>
          </div>
        </main>
        <FooterServices />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen text-white">
        <div className="container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold uppercase tracking-wider">Checkout</h1>

          <div className="mt-8 grid gap-8 lg:grid-cols-3">
            {/* Left: address + payment + items */}
            <div className="space-y-6 lg:col-span-2">
              {/* Shipping address */}
              <section className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
                  <MapPin className="h-5 w-5" /> Shipping Address
                </h2>
                {!loaded ? (
                  <p className="mt-4 text-sm text-gray-500">Loading…</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {addresses.length === 0 && !addingAddress && (
                      <p className="text-sm text-gray-400">No saved addresses yet — add one below.</p>
                    )}
                    {addresses.map((a) => (
                      <label
                        key={a.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors ${
                          addressId === a.id ? "border-white bg-white/5" : "border-white/15 hover:bg-white/[0.03]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={addressId === a.id}
                          onChange={() => setAddressId(a.id)}
                          className="mt-1 accent-white"
                        />
                        <div>
                          <p className="font-medium uppercase tracking-wider text-white">{a.name}</p>
                          <p className="text-sm text-gray-400">{a.address}</p>
                          {a.phone && <p className="text-xs text-gray-500">{a.phone}</p>}
                        </div>
                      </label>
                    ))}

                    {addingAddress ? (
                      <div className="rounded-sm border border-white/15 bg-black/20 p-4">
                        <AddressFields
                          value={addrForm}
                          onChange={setAddrForm}
                          inputClassName="rounded-sm border-white/15 bg-black/40 text-white placeholder:text-gray-500 text-sm"
                        />
                        {addrError && <p className="mt-2 text-xs text-red-400">{addrError}</p>}
                        <div className="mt-3 flex gap-2">
                          <Button
                            onClick={saveAddress}
                            disabled={savingAddr}
                            className="rounded-sm bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-gray-200 disabled:opacity-60"
                          >
                            {savingAddr ? "Saving…" : "Save address"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setAddingAddress(false)
                              setAddrError("")
                            }}
                            className="rounded-sm border-white/15 bg-transparent text-xs uppercase tracking-wider text-white hover:bg-white/5 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingAddress(true)}
                        className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
                      >
                        <Plus className="h-4 w-4" /> Add a new address
                      </button>
                    )}
                  </div>
                )}
              </section>

              {/* Payment method */}
              <section className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="flex items-center gap-2 text-lg font-bold uppercase tracking-wider">
                  <CreditCard className="h-5 w-5" /> Payment Method
                </h2>
                {!loaded ? (
                  <p className="mt-4 text-sm text-gray-500">Loading…</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {methods.length === 0 && !addingCard && (
                      <p className="text-sm text-gray-400">No saved payment methods yet — add one below.</p>
                    )}
                    {methods.map((m) => (
                      <label
                        key={m.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-sm border p-4 transition-colors ${
                          paymentMethodId === m.id ? "border-white bg-white/5" : "border-white/15 hover:bg-white/[0.03]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethodId === m.id}
                          onChange={() => setPaymentMethodId(m.id)}
                          className="accent-white"
                        />
                        <span className="text-sm uppercase tracking-wider text-white">
                          {m.type === "PayPal" ? `PayPal · ${m.email}` : `${m.type} ending ${m.last4}`}
                        </span>
                      </label>
                    ))}

                    {addingCard ? (
                      <div className="space-y-3 rounded-sm border border-white/15 bg-black/20 p-4">
                        <select
                          value={cardForm.type}
                          onChange={(e) => setCardForm({ ...cardForm, type: e.target.value as "Credit Card" | "PayPal" })}
                          className="w-full rounded-sm border border-white/15 bg-black/40 px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30"
                        >
                          <option className="bg-black" value="Credit Card">Credit Card</option>
                          <option className="bg-black" value="PayPal">PayPal</option>
                        </select>
                        {cardForm.type === "Credit Card" ? (
                          <div className="flex flex-col gap-2 sm:flex-row">
                            <Input
                              value={cardForm.number}
                              onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                              placeholder="Card number"
                              inputMode="numeric"
                              className="border-white/15 bg-black/40 text-white placeholder:text-gray-500 text-sm"
                            />
                            <Input
                              value={cardForm.expiryDate}
                              onChange={(e) => setCardForm({ ...cardForm, expiryDate: e.target.value })}
                              placeholder="MM/YY"
                              className="sm:w-32 border-white/15 bg-black/40 text-white placeholder:text-gray-500 text-sm"
                            />
                          </div>
                        ) : (
                          <Input
                            value={cardForm.email}
                            onChange={(e) => setCardForm({ ...cardForm, email: e.target.value })}
                            placeholder="PayPal email"
                            type="email"
                            className="border-white/15 bg-black/40 text-white placeholder:text-gray-500 text-sm"
                          />
                        )}
                        {cardError && <p className="text-xs text-red-400">{cardError}</p>}
                        <div className="flex gap-2">
                          <Button
                            onClick={saveCard}
                            disabled={savingCard}
                            className="rounded-sm bg-white text-xs font-semibold uppercase tracking-wider text-black hover:bg-gray-200 disabled:opacity-60"
                          >
                            {savingCard ? "Saving…" : "Save"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setAddingCard(false)
                              setCardError("")
                            }}
                            className="rounded-sm border-white/15 bg-transparent text-xs uppercase tracking-wider text-white hover:bg-white/5 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                        {stripeEnabled && (
                          <p className="text-[11px] text-gray-500">
                            This just saves a label. Your real card is entered securely on the Stripe page after you click Pay.
                          </p>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingCard(true)}
                        className="inline-flex items-center gap-2 text-sm text-gray-300 transition-colors hover:text-white"
                      >
                        <Plus className="h-4 w-4" /> Add a payment method
                      </button>
                    )}
                  </div>
                )}
              </section>

              {/* Items */}
              <section className="rounded-xl border border-white/10 bg-white/[0.04]">
                {items.map((item) => (
                  <div
                    key={`${item.slug}-${item.size}`}
                    className="flex items-center gap-4 border-b border-white/10 p-4 last:border-0"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-zinc-900">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium uppercase tracking-wider text-white">{item.name}</p>
                      <p className="text-xs text-gray-400">
                        {item.size ? `Size ${item.size} · ` : ""}Qty {item.quantity}
                      </p>
                    </div>
                    <span className="font-semibold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </section>
            </div>

            {/* Right: summary */}
            <div className="lg:col-span-1">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
                <h2 className="text-lg font-bold uppercase tracking-wider">Order Summary</h2>

                {/* Coupon */}
                <div className="mt-5">
                  {applied ? (
                    <div className="flex items-center justify-between rounded-sm border border-green-500/30 bg-green-500/10 px-3 py-2 text-sm text-green-400">
                      <span className="inline-flex items-center gap-2">
                        <Tag className="h-4 w-4" /> {applied.code} applied
                      </span>
                      <button onClick={() => setApplied(null)} aria-label="Remove coupon">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                        placeholder="Coupon code"
                        className="border-white/15 bg-black/40 uppercase text-white placeholder:text-gray-500"
                      />
                      <Button
                        onClick={applyCoupon}
                        disabled={checkingCoupon || !couponInput.trim()}
                        variant="outline"
                        className="shrink-0 border-white/15 bg-transparent text-xs uppercase tracking-wider text-white hover:bg-white/5 hover:text-white disabled:opacity-40"
                      >
                        {checkingCoupon ? "…" : "Apply"}
                      </Button>
                    </div>
                  )}
                  {couponError && <p className="mt-2 text-xs text-red-400">{couponError}</p>}
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-gray-300">
                    <span className="uppercase tracking-wider">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span className="uppercase tracking-wider">Discount</span>
                      <span>−${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-300">
                    <span className="uppercase tracking-wider">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-gray-500">
                      Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping.
                    </p>
                  )}
                  <div className="flex justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
                    <span className="uppercase tracking-wider">Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {canceled && !error && (
                  <p className="mt-4 rounded-sm border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs uppercase tracking-wider text-amber-400">
                    Payment canceled — your cart is intact. You can try again.
                  </p>
                )}
                {error && (
                  <p className="mt-4 rounded-sm border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs uppercase tracking-wider text-red-400">
                    {error}
                  </p>
                )}

                {!canPay && loaded && (
                  <p className="mt-4 rounded-sm border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs uppercase tracking-wider text-amber-400">
                    Please add {missingForCheckout[0]} above before you can {stripeEnabled ? "pay" : "place your order"}.
                  </p>
                )}

                <Button
                  onClick={placeOrder}
                  disabled={placing || !canPay}
                  className="mt-6 h-11 w-full rounded-sm bg-white text-sm font-semibold uppercase tracking-wider text-black hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {placing
                    ? stripeEnabled
                      ? "Redirecting to payment..."
                      : "Placing Order..."
                    : stripeEnabled
                      ? "Pay Now"
                      : "Place Order"}
                </Button>
                {stripeEnabled && (
                  <p className="mt-2 text-center text-[11px] uppercase tracking-wider text-gray-500">
                    Secure payment via Stripe
                  </p>
                )}
                <Link
                  href="/product/cartpage"
                  className="mt-3 block text-center text-xs uppercase tracking-wider text-gray-400 transition-colors hover:text-white"
                >
                  Back to cart
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16 border-t border-zinc-800 py-16">
          <FooterServices />
        </div>
      </main>
    </>
  )
}
