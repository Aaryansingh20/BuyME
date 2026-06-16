// Validate required environment variables. Run once at startup (see
// instrumentation.ts) so a misconfigured deploy fails fast with a clear message
// instead of throwing cryptic errors deep inside a request later.

const REQUIRED = ["AUTH_SECRET", "DATABASE_URL"] as const

export function validateEnv(): void {
  const missing = REQUIRED.filter((key) => !process.env[key]?.trim())
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        `Set them in your environment (see .env.example).`
    )
  }

  // AUTH_SECRET is the HMAC key for session JWTs — a short value is unsafe.
  if ((process.env.AUTH_SECRET ?? "").length < 16) {
    throw new Error("AUTH_SECRET is too short — use at least 16 characters (32+ recommended).")
  }
}
