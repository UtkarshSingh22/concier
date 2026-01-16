// 🔒 CORE SYSTEM - DO NOT MODIFY
// Sentry client-side configuration for error tracking
// This captures errors in React components and browser-side code

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || "development";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,

  // Traces sample rate (0.0 to 1.0)
  // Keep low in production to reduce quota usage
  tracesSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,

  // Don't send errors if DSN is missing
  enabled: !!SENTRY_DSN,

  // Filter out sensitive data
  beforeSend(event) {
    // Remove cookies and auth headers
    if (event.request) {
      delete event.request.cookies;
      if (event.request.headers) {
        delete event.request.headers.cookie;
        delete event.request.headers.authorization;
      }
    }
    return event;
  },

  // Ignore common non-critical errors
  ignoreErrors: [
    // Network errors
    "NetworkError",
    "Network request failed",
    // Browser extension errors
    "Non-Error promise rejection captured",
    // Cancelled requests
    "AbortError",
  ],
});
