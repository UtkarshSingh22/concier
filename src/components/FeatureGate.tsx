// 🏗️ USER EDITABLE - FEATURE GATE COMPONENT
// Customize loading states, locked UI, and styling.
// Safe to edit: UI/UX, fallback content, styling.
// Keep the entitlement checking logic intact.

"use client";

import { ReactNode } from "react";
import { useEntitlements } from "@/hooks/use-entitlements";
import { UpgradePrompt } from "./UpgradePrompt";

interface FeatureGateProps {
  entitlement: string;
  fallback?: ReactNode;
  children: ReactNode;
}

export function FeatureGate({
  entitlement,
  fallback,
  children,
}: FeatureGateProps) {
  const { hasEntitlement, loading, isAuthenticated } = useEntitlements();

  // Show loading state while checking entitlements
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If user is not authenticated, show login prompt (optional)
  if (!isAuthenticated) {
    return (
      <div className="text-center p-8 border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-600 mb-4">
          Please sign in to access this feature.
        </p>
        <a
          href="/auth"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Sign In
        </a>
      </div>
    );
  }

  // If user has the entitlement, show the feature
  if (hasEntitlement(entitlement)) {
    return <>{children}</>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default to upgrade prompt
  return <UpgradePrompt entitlement={entitlement} />;
}
