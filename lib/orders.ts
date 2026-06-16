import type { Prisma } from "@prisma/client"
import { prisma } from "./prisma"
import { computeShipping, round2 } from "./pricing"
import { evaluateCoupon, normalizeCode } from "./coupons"

type ReversibleOrder = {
  userId: string
  couponCode: string | null
  items: { slug: string; quantity: number }[]
}

// Undo the inventory + coupon side effects of an order. Must run inside a
// transaction. Used when an order is cancelled (by the customer or an admin):
//  - restock every line back into Product.stock (skipping non-catalogue slugs)
//  - decrement the coupon's usage count and delete the user's redemption, so
//    they're free to use that coupon again.
export async function reverseOrderEffects(tx: Prisma.TransactionClient, order: ReversibleOrder) {
  for (const item of order.items) {
    const product = await tx.product.findUnique({ where: { slug: item.slug } })
    if (product) {
      await tx.product.update({
        where: { slug: item.slug },
        data: { stock: { increment: item.quantity } },
      })
    }
  }

  if (order.couponCode) {
    const coupon = await tx.coupon.findUnique({ where: { code: order.couponCode } })
    if (coupon) {
      await tx.coupon.update({
        where: { id: coupon.id },
        data: { timesUsed: { decrement: 1 } },
      })
      await tx.couponRedemption.deleteMany({ where: { couponId: coupon.id, userId: order.userId } })
    }
  }
}

export type PlaceOrderOpts = {
  userId: string
  addressId?: string
  paymentMethodId?: string
  couponCode?: string
  status?: string
  paymentStatus?: string
  // When false (Stripe path), the order is created as a pending record only —
  // stock, coupon redemption, and cart are NOT touched until payment is confirmed
  // via commitOrder(). Defaults to true (direct/no-Stripe placement).
  commit?: boolean
}

const orderInclude = { items: true, user: { select: { email: true, name: true } } } as const
export type PlacedOrder = Prisma.OrderGetPayload<{ include: typeof orderInclude }>

export type PlaceOrderResult =
  | { ok: true; order: PlacedOrder }
  | { ok: false; status: number; error: string }

// Builds and commits an order from the user's cart: validates + decrements stock,
// validates + redeems the coupon (one per user), snapshots address/payment, clears
// the cart, and notifies — all atomically. Shared by the legacy /api/orders POST
// and the Stripe checkout-session route. Does NOT send the confirmation email
// (callers decide when, e.g. on payment confirmation).
export async function placeOrderForUser(opts: PlaceOrderOpts): Promise<PlaceOrderResult> {
  const couponCode = normalizeCode(opts.couponCode)

  const cart = await prisma.cartItem.findMany({ where: { userId: opts.userId } })
  if (cart.length === 0) return { ok: false, status: 400, error: "Your cart is empty" }

  let shippingAddress: string | null = null
  if (opts.addressId) {
    const addr = await prisma.address.findFirst({ where: { id: opts.addressId, userId: opts.userId } })
    if (!addr) return { ok: false, status: 400, error: "Invalid shipping address" }
    shippingAddress = `${addr.name} — ${addr.address}`
  }
  let paymentLabel: string | null = null
  if (opts.paymentMethodId) {
    const pm = await prisma.paymentMethod.findFirst({ where: { id: opts.paymentMethodId, userId: opts.userId } })
    if (!pm) return { ok: false, status: 400, error: "Invalid payment method" }
    paymentLabel = pm.type === "PayPal" ? `PayPal (${pm.email ?? ""})` : `${pm.type} ending ${pm.last4 ?? "????"}`
  }

  const subtotal = round2(cart.reduce((sum, i) => sum + i.price * i.quantity, 0))
  const shipping = computeShipping(subtotal)
  const commit = opts.commit ?? true

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Validate stock availability (so we never start a payment for an
      // unfulfillable order). Decrement only when committing.
      const slugs = cart.map((i) => i.slug)
      const products = await tx.product.findMany({ where: { slug: { in: slugs } } })
      const bySlug = new Map(products.map((p) => [p.slug, p]))
      for (const item of cart) {
        const p = bySlug.get(item.slug)
        if (p && (!p.active || p.stock < item.quantity)) throw new Error(`OUT_OF_STOCK:${item.name}`)
      }

      // Validate coupon (eligible + not already used by this user) and compute
      // the discount. The redemption row is created only when committing.
      let discount = 0
      let appliedCode: string | null = null
      let appliedCouponId: string | null = null
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: couponCode } })
        const result = evaluateCoupon(coupon, subtotal)
        if (!result.ok) throw new Error(`COUPON:${result.error}`)
        const already = await tx.couponRedemption.findUnique({
          where: { couponId_userId: { couponId: coupon!.id, userId: opts.userId } },
        })
        if (already) throw new Error("COUPON:You have already used this coupon")
        discount = result.discount
        appliedCode = result.code
        appliedCouponId = coupon!.id
      }

      const total = round2(Math.max(0, subtotal - discount) + shipping)

      const created = await tx.order.create({
        data: {
          userId: opts.userId,
          subtotal,
          shipping,
          discount,
          total,
          couponCode: appliedCode,
          shippingAddress,
          paymentLabel,
          status: opts.status ?? "Processing",
          paymentStatus: opts.paymentStatus ?? "unpaid",
          items: {
            create: cart.map((i) => ({
              slug: i.slug,
              name: i.name,
              price: i.price,
              image: i.image,
              size: i.size,
              quantity: i.quantity,
            })),
          },
        },
        include: orderInclude,
      })

      if (commit) {
        for (const item of cart) {
          if (bySlug.has(item.slug)) {
            await tx.product.update({ where: { slug: item.slug }, data: { stock: { decrement: item.quantity } } })
          }
        }
        if (appliedCouponId) {
          await tx.coupon.update({ where: { id: appliedCouponId }, data: { timesUsed: { increment: 1 } } })
          await tx.couponRedemption.create({
            data: { couponId: appliedCouponId, userId: opts.userId, orderId: created.id },
          })
        }
        await tx.cartItem.deleteMany({ where: { userId: opts.userId } })
        await tx.notification.create({
          data: {
            userId: opts.userId,
            message: `Order #${created.id.slice(-6).toUpperCase()} placed — ${cart.length} item${
              cart.length === 1 ? "" : "s"
            } for $${total.toFixed(2)}.`,
          },
        })
      }
      return created
    })
    return { ok: true, order }
  } catch (err) {
    const message = err instanceof Error ? err.message : ""
    if (message.startsWith("OUT_OF_STOCK:")) {
      return { ok: false, status: 409, error: `${message.slice("OUT_OF_STOCK:".length)} is out of stock or unavailable.` }
    }
    if (message.startsWith("COUPON:")) {
      return { ok: false, status: 400, error: message.slice("COUPON:".length) }
    }
    return { ok: false, status: 500, error: "Could not place order. Please try again." }
  }
}

// Finalizes a pending (Stripe) order once payment is confirmed: decrements stock,
// redeems the coupon, clears the cart, notifies, and marks it paid. Idempotent —
// safe to call from both the webhook and the success-page confirm check; a second
// call on an already-paid order is a no-op.
export async function commitOrder(
  orderId: string
): Promise<{ order: PlacedOrder; newlyPaid: boolean } | null> {
  const existing = await prisma.order.findUnique({ where: { id: orderId }, include: orderInclude })
  if (!existing) return null
  if (existing.paymentStatus === "paid") return { order: existing, newlyPaid: false }

  const order = await prisma.$transaction(async (tx) => {
    for (const item of existing.items) {
      const product = await tx.product.findUnique({ where: { slug: item.slug } })
      if (product) {
        await tx.product.update({ where: { slug: item.slug }, data: { stock: { decrement: item.quantity } } })
      }
    }

    if (existing.couponCode) {
      const coupon = await tx.coupon.findUnique({ where: { code: existing.couponCode } })
      if (coupon) {
        await tx.coupon.update({ where: { id: coupon.id }, data: { timesUsed: { increment: 1 } } })
        await tx.couponRedemption.upsert({
          where: { couponId_userId: { couponId: coupon.id, userId: existing.userId } },
          update: { orderId: existing.id },
          create: { couponId: coupon.id, userId: existing.userId, orderId: existing.id },
        })
      }
    }

    await tx.cartItem.deleteMany({ where: { userId: existing.userId } })
    await tx.notification.create({
      data: {
        userId: existing.userId,
        message: `Order #${existing.id.slice(-6).toUpperCase()} confirmed — payment received ($${existing.total.toFixed(2)}).`,
      },
    })
    return tx.order.update({
      where: { id: orderId },
      data: { paymentStatus: "paid", status: "Processing" },
      include: orderInclude,
    })
  })
  return { order, newlyPaid: true }
}
