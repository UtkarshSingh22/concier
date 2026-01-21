// 🏗️ USER EDITABLE - UPGRADE PROMPT COMPONENT
// Customize upgrade messaging, styling, and plan mapping.
// Safe to edit: Copy, design, PLAN_REQUIREMENTS mapping.
// Keep the payment checkout flow logic intact.

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Crown, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UpgradePromptProps {
  entitlement?: string;
  title?: string;
  description?: string;
  planName?: string; // The plan name to upgrade to (e.g., "pro")
  buttonText?: string;
}

// Map entitlements to required plans
const PLAN_REQUIREMENTS: Record<string, { name: string; planName: string }> = {
  // Free plan entitlements
  basic_access: { name: "Free Plan", planName: "free" },

  // Pro plan entitlements
  pro_features: { name: "Pro Plan", planName: "pro" },
  api_access: { name: "Pro Plan", planName: "pro" },
  priority_support: { name: "Pro Plan", planName: "pro" },
  ai_access: { name: "Pro Plan", planName: "pro" },
};

export function UpgradePrompt({
  entitlement = "pro_features",
  title,
  description,
  planName,
  buttonText,
}: UpgradePromptProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Determine which plan is required based on entitlement
  const requirement =
    PLAN_REQUIREMENTS[entitlement] || PLAN_REQUIREMENTS.pro_features;
  const targetPlanName = planName || requirement.planName;

  const defaultTitle = `Upgrade to ${requirement.name}`;
  const defaultDescription = `This feature requires the ${requirement.name.toLowerCase()}. Upgrade now to unlock premium features.`;
  const defaultButtonText = `Upgrade to ${requirement.name}`;

  const handleUpgrade = async () => {
    setIsLoading(true);

    try {
      // Use unified payment checkout endpoint (routes to Stripe or Razorpay)
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planName: targetPlanName,
        }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Redirect to payment provider checkout
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to start checkout process");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mx-auto border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/50 dark:to-purple-950/50">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900">
          <Crown className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>
        <CardTitle className="text-xl text-gray-900 dark:text-gray-100">
          {title || defaultTitle}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
          {description || defaultDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center">
        <Button
          onClick={handleUpgrade}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white shadow-lg hover:shadow-xl transform transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              {buttonText || defaultButtonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Secure payment • Cancel anytime • 30-day money back guarantee
        </p>
      </CardContent>
    </Card>
  );
}
