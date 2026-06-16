export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
export const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
export const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"
export const GOOGLE_STATE_COOKIE = "google_oauth_state"

export interface GoogleConfig {
  clientId: string
  clientSecret: string
}

export function getGoogleConfig(): GoogleConfig | null {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  if (!clientId || !clientSecret) return null
  return { clientId, clientSecret }
}

export function callbackUrl(origin: string) {
  return `${origin}/api/auth/google/callback`
}
