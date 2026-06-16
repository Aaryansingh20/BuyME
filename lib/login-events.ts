import { prisma } from "./prisma"

// Pull the client IP from the standard proxy headers (Vercel/Neon sit behind a
// proxy, so req.ip isn't reliable). Falls back to null when nothing is present.
export function clientIp(req: Request): string | null {
  const fwd = req.headers.get("x-forwarded-for")
  if (fwd) return fwd.split(",")[0].trim() || null
  return req.headers.get("x-real-ip")
}

// Record a successful sign-in. Fire-and-forget: never block or fail login on it.
export async function recordLogin(
  userId: string,
  req: Request,
  method: "password" | "google" = "password"
): Promise<void> {
  try {
    await prisma.loginEvent.create({
      data: {
        userId,
        method,
        ip: clientIp(req),
        userAgent: req.headers.get("user-agent")?.slice(0, 400) || null,
      },
    })
    // Keep only the 20 most recent events per user so the table can't grow forever.
    const old = await prisma.loginEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: 20,
      select: { id: true },
    })
    if (old.length) {
      await prisma.loginEvent.deleteMany({ where: { id: { in: old.map((e) => e.id) } } })
    }
  } catch (err) {
    console.error("[login-events] failed to record login:", err)
  }
}

// Turn a raw User-Agent string into a friendly "Chrome on Windows" style label.
export function describeUserAgent(ua: string | null): string {
  if (!ua) return "Unknown device"

  const browser =
    /Edg\//.test(ua) ? "Edge"
    : /OPR\/|Opera/.test(ua) ? "Opera"
    : /Chrome\//.test(ua) ? "Chrome"
    : /Firefox\//.test(ua) ? "Firefox"
    : /Safari\//.test(ua) ? "Safari"
    : "Browser"

  const os =
    /Windows/.test(ua) ? "Windows"
    : /Android/.test(ua) ? "Android"
    : /iPhone|iPad|iPod/.test(ua) ? "iOS"
    : /Mac OS X|Macintosh/.test(ua) ? "macOS"
    : /Linux/.test(ua) ? "Linux"
    : "Unknown OS"

  return `${browser} on ${os}`
}
