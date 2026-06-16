import Link from "next/link"
import Image from "next/image"
import bg from "@/public/auth-bg.jpg"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-black text-white">
      {/* Full-bleed background image */}
      <div className="fixed inset-0">
        <Image src={bg} alt="" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-5 block text-center text-3xl font-bold uppercase tracking-[0.3em] text-white sm:text-4xl"
          >
            BuyME
          </Link>
          {children}
        </div>
      </div>
    </main>
  )
}
