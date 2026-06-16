// Runs once when the server boots. We use it to validate environment config up
// front. Guarded to the Node.js runtime so it never runs on the Edge.
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { validateEnv } = await import("./lib/env")
    validateEnv()
  }
}
