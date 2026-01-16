// 🏗️ USER EDITABLE - BUILD YOUR PRODUCT HERE
// This is YOUR code. Everything in /product is for you to customize.
// The boilerplate handles auth, billing, and payments - you build the product.

import type { Metadata } from "next";
import { Suspense } from "react";
import { createStaticPageMetadata } from "@/lib/seo";
import Header from "@/components/Header";
import ProductPageClient from "@/components/ProductPageClient";

export const metadata: Metadata = createStaticPageMetadata(
  "Dashboard",
  "Welcome to your SaaS dashboard. Access premium features and manage your account."
);

// Loading skeleton component for Suspense fallback
function ProductSkeleton() {
  return (
    <>
      <div className="animate-pulse h-8 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="animate-pulse h-4 w-full bg-gray-200 rounded mb-2"></div>
      <div className="animate-pulse h-4 w-3/4 bg-gray-200 rounded mb-6"></div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="animate-pulse h-5 w-40 bg-gray-300 rounded mb-3"></div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="animate-pulse h-4 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="animate-pulse h-5 w-32 bg-gray-300 rounded"></div>
          </div>
          <div>
            <div className="animate-pulse h-4 w-16 bg-gray-200 rounded mb-2"></div>
            <div className="animate-pulse h-5 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="animate-pulse h-5 w-40 bg-green-200 rounded mb-2"></div>
          <div className="animate-pulse h-4 w-full bg-green-100 rounded mb-1"></div>
          <div className="animate-pulse h-4 w-2/3 bg-green-100 rounded mb-3"></div>
          <div className="animate-pulse h-10 w-40 bg-green-200 rounded"></div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="animate-pulse h-5 w-40 bg-blue-200 rounded mb-2"></div>
          <div className="animate-pulse h-4 w-full bg-blue-100 rounded mb-1"></div>
          <div className="animate-pulse h-4 w-3/4 bg-blue-100 rounded"></div>
        </div>
      </div>
    </>
  );
}

export default async function ProductPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <Suspense fallback={<ProductSkeleton />}>
                <ProductPageClient />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
