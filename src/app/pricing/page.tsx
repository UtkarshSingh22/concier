// 🏗️ USER EDITABLE - PRICING PAGE
// Customize pricing plans, features, and design.
// This is a server component that handles metadata (SEO).
// Interactive logic is in PricingPageClient component.

import type { Metadata } from "next";
import { createStaticPageMetadata } from "@/lib/seo";
import PricingPageClient from "@/components/PricingPageClient";

export const metadata: Metadata = createStaticPageMetadata(
  "Pricing",
  "Choose the perfect plan for your business needs. Start free, upgrade anytime with 30-day money-back guarantee."
);

export default function PricingPage() {
  return <PricingPageClient />;
}
