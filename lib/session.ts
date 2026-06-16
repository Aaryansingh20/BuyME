import { cookies } from "next/headers"
import { SESSION_COOKIE, verifySessionToken, type SessionUser } from "./auth"

// Server-only: read and verify the current session from cookies.
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value
  return verifySessionToken(token)
}
