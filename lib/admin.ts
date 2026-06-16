import { NextResponse } from "next/server"
import { getSessionUser } from "./session"
import type { SessionUser } from "./auth"

// Server-only authorization guard for /api/admin/* routes.
//
// API routes are NOT covered by middleware (the matcher excludes /api), so each
// admin route must guard itself. Usage:
//
//   const guard = await requireAdmin()
//   if (guard instanceof NextResponse) return guard
//   const admin = guard // typed SessionUser with role "admin"
export async function requireAdmin(): Promise<SessionUser | NextResponse> {
  const session = await getSessionUser()
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
  if (session.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return session
}
