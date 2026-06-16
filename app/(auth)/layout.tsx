import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden text-white">
      {/* Centered content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-6 sm:px-6">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-6 flex justify-center">
            <Logo />
          </Link>
          {children}
        </div>
      </div>
    </main>
  )
}
