// Edge-safe session helpers (JWT via jose). Safe to import from middleware —
// must NOT import Prisma, bcrypt, or other Node-only modules.
import { SignJWT, jwtVerify } from "jose"

export const SESSION_COOKIE = "buyme_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export type Role = "admin" | "user"

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error("AUTH_SECRET is not set")
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return new SignJWT({ email: user.email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())
}

export async function verifySessionToken(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    const role = payload.role
    if (
      typeof payload.sub === "string" &&
      typeof payload.email === "string" &&
      (role === "admin" || role === "user")
    ) {
      return {
        id: payload.sub,
        email: payload.email,
        name: typeof payload.name === "string" ? payload.name : "",
        role,
      }
    }
    return null
  } catch {
    return null
  }
}
