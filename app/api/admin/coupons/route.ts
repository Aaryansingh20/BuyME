import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { normalizeCode } from "@/lib/coupons"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })
  return NextResponse.json({ coupons })
}

export async function POST(req: Request) {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const code = normalizeCode(body.code)
  const type = body.type === "fixed" ? "fixed" : "percent"
  const value = Number(body.value)
  const minSubtotal = body.minSubtotal === undefined ? 0 : Number(body.minSubtotal)
  const maxRedemptions =
    body.maxRedemptions === undefined || body.maxRedemptions === null || body.maxRedemptions === ""
      ? null
      : Math.floor(Number(body.maxRedemptions))
  const expiresAt = typeof body.expiresAt === "string" && body.expiresAt ? new Date(body.expiresAt) : null

  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 })
  if (!Number.isFinite(value) || value <= 0) {
    return NextResponse.json({ error: "Value must be a positive number" }, { status: 400 })
  }
  if (type === "percent" && value > 100) {
    return NextResponse.json({ error: "Percent discount cannot exceed 100" }, { status: 400 })
  }
  if (!Number.isFinite(minSubtotal) || minSubtotal < 0) {
    return NextResponse.json({ error: "Minimum subtotal must be zero or more" }, { status: 400 })
  }
  if (maxRedemptions !== null && (!Number.isFinite(maxRedemptions) || maxRedemptions < 1)) {
    return NextResponse.json({ error: "Max redemptions must be at least 1" }, { status: 400 })
  }
  if (expiresAt && Number.isNaN(expiresAt.getTime())) {
    return NextResponse.json({ error: "Invalid expiry date" }, { status: 400 })
  }

  const existing = await prisma.coupon.findUnique({ where: { code } })
  if (existing) return NextResponse.json({ error: "A coupon with that code already exists" }, { status: 409 })

  const coupon = await prisma.coupon.create({
    data: { code, type, value, minSubtotal, maxRedemptions, expiresAt },
  })
  return NextResponse.json({ coupon })
}

export async function PATCH(req: Request) {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const id = typeof body.id === "string" ? body.id : ""
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })
  if (typeof body.active !== "boolean") {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 })
  }

  const existing = await prisma.coupon.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const coupon = await prisma.coupon.update({ where: { id }, data: { active: body.active } })
  return NextResponse.json({ coupon })
}

export async function DELETE(req: Request) {
  const guard = await requireAdmin()
  if (guard instanceof NextResponse) return guard

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.coupon.delete({ where: { id } }).catch(() => {})
  return NextResponse.json({ ok: true })
}
