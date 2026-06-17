import { randomBytes } from "crypto"
import { prisma } from "./prisma"

// Each new account gets exactly ONE single-use welcome coupon, emailed once.
export const WELCOME_PERCENT = 10
const VALID_DAYS = 30

/**
 * Create a unique single-use welcome coupon and return its code. Best-effort:
 * returns null on failure so signup is never blocked by coupon creation.
 */
export async function issueWelcomeCoupon(): Promise<{ code: string; percent: number } | null> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = `WELCOME${WELCOME_PERCENT}-${randomBytes(3).toString("hex").toUpperCase()}`
    try {
      await prisma.coupon.create({
        data: {
          code,
          type: "percent",
          value: WELCOME_PERCENT,
          minSubtotal: 0,
          maxRedemptions: 1, // single use — belongs to this shopper only
          active: true,
          expiresAt: new Date(Date.now() + VALID_DAYS * 24 * 60 * 60 * 1000),
        },
      })
      return { code, percent: WELCOME_PERCENT }
    } catch (err) {
      // Almost always a unique-code collision — retry with a fresh suffix.
      if (attempt === 4) console.error("[welcome-coupon] could not create coupon:", err)
    }
  }
  return null
}
