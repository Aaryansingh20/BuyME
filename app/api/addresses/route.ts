import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getSessionUser } from "@/lib/session"

export const runtime = "nodejs"

const sel = {
  id: true,
  name: true,
  phone: true,
  line1: true,
  city: true,
  state: true,
  pincode: true,
  country: true,
  address: true,
  isDefault: true,
}

async function listFor(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    select: sel,
  })
}

type Fields = {
  name: string
  phone: string
  line1: string
  city: string
  state: string
  pincode: string
  country: string
}

function readFields(body: Record<string, unknown>): Fields {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "")
  return {
    name: str(body.name),
    phone: str(body.phone),
    line1: str(body.line1),
    city: str(body.city),
    state: str(body.state),
    pincode: str(body.pincode),
    country: str(body.country),
  }
}

// Validate the required parts; returns an error message or "".
function validate(f: Fields): string {
  if (!f.name) return "Address label is required"
  if (!f.line1) return "Street address is required"
  if (!f.city) return "City is required"
  if (!f.state) return "State is required"
  if (!f.pincode) return "PIN / ZIP code is required"
  if (!f.country) return "Country is required"
  if (!/^[0-9A-Za-z\s-]{3,10}$/.test(f.pincode)) return "Enter a valid PIN / ZIP code"
  if (f.phone && !/^[0-9+\s()-]{7,20}$/.test(f.phone)) return "Enter a valid phone number"
  return ""
}

// Single-line copy used for display and order snapshots.
function compose(f: Fields): string {
  return [f.line1, f.city, `${f.state} ${f.pincode}`.trim(), f.country]
    .filter(Boolean)
    .join(", ")
}

export async function GET() {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  return NextResponse.json({ addresses: await listFor(session.id) })
}

export async function POST(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const f = readFields(body)
  const error = validate(f)
  if (error) return NextResponse.json({ error }, { status: 400 })

  // First address a user adds becomes their default automatically.
  const count = await prisma.address.count({ where: { userId: session.id } })
  await prisma.address.create({
    data: {
      userId: session.id,
      name: f.name,
      phone: f.phone || null,
      line1: f.line1,
      city: f.city,
      state: f.state,
      pincode: f.pincode,
      country: f.country,
      address: compose(f),
      isDefault: count === 0,
    },
  })

  return NextResponse.json({ addresses: await listFor(session.id) })
}

export async function PATCH(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const id = typeof body.id === "string" ? body.id : ""
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  // Ownership check — never let a user touch someone else's address.
  const existing = await prisma.address.findFirst({ where: { id, userId: session.id } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  if (body.isDefault === true) {
    // Only one default at a time.
    await prisma.$transaction([
      prisma.address.updateMany({ where: { userId: session.id }, data: { isDefault: false } }),
      prisma.address.update({ where: { id }, data: { isDefault: true } }),
    ])
  } else {
    const f = readFields(body)
    const error = validate(f)
    if (error) return NextResponse.json({ error }, { status: 400 })
    await prisma.address.update({
      where: { id },
      data: {
        name: f.name,
        phone: f.phone || null,
        line1: f.line1,
        city: f.city,
        state: f.state,
        pincode: f.pincode,
        country: f.country,
        address: compose(f),
      },
    })
  }

  return NextResponse.json({ addresses: await listFor(session.id) })
}

export async function DELETE(req: Request) {
  const session = await getSessionUser()
  if (!session) return NextResponse.json({ error: "Not authenticated" }, { status: 401 })

  const id = new URL(req.url).searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.address.deleteMany({ where: { id, userId: session.id } })
  return NextResponse.json({ addresses: await listFor(session.id) })
}
