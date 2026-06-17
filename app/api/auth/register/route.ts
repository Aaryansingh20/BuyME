import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/password"
import { sendWelcomeEmail } from "@/lib/email"
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE, type Role } from "@/lib/auth"
import { rateLimit, clientIp } from "@/lib/rate-limit"
import { randomAvatarUrl } from "@/lib/avatar"
import { issueWelcomeCoupon } from "@/lib/welcome-coupon"

export const runtime = "nodejs"

export async function POST(req: Request) {
  // At most 8 sign-ups per hour from one client — blocks bulk account/email spam.
  const limit = rateLimit(`register:${clientIp(req)}`, 8, 60 * 60 * 1000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many sign-up attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    )
  }

  let name = ""
  let email = ""
  let password = ""
  try {
    const body = await req.json()
    name = (body.name ?? "").trim()
    email = (body.email ?? "").trim().toLowerCase()
    password = body.password ?? ""
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      role: "user",
      // Give every new account a fun generated avatar — they can replace it later.
      avatar: randomAvatarUrl(email),
      notifications: {
        create: { message: `Welcome to BuyME, ${name}! Your account is ready.` },
      },
    },
  })

  // One welcome coupon per new account, included in the welcome email.
  const welcomeCoupon = await issueWelcomeCoupon()

  // Fire-and-forget so a mail hiccup never blocks signup. Log failures so a
  // misconfigured provider (e.g. Resend sandbox rejecting non-owner addresses)
  // is visible in the server logs instead of failing silently.
  sendWelcomeEmail(user.email, user.name, welcomeCoupon ?? undefined).catch((err) =>
    console.error("[register] welcome email failed:", err)
  )

  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  })

  const res = NextResponse.json({ ok: true, role: user.role })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
  return res
}
