import crypto from "node:crypto"

// High-entropy reset token: the raw token goes in the email link,
// only its SHA-256 hash is stored in the database.
export function generateResetToken() {
  const token = crypto.randomBytes(32).toString("hex")
  return { token, tokenHash: hashToken(token) }
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}
