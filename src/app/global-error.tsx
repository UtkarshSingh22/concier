// 🔒 CORE SYSTEM - DO NOT MODIFY
// Root-level error boundary
// Catches errors that escape the regular error boundary

"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            fontFamily: "system-ui, sans-serif",
            padding: "20px",
          }}
        >
          <div
            style={{
              maxWidth: "500px",
              textAlign: "center",
            }}
          >
            <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#666", marginBottom: "24px" }}>
              We encountered an unexpected error. Our team has been notified.
            </p>
            {error.digest && (
              <p
                style={{
                  fontSize: "12px",
                  color: "#999",
                  fontFamily: "monospace",
                  marginBottom: "24px",
                }}
              >
                Error ID: {error.digest}
              </p>
            )}
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={reset}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#000",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Go home
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}

