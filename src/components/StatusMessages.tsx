// 🔒 CORE SYSTEM - DO NOT MODIFY
// Status messages component for billing page
// Shows success/error alerts and toast notifications based on URL parameters

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle } from "lucide-react";

export const StatusMessages = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessedRef.current) return;

    if (success === "true") {
      hasProcessedRef.current = true;

      toast.success("🎉 Payment successful! Your subscription is now active.", {
        duration: 5000,
      });
    } else if (canceled === "true") {
      hasProcessedRef.current = true;

      toast.error("❌ Payment was canceled", {
        duration: 5000,
      });
    }
  }, [success, canceled, router]);

  if (success === "true") {
    return (
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-800">Payment Successful!</AlertTitle>
        <AlertDescription className="text-green-700">
          Your subscription has been activated! Data will update automatically
          in a few seconds. Welcome aboard! 🚀
        </AlertDescription>
      </Alert>
    );
  }

  if (canceled === "true") {
    return (
      <Alert className="mb-6 border-yellow-200 bg-yellow-50">
        <XCircle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Payment Cancelled</AlertTitle>
        <AlertDescription className="text-yellow-700">
          Your payment was cancelled and no charges were made. You can upgrade
          to Pro anytime from the options below.
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};
