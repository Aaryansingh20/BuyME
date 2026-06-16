/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "pin.it" },
      { protocol: "https", hostname: "assets.emailfolio.com" },
      { protocol: "https", hostname: "hebbkx1anhila5yf.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
  experimental: {
    // Tree-shake big barrel packages (huge dev-compile + bundle win for icons).
    optimizePackageImports: ["lucide-react"],
    // Enable instrumentation.ts (startup env validation). Stable in Next 15;
    // still behind this flag in 14.x.
    instrumentationHook: true,
  },
}

export default nextConfig
