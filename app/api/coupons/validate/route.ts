import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"
import { evaluateCoupon, normalizeCode } from "@/lib/coupons"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const code = normalizeCode(body.code)
  const subtotal = Number(body.subtotal)
  if (!code) return NextResponse.json({ error: "Enter a coupon code" }, { status: 400 })
  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return NextResponse.json({ error: "Invalid subtotal" }, { status: 400 })
  }

  const coupon = await prisma.coupon.findUnique({ where: { code } })
  const result = evaluateCoupon(coupon, subtotal)
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 })

  // One redemption per user.
  const already = await prisma.couponRedemption.findUnique({
    where: { couponId_userId: { couponId: coupon!.id, userId: session.id } },
  })
  if (already) {
    return NextResponse.json({ error: "You have already used this coupon" }, { status: 400 })
  }

  return NextResponse.json(result)
}
