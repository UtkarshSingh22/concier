// 🔒 CORE SYSTEM - DO NOT MODIFY
// Layout for billing pages with appropriate metadata

import type { Metadata } from "next";
import { createStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createStaticPageMetadata(
  "Billing & Subscription",
  "Manage your subscription, billing information, and payment methods.",
  { noindex: true } // Private page - don't index sensitive billing info
);

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
