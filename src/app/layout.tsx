import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Web3Provider from "../components/Web3Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Base Sniper - Base Chain",
  description: "Next.js Token Sniper & Analyzer on Base",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={inter.className}>
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
