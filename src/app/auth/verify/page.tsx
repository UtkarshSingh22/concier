// 🔒 CORE SYSTEM - DO NOT MODIFY
// Email verification success page
// Handles NextAuth sign-in after magic link verification

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleVerification = async () => {
      const email = searchParams.get("email");
      const verified = searchParams.get("verified");

      if (!email || verified !== "true") {
        setStatus("error");
        setMessage("Invalid verification link");
        return;
      }

      try {
        // Sign in with NextAuth credentials provider
        const result = await signIn("credentials", {
          email,
          verified: "true",
          callbackUrl: "/product",
          redirect: false, // Don't redirect automatically, handle it manually
        });

        if (result?.ok) {
          // Success - manually redirect
          setStatus("success");
          setMessage("Sign in successful! Redirecting...");
          setTimeout(() => {
            router.push("/product");
          }, 2000);
        } else {
          // Error - show error message
          setStatus("error");
          setMessage(`Sign in failed: ${result?.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Verification sign-in error:", error);
        setStatus("error");
        setMessage("An error occurred. Please try again.");
      }
    };

    handleVerification();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Verifying your email...
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Please wait while we sign you in.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Email verified!
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {message}
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Verification failed
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                {message}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/auth")}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Try again
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
