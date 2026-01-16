// 🏗️ USER EDITABLE - PRODUCT DASHBOARD CLIENT
// This is your main product dashboard. Build your features here.
// Safe to edit: Everything - this is where your product code goes.
// The email test button is just an example - replace with your features.

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If no user, show message (shouldn't happen due to protected route)
  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Unable to load user information.</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Welcome to your SaaS! This is your protected product area. Start
        building your features here.
      </p>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-sm font-medium text-gray-500 mb-2">
          Account Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{user.name || "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg mb-6">
        <h3 className="text-sm font-medium text-green-800 mb-2">
          📧 Test Email System
        </h3>
        <p className="text-sm text-green-700 mb-3">
          Send yourself a welcome email to test the email system.
        </p>
        <Button
          onClick={handleSendWelcomeEmail}
          disabled={isSendingEmail}
          className="bg-green-600 hover:bg-green-700"
        >
          {isSendingEmail ? "Sending..." : "Send Welcome Email"}
        </Button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">
          🚀 Build Your Product
        </h3>
        <p className="text-sm text-blue-700">
          This is where you implement your SaaS features. Add your dashboard,
          API routes, and UI components in the /product directory.
        </p>
      </div>
    </>
  );
}
