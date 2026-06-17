// Probe which Gemini models have working quota for the key in .env.
// Run: node scripts/test-gemini.mjs   (prints model + HTTP status, never the key)
import { readFileSync } from "node:fs"

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY.trim()
  try {
    const env = readFileSync(new URL("../.env", import.meta.url), "utf8")
    const line = env.split(/\r?\n/).find((l) => l.startsWith("GEMINI_API_KEY="))
    if (line) return line.slice("GEMINI_API_KEY=".length).trim().replace(/^["']|["']$/g, "")
  } catch {}
  return null
}

const key = loadKey()
if (!key) {
  console.error("No GEMINI_API_KEY found in env or .env")
  process.exit(1)
}

const models = [
  "gemini-2.0-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
]

for (const model of models) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: "Say OK" }] }] }),
      }
    )
    let note = ""
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      note = body?.error?.message?.split("\n")[0]?.slice(0, 90) ?? ""
    }
    const mark = res.ok ? "✅ WORKS" : `❌ ${res.status}`
    console.log(`${mark.padEnd(10)} ${model}${note ? "  — " + note : ""}`)
  } catch (e) {
    console.log(`❌ ERR     ${model}  — ${e.message}`)
  }
}
