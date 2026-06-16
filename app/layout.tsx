import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Providers } from "@/hooks/provider";
import { AppBackdrop } from "@/components/ui/app-backdrop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "BUYME — Modern Fashion Store",
    template: "%s · BUYME",
  },
  description: "Shop premium clothing and accessories at BUYME.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <Providers>
            {children}
          </Providers>
        </div>
        </body>
    </html>
  );
}
