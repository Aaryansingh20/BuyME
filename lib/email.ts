import { Resend } from "resend"
import nodemailer from "nodemailer"
import { getBaseUrl } from "./url"
import { formatMoney, BASE_CURRENCY } from "./currency"
import { pointsToMoney } from "./loyalty"

// Email sender. Picks a transport in this order:
//   1. SMTP (e.g. Gmail) — set SMTP_USER + SMTP_PASS. Delivers to ANY address,
//      free, no domain needed. This is the recommended setup.
//   2. Resend — set RESEND_API_KEY. (Sandbox only delivers to your own address
//      until you verify a domain.)
//   3. Console — no provider configured (dev): logs the email so the flow is
//      still testable.

interface SendEmailArgs {
  to: string
  subject: string
  text: string
  html: string
}

// --- SMTP (Gmail and friends) ---
const SMTP_USER = process.env.SMTP_USER // e.g. yourname@gmail.com
// Gmail App Password (not your login password). Google displays it with spaces
// (e.g. "abcd efgh ijkl mnop") — strip them, SMTP auth needs the bare 16 chars.
const SMTP_PASS = process.env.SMTP_PASS?.replace(/\s+/g, "")
const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com"
const SMTP_PORT = Number(process.env.SMTP_PORT || 465)
const smtpConfigured = Boolean(SMTP_USER && SMTP_PASS)

// --- Resend ---
const RESEND_API_KEY = process.env.RESEND_API_KEY

// From address: defaults to your SMTP user when using Gmail, else Resend's sandbox sender.
const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  (smtpConfigured ? `BuyME <${SMTP_USER}>` : "BuyME <onboarding@resend.dev>")

// True when a real provider is configured (so the UI can hide the dev reset link).
export const emailConfigured = smtpConfigured || Boolean(RESEND_API_KEY)

// Reuse a single SMTP transport across requests.
let transporter: nodemailer.Transporter | null = null
function getTransport() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465, // true for 465, false for 587 (STARTTLS)
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
  }
  return transporter
}

export async function sendEmail({ to, subject, text, html }: SendEmailArgs) {
  // 1. SMTP / Gmail — delivers to anyone.
  if (smtpConfigured) {
    try {
      await getTransport().sendMail({ from: EMAIL_FROM, to, subject, text, html })
    } catch (err) {
      console.error("[email] SMTP error:", err)
      throw new Error("Failed to send email")
    }
    return
  }

  // 2. Resend.
  if (RESEND_API_KEY) {
    const resend = new Resend(RESEND_API_KEY)
    const { error } = await resend.emails.send({ from: EMAIL_FROM, to, subject, text, html })
    if (error) {
      console.error("[email] Resend error:", error)
      throw new Error("Failed to send email")
    }
    return
  }

  // 3. Dev fallback — no provider configured.
  console.log(
    `\n──────── [email] (dev console — set SMTP_USER/SMTP_PASS to send for real) ────────\nTo: ${to}\nSubject: ${subject}\n${text}\n──────────────────────────────────────────────────────────────────────────\n`
  )
}

export type EmailTransport = "smtp" | "resend" | "none"

export function emailStatus(): { transport: EmailTransport; from: string; configured: boolean } {
  return {
    transport: smtpConfigured ? "smtp" : RESEND_API_KEY ? "resend" : "none",
    from: EMAIL_FROM,
    configured: emailConfigured,
  }
}

// Diagnostic send for the admin email test. Unlike sendEmail (which masks the
// underlying error), this returns the real failure reason so an admin can see
// exactly why mail isn't delivering — e.g. Resend rejecting a non-verified
// recipient, or wrong SMTP credentials.
export async function sendTestEmail(to: string): Promise<{ ok: boolean; transport: EmailTransport; error?: string }> {
  const status = emailStatus()
  const subject = "BuyME — test email"
  const text = "This is a test email from your BuyME store. If you received it, email is configured correctly."
  const html = emailLayout({
    preheader: "BuyME email test",
    bodyHtml: `<h2 style="margin:0 0 12px;font-size:20px;color:#111">Email is working 🎉</h2><p style="margin:0">If you received this, your BuyME email provider is configured correctly.</p>`,
  })
  try {
    if (smtpConfigured) {
      await getTransport().verify()
      await getTransport().sendMail({ from: EMAIL_FROM, to, subject, text, html })
    } else if (RESEND_API_KEY) {
      const resend = new Resend(RESEND_API_KEY)
      const { error } = await resend.emails.send({ from: EMAIL_FROM, to, subject, text, html })
      if (error) {
        const message = typeof error === "string" ? error : error.message ?? JSON.stringify(error)
        return { ok: false, transport: status.transport, error: message }
      }
    } else {
      return { ok: false, transport: "none", error: "No email provider configured." }
    }
    return { ok: true, transport: status.transport }
  } catch (err) {
    return { ok: false, transport: status.transport, error: err instanceof Error ? err.message : String(err) }
  }
}

// ---- Branded layout ---------------------------------------------------------
// Email-safe HTML (inline styles, no external assets). The logo is the BuyME
// "B" mark + wordmark rebuilt with inline CSS so it renders identically in every
// client — no image hosting or remote-image blocking to worry about.

const brandLogo = `
  <span style="display:inline-block;width:34px;height:34px;line-height:34px;background:#ffffff;color:#000000;font-weight:800;font-size:18px;border-radius:7px;text-align:center;vertical-align:middle;font-family:Arial,Helvetica,sans-serif">B</span>
  <span style="vertical-align:middle;margin-left:10px;font-size:22px;font-weight:bold;letter-spacing:3px;color:#ffffff;font-family:Arial,Helvetica,sans-serif">BUY<span style="color:#8a8a8a">ME</span></span>`

function brandButton(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;background:#111111;color:#ffffff;padding:13px 24px;text-decoration:none;border-radius:6px;text-transform:uppercase;font-size:13px;letter-spacing:1px;font-family:Arial,Helvetica,sans-serif">${label}</a>`
}

function emailLayout(opts: { preheader?: string; bodyHtml: string }): string {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:24px 12px;background:#f4f4f5;font-family:Arial,Helvetica,sans-serif">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${opts.preheader}</div>` : ""}
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e7e7e9;border-radius:12px;overflow:hidden">
    <div style="background:#000000;padding:22px 28px;text-align:center">${brandLogo}</div>
    <div style="padding:28px;color:#111111;font-size:15px;line-height:1.55">${opts.bodyHtml}</div>
    <div style="padding:18px 28px 26px;border-top:1px solid #eeeeee;color:#9a9a9a;font-size:12px;line-height:1.5">
      <p style="margin:0">You're receiving this email because you have a BuyME account.</p>
      <p style="margin:6px 0 0">© ${new Date().getFullYear()} BuyME · Modern Fashion Store</p>
    </div>
  </div>
</body></html>`
}

export async function sendWelcomeEmail(
  to: string,
  name: string,
  coupon?: { code: string; percent: number }
) {
  const firstName = name?.split(" ")[0] || "there"

  const couponText = coupon
    ? `\n\nHere's ${coupon.percent}% off your first order — use code ${coupon.code} at checkout.`
    : ""
  const couponBlock = coupon
    ? `<div style="margin:22px 0;padding:18px;border:1px dashed #c9c9c9;border-radius:10px;text-align:center;background:#fafafa">
    <p style="margin:0 0 6px;font-size:12px;color:#777;text-transform:uppercase;letter-spacing:1px">Your welcome gift — ${coupon.percent}% off your first order</p>
    <p style="margin:0;font-size:24px;font-weight:bold;letter-spacing:3px;color:#111">${coupon.code}</p>
    <p style="margin:8px 0 0;font-size:12px;color:#999">Apply it at checkout · single use</p>
  </div>`
    : ""

  await sendEmail({
    to,
    subject: "Welcome to BuyME",
    text: `Hi ${firstName},\n\nWelcome to BuyME — your account is ready. Explore the latest drops, save your favourites, and check out when you're ready.${couponText}\n\nHappy shopping,\nThe BuyME Team`,
    html: emailLayout({
      preheader: coupon
        ? `Welcome to BuyME — here's ${coupon.percent}% off your first order.`
        : "Your BuyME account is ready — let's go shopping.",
      bodyHtml: `
  <h2 style="margin:0 0 16px;font-size:20px;color:#111">Welcome, ${firstName} 👋</h2>
  <p style="margin:0 0 12px">Your <strong>BuyME</strong> account is ready. Explore the latest drops, save your favourites, and check out whenever you're ready.</p>
  ${couponBlock}
  <p style="margin:24px 0">${brandButton(getBaseUrl(), "Start Shopping")}</p>
  <p style="margin:0;font-size:13px;color:#666">Happy shopping,<br/>The BuyME Team</p>`,
    }),
  })
}

type OrderEmailItem = { name: string; size: string; quantity: number; price: number }
type OrderEmailData = {
  id: string
  items: OrderEmailItem[]
  subtotal: number
  shipping: number
  discount: number
  total: number
  couponCode: string | null
  pointsRedeemed: number
  shippingAddress: string | null
  paymentLabel: string | null
}

export async function sendOrderConfirmationEmail(to: string, name: string, order: OrderEmailData) {
  const firstName = name?.split(" ")[0] || "there"
  const orderNo = order.id.slice(-6).toUpperCase()
  const money = (n: number) => formatMoney(n, BASE_CURRENCY)

  const itemsText = order.items
    .map((i) => `  - ${i.name}${i.size ? ` (${i.size})` : ""} x${i.quantity} — ${money(i.price * i.quantity)}`)
    .join("\n")

  const text = `Hi ${firstName},

Thanks for your order! We've received it and it's now being processed.

Order #${orderNo}
${itemsText}

Subtotal: ${money(order.subtotal)}
${order.discount > 0 ? `Discount${order.couponCode ? ` (${order.couponCode})` : ""}: -${money(order.discount)}\n` : ""}${order.pointsRedeemed > 0 ? `Points (${order.pointsRedeemed}): -${money(pointsToMoney(order.pointsRedeemed))}\n` : ""}Shipping: ${order.shipping === 0 ? "Free" : money(order.shipping)}
Total: ${money(order.total)}
${order.shippingAddress ? `\nShip to: ${order.shippingAddress}` : ""}${order.paymentLabel ? `\nPaid with: ${order.paymentLabel}` : ""}

You can view your orders any time in your BuyME profile.

— The BuyME Team`

  const itemRows = order.items
    .map(
      (i) => `<tr>
  <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}${i.size ? ` <span style="color:#888">(${i.size})</span>` : ""} &times; ${i.quantity}</td>
  <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">${money(i.price * i.quantity)}</td>
</tr>`
    )
    .join("")

  const html = emailLayout({
    preheader: `Order #${orderNo} confirmed — ${money(order.total)}`,
    bodyHtml: `
  <h2 style="margin:0 0 16px;font-size:20px;color:#111">Thanks for your order, ${firstName}!</h2>
  <p style="margin:0 0 4px">We've received it and it's now being processed.</p>
  <p style="font-size:13px;color:#666;text-transform:uppercase;letter-spacing:1px;margin:14px 0 6px">Order #${orderNo}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:4px">${itemRows}</table>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px">
    <tr><td style="padding:4px 0">Subtotal</td><td style="padding:4px 0;text-align:right">${money(order.subtotal)}</td></tr>
    ${order.discount > 0 ? `<tr><td style="padding:4px 0;color:#0a0">Discount${order.couponCode ? ` (${order.couponCode})` : ""}</td><td style="padding:4px 0;text-align:right;color:#0a0">-${money(order.discount)}</td></tr>` : ""}
    ${order.pointsRedeemed > 0 ? `<tr><td style="padding:4px 0;color:#b8860b">Points (${order.pointsRedeemed})</td><td style="padding:4px 0;text-align:right;color:#b8860b">-${money(pointsToMoney(order.pointsRedeemed))}</td></tr>` : ""}
    <tr><td style="padding:4px 0">Shipping</td><td style="padding:4px 0;text-align:right">${order.shipping === 0 ? "Free" : money(order.shipping)}</td></tr>
    <tr><td style="padding:8px 0;border-top:1px solid #111;font-weight:bold">Total</td><td style="padding:8px 0;border-top:1px solid #111;text-align:right;font-weight:bold">${money(order.total)}</td></tr>
  </table>
  ${order.shippingAddress ? `<p style="font-size:13px;color:#666;margin-top:16px">Ship to: ${order.shippingAddress}</p>` : ""}
  ${order.paymentLabel ? `<p style="font-size:13px;color:#666;margin-top:4px">Paid with: ${order.paymentLabel}</p>` : ""}
  <p style="margin:24px 0">${brandButton(`${getBaseUrl()}/product/profile?tab=orders`, "View Your Orders")}</p>
  <p style="margin:0;font-size:13px;color:#666">— The BuyME Team</p>`,
  })

  await sendEmail({ to, subject: `Order confirmed — #${orderNo}`, text, html })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sendEmail({
    to,
    subject: "Reset your BuyME password",
    text: `We received a request to reset your password.\n\nReset it here (valid for 30 minutes):\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
    html: emailLayout({
      preheader: "Reset your BuyME password (link valid for 30 minutes).",
      bodyHtml: `
  <h2 style="margin:0 0 16px;font-size:20px;color:#111">Reset your password</h2>
  <p style="margin:0 0 12px">We received a request to reset your BuyME password. Click below to choose a new one.</p>
  <p style="margin:24px 0">${brandButton(resetUrl, "Reset Password")}</p>
  <p style="margin:0;font-size:13px;color:#666">This link is valid for 30 minutes. If you didn't request this, you can safely ignore this email.</p>`,
    }),
  })
}
