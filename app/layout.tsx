import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Providers } from "@/hooks/provider";
import { AppBackdrop } from "@/components/ui/app-backdrop";
import { CURRENCY_COOKIE, normalizeCurrency } from "@/lib/currency";
import { getBaseUrl } from "@/lib/url";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // Resolves relative canonical / OG image URLs to absolute ones.
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "BUYME — Modern Fashion Store",
    template: "%s · BUYME",
  },
  description: "Shop premium clothing and accessories at BUYME.",
  openGraph: {
    siteName: "BUYME",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Seed the currency from the cookie so SSR and the client agree (no flash/mismatch).
  const initialCurrency = normalizeCurrency(cookies().get(CURRENCY_COOKIE)?.value);
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Site-wide wallpaper + colour-glow backdrop; content sits above it. */}
        <AppBackdrop />
        <NextTopLoader
          color="#ffffff"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #ffffff,0 0 5px #ffffff"
        />
        <div className="relative z-10">
          <Providers initialCurrency={initialCurrency}>
            {children}
          </Providers>
        </div>
        </body>
    </html>
  );
}
