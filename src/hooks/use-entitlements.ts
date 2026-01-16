// 🔒 CORE SYSTEM - DO NOT MODIFY
// Client-side hook for checking user entitlements.
// Provides real-time entitlement checking for UI components.

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Entitlement {
  id: string;
  name: string;
  displayName: string;
  description: string;
}

export function useEntitlements() {
  const { data: session, status } = useSession();
  const [entitlements, setEntitlements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkEntitlements() {
      if (status !== "authenticated" || !session?.user?.email) {
        setEntitlements([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch user entitlements from API
        const response = await fetch("/api/user/entitlements");
        if (response.ok) {
          const data = await response.json();
          // Extract entitlement names from the objects
          const entitlementNames = (
            (data.entitlements as Entitlement[]) || []
          ).map((ent) => ent.name);
          setEntitlements(entitlementNames);
        } else {
          // Fallback to free plan entitlements
          setEntitlements([]);
        }
      } catch (error) {
        console.error("Failed to fetch entitlements:", error);
        setEntitlements([]);
      } finally {
        setLoading(false);
      }
    }

    checkEntitlements();
  }, [session, status]);

  const hasEntitlement = (entitlementName: string) => {
    return entitlements.includes(entitlementName);
  };

  return {
    entitlements,
    hasEntitlement,
    loading,
    isAuthenticated: status === "authenticated",
  };
}
