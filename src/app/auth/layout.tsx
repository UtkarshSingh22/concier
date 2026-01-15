// 🔒 CORE SYSTEM - DO NOT MODIFY
// Layout for authentication pages

import type { Metadata } from "next";
import { createStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createStaticPageMetadata(
  "Sign In",
  "Sign in to your account to access premium features and manage your subscription.",
  { noindex: true } // Auth pages typically shouldn't be indexed
);

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
