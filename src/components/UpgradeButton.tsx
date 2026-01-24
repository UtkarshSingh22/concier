// 🏗️ USER EDITABLE - UPGRADE BUTTON COMPONENT
// Customize the styling and appearance of the upgrade button.
// The core payment checkout flow logic should remain intact.

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UpgradeButtonProps {
  planName: string;
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary";
  className?: string;
}

export const UpgradeButton = ({
  planName,
  children,
  variant = "default",
  className,
}: UpgradeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    try {
      setIsLoading(true);

      // Use unified payment checkout endpoint (routes to Stripe or Razorpay)
      const response = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout session");
      }

      const { url } = await response.json();

      // Redirect to payment provider checkout
      window.location.href = url;
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to start upgrade process",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      variant={variant}
      className={className}
    >
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </Button>
  );
};
