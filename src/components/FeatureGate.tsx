// 🏗️ USER EDITABLE - FEATURE GATE COMPONENT
// Customize loading states, locked UI, and styling.
// Safe to edit: UI/UX, fallback content, styling.
// Keep the entitlement checking logic intact.

"use client";

import { ReactNode } from "react";
import { useEntitlements } from "@/hooks/use-entitlements";
import { UpgradePrompt } from "./UpgradePrompt";
import { Loader2 } from "lucide-react";

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
      <div className="w-full border rounded-lg p-8 flex items-center justify-center bg-card">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // If user is not authenticated, show login prompt (optional)
  if (!isAuthenticated) {
    return (
      <div className="w-full border rounded-lg bg-card text-center p-8">
        <p className="text-muted-foreground mb-4">
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
    return <div className="w-full border rounded-lg">{children}</div>;
  }

  // If custom fallback provided, use it
  if (fallback) {
    return <div className="w-full border rounded-lg">{fallback}</div>;
  }

  // Default to upgrade prompt
  return (
    <div className="w-full border rounded-lg">
      <UpgradePrompt entitlement={entitlement} />
    </div>
  );
}
