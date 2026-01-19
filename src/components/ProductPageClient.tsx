// 🏗️ USER EDITABLE - PRODUCT DASHBOARD CLIENT
// This is your main product dashboard. Build your features here.
// Safe to edit: Everything - this is where your product code goes.
// The email test button is just an example - replace with your features.

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FeatureGate } from "@/components/FeatureGate";
import { AITest } from "@/components/product/AITest";

export default function ProductPageClient() {
  const { data: session, status } = useSession();
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Get user from session
  const user = session?.user;

  const handleSendWelcomeEmail = async () => {
    if (!user?.email) {
      toast.error("User email not found");
      return;
    }

    try {
      setIsSendingEmail(true);

      const response = await fetch("/api/send-welcome-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: user.email,
          userName: user.name || "there",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to send email");
      }

      toast.success(
        "Welcome email sent successfully! 📧\nCheck your inbox for the welcome message.",
        {
          duration: 5000,
          style: {
            whiteSpace: "pre-line",
          },
        }
      );
    } catch (error) {
      console.error("Failed to send welcome email:", error);
      toast.error(
        `Failed to send welcome email\n${error instanceof Error ? error.message : "Please try again."}`,
        {
          duration: 5000,
          style: {
            whiteSpace: "pre-line",
          },
        }
      );
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Show loading state while session is loading
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  // If no user, show message (shouldn't happen due to protected route)
  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Unable to load user information.
        </p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-card-foreground mb-4">
        Dashboard
      </h1>
      <p className="text-muted-foreground mb-6">
        Welcome to your SaaS! This is your protected product area. Start
        building your features here.
      </p>

      <div className="bg-muted/50 p-4 rounded-lg mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-2">
          Account Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium text-card-foreground">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium text-card-foreground">
              {user.name || "N/A"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-sm font-medium text-card-foreground mb-2">
            Test Email System
        </h3>
          <p className="text-sm text-muted-foreground mb-3">
          Send yourself a welcome email to test the email system.
        </p>
        <Button
          onClick={handleSendWelcomeEmail}
          disabled={isSendingEmail}
            variant="outline"
            size="sm"
        >
          {isSendingEmail ? "Sending..." : "Send Welcome Email"}
        </Button>
      </div>

        <div className="p-4 rounded-lg border bg-card">
          <h3 className="text-sm font-medium text-card-foreground mb-2">
            Build Your Product
        </h3>
          <p className="text-sm text-muted-foreground">
          This is where you implement your SaaS features. Add your dashboard,
          API routes, and UI components in the /product directory.
        </p>
      </div>
      </div>

      {/* Example / testing component — safe to remove */}
      <FeatureGate entitlement="ai_access">
        <AITest />
      </FeatureGate>
    </>
  );
}
