import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"
import { describeUserAgent } from "@/lib/login-events"

export const runtime = "nodejs"

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const events = await prisma.loginEvent.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, ip: true, userAgent: true, method: true, createdAt: true },
  })

  return NextResponse.json({
    history: events.map((e) => ({
      id: e.id,
      device: describeUserAgent(e.userAgent),
      ip: e.ip,
      method: e.method,
      createdAt: e.createdAt,
    })),
  })
}
