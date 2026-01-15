// 🏗️ USER EDITABLE - BUILD YOUR PRODUCT HERE
// This is YOUR code. Everything in /product is for you to customize.
// The boilerplate handles auth, billing, and payments - you build the product.

import type { Metadata } from "next";
import { createStaticPageMetadata } from "@/lib/seo";
import { requireAuth } from "@/lib/auth-utils";

export const metadata: Metadata = createStaticPageMetadata(
  "Dashboard",
  "Welcome to your SaaS dashboard. Access premium features and manage your account."
);
import Header from "@/components/Header";
import ProductPageClient from "../../components/ProductPageClient";

export default async function ProductPage() {
  const user = await requireAuth(); // Protected route - redirects to /auth if not logged in

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <ProductPageClient user={user} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
