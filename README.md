# BuyME — Modern Fashion E-Commerce

A full-stack fashion storefront built with **Next.js 14 (App Router)**, **Prisma/PostgreSQL**, and **Stripe**. It covers the complete commerce lifecycle — browse, cart, checkout, payment, order tracking — plus the things real stores need: multi-currency, coupons, reviews, inventory, loyalty points, a 3D product viewer, transactional email, and an admin dashboard.

> Built for the EU/German market: prices stored in EUR, Stripe charging in the shopper's chosen currency, and Checkout exposing local methods (Card, Klarna, PayPal, SEPA).

---

## ✨ Features

### Storefront
- **Catalogue** — 160+ products with category pages, collections, and a `/shop` grid with **sort, price filters, and pagination** (all URL-driven and shareable).
- **Search** — token-based matching with the same sort/filter/pagination controls.
- **Product pages** — server-rendered (SSG) with per-product metadata + **Product JSON-LD**, an image gallery, size/quantity selection, stock-aware add-to-cart, related products, and verified reviews.
- **3D product viewer** — interactive `.glb` models (three.js / React Three Fiber) with a 2D ⇄ 3D toggle on supported products.
- **Multi-currency** — shopper-selectable currency (EUR, USD, GBP, INR, JPY, CAD, AUD). Prices are stored in a single base currency (EUR) and converted at render time; Stripe charges in the selected currency.

### Accounts & commerce
- **Auth** — email/password (bcrypt) + **Google OAuth**, JWT sessions, password reset, change password, and login history.
- **Generated avatars** — every new account gets a DiceBear avatar; users can upload (auto-compressed to 256² JPEG) or shuffle a new one.
- **Cart & wishlist**, **addresses & payment methods**, **notifications**.
- **Coupons** — percent/fixed, min-spend, redemption caps, and per-user single-use enforcement. New accounts receive **one single-use welcome coupon** by email.
- **Loyalty points** — earn 1 point per €1 of subtotal and **redeem points at checkout** (100 pts = €1), netted on payment and refunded on cancellation.
- **Reviews** — 1–5 stars with a verified-buyer badge.

### Payments & orders
- **Stripe Checkout** — hosted payment with an **idempotent webhook** that commits inventory, coupon redemption, cart clearing, and email only once payment confirms. Falls back to direct order placement when Stripe isn't configured.
- **Order tracking** — Processing → Shipped → Delivered timeline with carrier/tracking number, plus customer cancellation with a reason.
- **Transactional email** — branded HTML emails (welcome + coupon, order confirmation, password reset) over Gmail SMTP or Resend, with a dev console fallback.

### Admin
- Dashboard with revenue/stats, product inventory & pricing, order management (status + tracking), coupons, reviews, and an email-test tool.

### SEO
- Server-rendered product/collection pages, `generateMetadata` (Open Graph + Twitter), Product structured data, plus generated `sitemap.xml` and `robots.txt`.

---

## 🧱 Tech stack

| Area | Tech |
|------|------|
| Framework | Next.js 14 (App Router, Server Components) |
| Language | TypeScript |
| Database | PostgreSQL (Neon) via Prisma ORM |
| Auth | JWT (`jose`), bcrypt, Google OAuth |
| Payments | Stripe Checkout + webhooks |
| Email | Nodemailer (SMTP) / Resend |
| 3D | three.js, @react-three/fiber, @react-three/drei |
| UI | Tailwind CSS, Radix UI, Framer Motion, lucide-react |

---

## 🏗️ Architecture highlights

- **Single source of truth for money** — all amounts are stored in a base currency; a `<Price>` component + currency context convert for display, while the server computes order totals and Stripe charges authoritatively ([lib/currency.ts](lib/currency.ts), [lib/pricing.ts](lib/pricing.ts)).
- **Idempotent order commit** — pending orders are created up front; stock, coupon, cart, points, and email are committed exactly once, safe to call from both the webhook and the success-page confirm check ([lib/orders.ts](lib/orders.ts)).
- **Inventory as a layer** — the static catalogue lives in code; a `Product` table overlays mutable stock/price/availability so the storefront stays fast while admins manage inventory.
- **Reversible side effects** — cancelling an order restocks inventory, frees the coupon, and refunds/claws back loyalty points in one transaction.
- **Shared pure logic** — coupon evaluation and loyalty maths are framework-agnostic modules reused by server routes and client UI.

---

## 📸 Screenshots

> Add images to `docs/screenshots/` and reference them here.

| Home | Shop | Product (3D) |
|------|------|--------------|
| _add_ | _add_ | _add_ |

| Checkout | Order tracking | Admin |
|----------|----------------|-------|
| _add_ | _add_ | _add_ |

---

## 🚀 Getting started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (e.g. a free [Neon](https://neon.tech) project)

### 1. Install
```bash
npm install
```

### 2. Configure environment
Copy the example file and fill in your values:
```bash
cp .env.example .env
```
At minimum you need `DATABASE_URL`, `DIRECT_URL`, and `AUTH_SECRET`. Email, Google OAuth, and Stripe are optional — the app degrades gracefully without them (dev email console, hidden Google button, direct-order checkout). See the table below.

### 3. Set up the database
```bash
npx prisma migrate deploy   # apply migrations
npm run db:seed             # optional: seed sample data
```

### 4. Run
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `DATABASE_URL` | ✅ | Pooled Postgres connection (runtime) |
| `DIRECT_URL` | ✅ | Direct Postgres connection (migrations) |
| `AUTH_SECRET` | ✅ | Secret for signing JWT sessions |
| `APP_URL` | prod | Canonical site URL for email links & SEO |
| `SMTP_USER` / `SMTP_PASS` | — | Gmail SMTP (App Password); sends real email |
| `EMAIL_FROM` | — | From address (defaults to `BuyME <SMTP_USER>`) |
| `RESEND_API_KEY` | — | Alternative email transport |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | — | Google OAuth sign-in |
| `STRIPE_SECRET_KEY` | — | Enables Stripe Checkout |
| `STRIPE_WEBHOOK_SECRET` | — | Verifies Stripe webhook events |
| `STRIPE_CURRENCY` | — | Default charge currency (e.g. `eur`) |

**Email tip:** Gmail needs an **App Password** (16 chars, 2-Step Verification enabled), not your normal password. Use the admin **Email test** tool to see the exact provider error if mail isn't delivering.

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |
| `npm run db:seed` | Seed sample data |
| `npx prisma migrate dev` | Create & apply a migration |
| `npx prisma studio` | Browse the database |

---

## 📁 Project structure

```
app/                Routes (App Router)
  api/              Route handlers (auth, cart, checkout, orders, webhooks, admin)
  product/[slug]/   Server-rendered product page (metadata + JSON-LD)
  shop, search/     Catalogue with sort/filter/pagination
  admin/            Admin dashboard
  sitemap.ts        Generated sitemap
  robots.ts         Generated robots.txt
components/         UI components (storefront, account, admin, 3D viewer)
hooks/              Client contexts (cart, wishlist, currency)
lib/                Server + shared logic (orders, currency, loyalty, coupons, email, auth)
prisma/             Schema, migrations, seed
public/data/        Static catalogue & collections
```

---

## ☁️ Deployment

Deploy on **Vercel** with a **Neon** Postgres database:
1. Push to GitHub and import the repo into Vercel.
2. Add the environment variables from the table above.
3. Set the Stripe webhook endpoint to `https://your-domain/api/webhooks/stripe`.
4. Migrations run against `DIRECT_URL`; the app connects via the pooled `DATABASE_URL` at runtime.
