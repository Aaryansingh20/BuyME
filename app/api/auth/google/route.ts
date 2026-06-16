import { NextResponse } from "next/server"
import crypto from "node:crypto"
import { GOOGLE_AUTH_URL, GOOGLE_STATE_COOKIE, getGoogleConfig, callbackUrl } from "@/lib/google"

export const runtime = "nodejs"

export async function GET(req: Request) {
  const origin = new URL(req.url).origin
  const config = getGoogleConfig()

  if (!config) {
    return NextResponse.redirect(`${origin}/login?error=google_not_configured`)
  }

  const state = crypto.randomUUID()
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: callbackUrl(origin),
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    prompt: "select_account",
  })

  const res = NextResponse.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`)
  res.cookies.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600, // 10 minutes
  })
  return res
}
