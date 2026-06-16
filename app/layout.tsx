import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";
import { Providers } from "@/hooks/provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Buyme",
  description: "best ecommerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextTopLoader
          color="#ffffff"
          height={3}
          showSpinner={false}
          shadow="0 0 10px #ffffff,0 0 5px #ffffff"
        />
        <Providers>
        {children}
        </Providers>
        </body>
    </html>
  );
}
