// 🔒 CORE SYSTEM - DO NOT MODIFY
// Root layout component with SessionProvider and Toaster
// Users should NOT edit this file. Build your product logic in /product instead.

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "@/components/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Boilerplate - Build Your Product",
  description:
    "Production-ready SaaS boilerplate with authentication, billing, and payments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
