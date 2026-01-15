// 🔒 CORE SYSTEM - DO NOT MODIFY
// This file handles pricing display and is part of the protected boilerplate.
// Users should NOT edit this file. Build your product logic in /product instead.

import type { Metadata } from "next";
import { createStaticPageMetadata } from "@/lib/seo";

// Example: Use static page metadata helper for pricing page
export const metadata: Metadata = createStaticPageMetadata(
  "Pricing",
  "Choose the perfect plan for your business needs."
);

const PricingPage = () => {
  return <div>Pricing</div>;
};

export default PricingPage;
