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
      <div className="animate-pulse h-8 w-48 bg-muted rounded mb-4"></div>
      <div className="animate-pulse h-4 w-full bg-muted rounded mb-2"></div>
      <div className="animate-pulse h-4 w-3/4 bg-muted rounded mb-6"></div>

      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <div className="animate-pulse h-5 w-40 bg-muted rounded mb-3"></div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="animate-pulse h-4 w-16 bg-muted rounded mb-2"></div>
            <div className="animate-pulse h-5 w-32 bg-muted rounded"></div>
          </div>
          <div>
            <div className="animate-pulse h-4 w-16 bg-muted rounded mb-2"></div>
            <div className="animate-pulse h-5 w-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
          <div className="animate-pulse h-5 w-40 bg-green-200 dark:bg-green-800 rounded mb-2"></div>
          <div className="animate-pulse h-4 w-full bg-green-100 dark:bg-green-900 rounded mb-1"></div>
          <div className="animate-pulse h-4 w-2/3 bg-green-100 dark:bg-green-900 rounded mb-3"></div>
          <div className="animate-pulse h-10 w-40 bg-green-200 dark:bg-green-800 rounded"></div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <div className="animate-pulse h-5 w-40 bg-blue-200 dark:bg-blue-800 rounded mb-2"></div>
          <div className="animate-pulse h-4 w-full bg-blue-100 dark:bg-blue-900 rounded mb-1"></div>
          <div className="animate-pulse h-4 w-3/4 bg-blue-100 dark:bg-blue-900 rounded"></div>
        </div>
      </div>
    </>
  );
}

export default async function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-card overflow-hidden shadow rounded-lg border">
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
