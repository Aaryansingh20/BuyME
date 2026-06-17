// Generated profile avatars via DiceBear (free, no API key). Rendered through a
// plain <img> (Radix AvatarImage), so no next/image domain config is needed; if
// the request ever fails, the UI falls back to the user's initials.
// Framework-agnostic — safe to import from both server routes and client code.

const AVATAR_STYLES = [
  "adventurer",
  "avataaars",
  "big-smile",
  "bottts",
  "fun-emoji",
  "lorelei",
  "micah",
  "notionists",
  "open-peeps",
  "personas",
  "thumbs",
] as const

/**
 * Build a deterministic avatar URL for a given style + seed. Same inputs always
 * produce the same picture, so a stored URL keeps rendering the same avatar.
 */
export function avatarUrl(seed: string, style: string = AVATAR_STYLES[0]): string {
  return `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`
}

/** Pick a random style + seed — used for the default avatar at sign-up and the
 *  "shuffle" button in the profile. */
export function randomAvatarUrl(seedHint?: string): string {
  const style = AVATAR_STYLES[Math.floor(Math.random() * AVATAR_STYLES.length)]
  const seed = `${seedHint ?? "buyme"}-${Math.random().toString(36).slice(2, 10)}`
  return avatarUrl(seed, style)
}
