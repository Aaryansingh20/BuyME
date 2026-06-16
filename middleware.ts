import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth"

const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(p + "/"))

  // Not signed in: only the auth pages are reachable.
  if (!session) {
    if (isAuthPage) return NextResponse.next()
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("from", pathname)
    return NextResponse.redirect(url)
  }

  // Signed in but on an auth page: bounce to the right home.
  if (isAuthPage) {
    const url = req.nextUrl.clone()
    url.pathname = session.role === "admin" ? "/admin" : "/"
    url.search = ""
    return NextResponse.redirect(url)
  }

  // Admin area is admin-only.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    if (session.role !== "admin") {
      const url = req.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  // Run on everything except API routes, Next internals and static files
  // (anything with a file extension, e.g. /auth-bg.jpg).
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
}
