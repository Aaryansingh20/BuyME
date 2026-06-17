// Builds the grounded "store context" the assistant reasons over. Catalogue
// metadata is static (public/data/shop.ts); live stock/price/offers/orders come
// from the database. Every DB read is wrapped in `safe()` so a Neon free-tier
// cold-start (which suspends the DB when idle) degrades gracefully to static
// data instead of taking the whole assistant down.
import { prisma } from "./prisma"
import { shopProducts } from "@/public/data/shop"
import { formatMoney, BASE_CURRENCY } from "./currency"
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FEE } from "./pricing"
import { POINTS_PER_UNIT } from "./loyalty"
import { WELCOME_PERCENT } from "./welcome-coupon"

const eur = (amount: number) => formatMoney(amount, BASE_CURRENCY)

/**
 * Run a DB read with one retry (Neon's first request after idle can fail while
 * the endpoint wakes up). Falls back to `fallback` instead of throwing, so the
 * assistant keeps working from static data when the database is unreachable.
 */
async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch {
    try {
      await new Promise((r) => setTimeout(r, 700))
      return await fn()
    } catch (err) {
      console.error(`[chat-context] ${label} unavailable:`, err)
      return fallback
    }
  }
}

/** Split a query into lowercase word tokens (>=3 chars) for naive matching. */
function tokenize(text: string): string[] {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, " ")
        .split(/\s+/)
        .filter((t) => t.length >= 3)
    )
  )
}

/** A compact, by-category overview so the bot always knows the range on offer. */
function catalogueOverview(): string {
  const byCategory = new Map<string, { count: number; min: number; max: number }>()
  for (const p of shopProducts) {
    const c = byCategory.get(p.category) ?? { count: 0, min: Infinity, max: -Infinity }
    c.count++
    c.min = Math.min(c.min, p.price)
    c.max = Math.max(c.max, p.price)
    byCategory.set(p.category, c)
  }
  const lines = Array.from(byCategory.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([cat, c]) => `- ${cat}: ${c.count} items, ${eur(c.min)}–${eur(c.max)}`)
  return `Categories we sell (${shopProducts.length} products total):\n${lines.join("\n")}`
}

/**
 * Up to `limit` products relevant to the shopper's message, with live stock.
 * Falls back to featured items when nothing matches (e.g. a greeting).
 */
async function relevantProducts(message: string, limit = 12): Promise<string> {
  const tokens = tokenize(message)
  const scored = shopProducts
    .map((p) => {
      const haystack = `${p.name} ${p.category}`.toLowerCase()
      const score = tokens.reduce((s, t) => (haystack.includes(t) ? s + 1 : s), 0)
      return { p, score }
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)

  let picks = scored.slice(0, limit).map((x) => x.p)
  if (picks.length === 0) {
    picks = shopProducts.filter((p) => p.featured).slice(0, limit)
  }

  // Overlay live inventory (stock / current price / active) from the DB.
  const slugs = picks.map((p) => p.slug)
  const inventory = await safe(
    "inventory",
    () =>
      prisma.product.findMany({
        where: { slug: { in: slugs } },
        select: { slug: true, stock: true, price: true, active: true },
      }),
    [] as { slug: string; stock: number; price: number; active: boolean }[]
  )
  const bySlug = new Map(inventory.map((i) => [i.slug, i]))

  const lines = picks.map((p) => {
    const inv = bySlug.get(p.slug)
    const price = inv?.price ?? p.price
    let availability = "availability shown on the product page"
    if (inv) {
      if (!inv.active) availability = "not available"
      else if (inv.stock <= 0) availability = "out of stock"
      else if (inv.stock <= 5) availability = `low stock (${inv.stock} left)`
      else availability = "in stock"
    }
    return `- ${p.name} (${p.category}) — ${eur(price)}, ${availability}, rating ${p.rating}/5, link: /product/${p.slug}`
  })

  const heading = scored.length > 0 ? "Products matching the shopper's question:" : "Some featured products:"
  return `${heading}\n${lines.join("\n")}`
}

/** Standing perks + any active multi-use promo codes currently live. */
async function offersAndPerks(): Promise<string> {
  const perks = [
    `- Free standard shipping on orders of ${eur(FREE_SHIPPING_THRESHOLD)} or more; otherwise shipping is ${eur(SHIPPING_FEE)}.`,
    `- New accounts receive a single-use ${WELCOME_PERCENT}% welcome code by email after signing up (valid 30 days).`,
    `- Loyalty: earn 1 point per €1 spent; ${POINTS_PER_UNIT} points = €1 to redeem at checkout.`,
  ]

  const coupons = await safe(
    "coupons",
    () =>
      prisma.coupon.findMany({
        where: { active: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] },
        orderBy: { createdAt: "desc" },
        take: 25,
      }),
    [] as Awaited<ReturnType<typeof prisma.coupon.findMany>>
  )

  // Only advertise general promo codes — exclude single-use personal codes
  // (e.g. welcome coupons) that belong to one shopper, and exhausted ones.
  const promos = coupons.filter(
    (c) =>
      (c.maxRedemptions === null || c.maxRedemptions > 1) &&
      (c.maxRedemptions === null || c.timesUsed < c.maxRedemptions)
  )

  const promoLines = promos.map((c) => {
    const off = c.type === "percent" ? `${c.value}% off` : `${eur(c.value)} off`
    const min = c.minSubtotal > 0 ? `, min spend ${eur(c.minSubtotal)}` : ""
    const exp = c.expiresAt ? `, expires ${c.expiresAt.toISOString().slice(0, 10)}` : ""
    return `- Code ${c.code}: ${off}${min}${exp}`
  })

  const offers =
    promoLines.length > 0
      ? `Current promo codes:\n${promoLines.join("\n")}`
      : "There are no general promo codes active right now (but the perks below always apply)."

  return `Offers & perks:\n${offers}\n${perks.join("\n")}`
}

/** Recent orders for a signed-in shopper, formatted for the prompt. */
async function recentOrders(userId: string): Promise<string> {
  const fetchOrders = () =>
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" as const },
      take: 5,
      include: { items: { select: { name: true, quantity: true } } },
    })
  const orders = await safe<Awaited<ReturnType<typeof fetchOrders>> | null>("orders", fetchOrders, null)
  if (orders === null) return "Order history couldn't be loaded right now — try again in a moment."
  if (orders.length === 0) return "The shopper has no orders yet."

  const lines = orders.map((o) => {
    const ref = `#${o.id.slice(-6).toUpperCase()}`
    const items = o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")
    const tracking = o.trackingNumber ? `, tracking ${o.carrier ?? ""} ${o.trackingNumber}`.trimEnd() : ""
    const placed = o.createdAt.toISOString().slice(0, 10)
    return `- Order ${ref} (${placed}): ${o.status}, payment ${o.paymentStatus}, total ${eur(o.total)}${tracking}. Items: ${items}`
  })
  return `The shopper's recent orders (most recent first):\n${lines.join("\n")}`
}

/** Loyalty balance + current cart for a signed-in shopper. */
async function accountSummary(userId: string): Promise<string> {
  const data = await safe(
    "account",
    async () => {
      const [user, cart] = await Promise.all([
        prisma.user.findUnique({ where: { id: userId }, select: { loyaltyPoints: true } }),
        prisma.cartItem.findMany({
          where: { userId },
          select: { name: true, quantity: true, size: true, price: true },
        }),
      ])
      return { user, cart }
    },
    null as { user: { loyaltyPoints: number } | null; cart: { name: string; quantity: number; size: string; price: number }[] } | null
  )
  if (!data) return ""

  const points = data.user?.loyaltyPoints ?? 0
  const pointsLine = `The shopper has ${points} loyalty points (worth ${eur(points / POINTS_PER_UNIT)} at checkout).`

  if (data.cart.length === 0) return `${pointsLine} Their cart is currently empty.`
  const cartLines = data.cart.map(
    (c) => `- ${c.quantity}× ${c.name}${c.size ? ` (size ${c.size.toUpperCase()})` : ""} at ${eur(c.price)} each`
  )
  const cartTotal = data.cart.reduce((s, c) => s + c.price * c.quantity, 0)
  return `${pointsLine}\nItems currently in their cart (subtotal ${eur(cartTotal)}):\n${cartLines.join("\n")}`
}

/** Static store policies the bot can rely on without a DB hit. */
function policies(): string {
  return [
    "Store info & policies:",
    "- BUYME ships from Germany; all prices are in euros (€).",
    "- Clothing sizes available are S, M and L, chosen on each product page.",
    `- Free shipping over ${eur(FREE_SHIPPING_THRESHOLD)}, otherwise ${eur(SHIPPING_FEE)} standard shipping.`,
    "- Payment at checkout is handled securely via Stripe (cards and, where enabled, methods like Klarna, PayPal and SEPA).",
    "- Shoppers can view orders, track shipments, and request a cancellation (with a reason) from their Profile page.",
    "- Some product pages include an interactive 3D view and a virtual try-on feature.",
    "",
    "Where to send shoppers (use these exact paths as clickable links when helpful):",
    "- Browse all products: /shop",
    "- Search products: /search",
    "- A specific product: /product/<slug> (use the slug from the product list above)",
    "- Shopping cart: /product/cartpage",
    "- Account, orders, order tracking, addresses & payment methods: /product/profile",
    "- Wishlist / liked items: /product/likeditem",
  ].join("\n")
}

/** Assemble the full store context string for the system prompt. */
export async function buildStoreContext(message: string, userId: string | null): Promise<string> {
  const parts = [catalogueOverview(), await relevantProducts(message), await offersAndPerks()]

  if (userId) {
    const [orders, account] = await Promise.all([recentOrders(userId), accountSummary(userId)])
    parts.push(orders)
    if (account) parts.push(account)
  } else {
    parts.push("The shopper is a guest — no order, cart, or loyalty information is available until they sign in.")
  }

  parts.push(policies())
  return parts.join("\n\n")
}
