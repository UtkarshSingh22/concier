// 🏗️ USER EDITABLE - PROTECTED LAYOUT
// Customize the styling and structure of the protected layout.
// The core authentication checks and entitlement logic should remain intact.

import { requireAuth } from "@/lib/auth-utils";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check - redirects to /auth if not authenticated
  await requireAuth();

  // Note: Individual pages can add their own entitlement checks using requireEntitlement()
  // This layout provides the base authentication layer

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional: Add entitlement banner here if needed */}
      {/* Example: Show banner if user lacks certain base entitlements */}

      {/* Render child pages */}
      {children}
    </div>
  );
}
