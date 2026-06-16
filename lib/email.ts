import { Resend } from "resend"
import nodemailer from "nodemailer"
import { getBaseUrl } from "./url"

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
  const html = `<div style="font-family:Arial,sans-serif;padding:16px;color:#111"><h2 style="letter-spacing:2px">BUYME</h2><p>If you received this, your email provider is configured correctly. 🎉</p></div>`
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

export async function sendWelcomeEmail(to: string, name: string) {
  const firstName = name?.split(" ")[0] || "there"
  await sendEmail({
    to,
    subject: "Welcome to BuyME",
    text: `Hi ${firstName},\n\nWelcome to BuyME — your account is ready. Explore the latest drops, save your favourites, and check out when you're ready.\n\nHappy shopping,\nThe BuyME Team`,
    html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:22px;letter-spacing:3px;text-transform:uppercase">BuyME</h1>
  <p>Hi ${firstName},</p>
  <p>Welcome to <strong>BuyME</strong> — your account is ready. Explore the latest drops, save your favourites, and check out when you're ready.</p>
  <p style="margin:24px 0">
    <a href="${getBaseUrl()}" style="background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;text-transform:uppercase;font-size:13px;letter-spacing:1px">Start Shopping</a>
  </p>
  <p style="font-size:13px;color:#666">Happy shopping,<br/>The BuyME Team</p>
</div>`,
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
  shippingAddress: string | null
  paymentLabel: string | null
}

export async function sendOrderConfirmationEmail(to: string, name: string, order: OrderEmailData) {
  const firstName = name?.split(" ")[0] || "there"
  const orderNo = order.id.slice(-6).toUpperCase()
  const money = (n: number) => `$${n.toFixed(2)}`

  const itemsText = order.items
    .map((i) => `  - ${i.name}${i.size ? ` (${i.size})` : ""} x${i.quantity} — ${money(i.price * i.quantity)}`)
    .join("\n")

  const text = `Hi ${firstName},

Thanks for your order! We've received it and it's now being processed.

Order #${orderNo}
${itemsText}

Subtotal: ${money(order.subtotal)}
${order.discount > 0 ? `Discount${order.couponCode ? ` (${order.couponCode})` : ""}: -${money(order.discount)}\n` : ""}Shipping: ${order.shipping === 0 ? "Free" : money(order.shipping)}
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

  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:22px;letter-spacing:3px;text-transform:uppercase">BuyME</h1>
  <p>Hi ${firstName},</p>
  <p>Thanks for your order! We've received it and it's now being processed.</p>
  <p style="font-size:14px;color:#666;text-transform:uppercase;letter-spacing:1px">Order #${orderNo}</p>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:8px">${itemRows}</table>
  <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:12px">
    <tr><td style="padding:4px 0">Subtotal</td><td style="padding:4px 0;text-align:right">${money(order.subtotal)}</td></tr>
    ${order.discount > 0 ? `<tr><td style="padding:4px 0;color:#0a0">Discount${order.couponCode ? ` (${order.couponCode})` : ""}</td><td style="padding:4px 0;text-align:right;color:#0a0">-${money(order.discount)}</td></tr>` : ""}
    <tr><td style="padding:4px 0">Shipping</td><td style="padding:4px 0;text-align:right">${order.shipping === 0 ? "Free" : money(order.shipping)}</td></tr>
    <tr><td style="padding:8px 0;border-top:1px solid #111;font-weight:bold">Total</td><td style="padding:8px 0;border-top:1px solid #111;text-align:right;font-weight:bold">${money(order.total)}</td></tr>
  </table>
  ${order.shippingAddress ? `<p style="font-size:13px;color:#666;margin-top:16px">Ship to: ${order.shippingAddress}</p>` : ""}
  ${order.paymentLabel ? `<p style="font-size:13px;color:#666;margin-top:4px">Paid with: ${order.paymentLabel}</p>` : ""}
  <p style="margin:24px 0">
    <a href="${getBaseUrl()}/product/profile?tab=orders" style="background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;text-transform:uppercase;font-size:13px;letter-spacing:1px">View Your Orders</a>
  </p>
  <p style="font-size:13px;color:#666">— The BuyME Team</p>
</div>`

  await sendEmail({ to, subject: `Order confirmed — #${orderNo}`, text, html })
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await sendEmail({
    to,
    subject: "Reset your BuyME password",
    text: `We received a request to reset your password.\n\nReset it here (valid for 30 minutes):\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
    html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#111">
  <h1 style="font-size:20px;letter-spacing:2px;text-transform:uppercase">BuyME</h1>
  <p>We received a request to reset your password.</p>
  <p style="margin:24px 0">
    <a href="${resetUrl}" style="background:#111;color:#fff;padding:12px 20px;text-decoration:none;border-radius:4px;text-transform:uppercase;font-size:13px;letter-spacing:1px">Reset Password</a>
  </p>
  <p style="font-size:13px;color:#666">This link is valid for 30 minutes. If you didn't request this, you can safely ignore this email.</p>
</div>`,
  })
}
