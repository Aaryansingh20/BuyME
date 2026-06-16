import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const prisma = new PrismaClient()
const __dirname = dirname(fileURLToPath(import.meta.url))

const users = [
  { email: "admin@gmail.com", name: "Admin", password: "admin123", role: "admin" },
  { email: "user@gmail.com", name: "Demo User", password: "user123", role: "user" },
]

const coupons = [
  { code: "WELCOME10", type: "percent", value: 10, minSubtotal: 0 },
  { code: "SAVE20", type: "percent", value: 20, minSubtotal: 150 },
  { code: "FREESHIP", type: "fixed", value: 9.99, minSubtotal: 0 },
]

// The catalogue is the single source of truth in public/data/shop.ts (a TS module
// with static image imports that a plain .mjs can't import). We parse the product
// literals out of it so Product rows never drift from the storefront catalogue.
function readCatalogue() {
  const file = join(__dirname, "..", "public", "data", "shop.ts")
  const src = readFileSync(file, "utf8")
  const re =
    /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*price:\s*([\d.]+)/g
  const products = []
  let m
  while ((m = re.exec(src)) !== null) {
    products.push({ slug: m[1], name: m[2], category: m[3], price: parseFloat(m[4]) })
  }
  return products
}

// Deterministic, organic-looking starting stock so demos have in/low/out states.
function startingStock(slug) {
  let h = 0
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0
  return h % 13 === 0 ? 0 : 4 + (h % 60) // ~1 in 13 starts out of stock
}

async function main() {
  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10)
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, role: u.role },
      create: { email: u.email, name: u.name, role: u.role, passwordHash },
    })
    console.log(`seeded user ${u.email}`)
  }

  const catalogue = readCatalogue()
  for (const p of catalogue) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      // Refresh metadata/price from the catalogue but never clobber admin-edited stock.
      update: { name: p.name, category: p.category, price: p.price },
      create: { ...p, stock: startingStock(p.slug) },
    })
  }
  console.log(`seeded ${catalogue.length} products`)

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: { type: c.type, value: c.value, minSubtotal: c.minSubtotal, active: true },
      create: c,
    })
  }
  console.log(`seeded ${coupons.length} coupons`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
