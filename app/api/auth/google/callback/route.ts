import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { sendWelcomeEmail } from "@/lib/email"
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE, type Role } from "@/lib/auth"
import {
  GOOGLE_TOKEN_URL,
  GOOGLE_USERINFO_URL,
  GOOGLE_STATE_COOKIE,
  getGoogleConfig,
  callbackUrl,
} from "@/lib/google"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const origin = url.origin
  const fail = (reason: string) => NextResponse.redirect(`${origin}/login?error=${reason}`)

  const config = getGoogleConfig()
  if (!config) return fail("google_not_configured")

  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const storedState = cookies().get(GOOGLE_STATE_COOKIE)?.value

  if (!code || !state || !storedState || state !== storedState) {
    return fail("oauth")
  }

  // Exchange the authorization code for tokens.
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: callbackUrl(origin),
    }),
  })
  if (!tokenRes.ok) return fail("oauth")
  const tokens = await tokenRes.json()

  // Fetch the user's Google profile.
  const infoRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  if (!infoRes.ok) return fail("oauth")
  const info = await infoRes.json()
  if (!info.email) return fail("oauth")

  const email = String(info.email).toLowerCase()
  let user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: info.name || email.split("@")[0],
        role: "user",
        avatar: info.picture || null,
      },
    })
    // New account via Google — send a welcome email (fire-and-forget).
    sendWelcomeEmail(user.email, user.name).catch(() => {})
  }

  const token = await createSessionToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as Role,
  })

  const dest = user.role === "admin" ? "/admin" : "/"
  const res = NextResponse.redirect(`${origin}${dest}`)
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
  res.cookies.set(GOOGLE_STATE_COOKIE, "", { path: "/", maxAge: 0 })
  return res
}
