// 🔒 CORE SYSTEM - DO NOT MODIFY
// Sentry server-side configuration for error tracking
// This captures errors in API routes, server components, and server actions

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || "development";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,

  // Traces sample rate (0.0 to 1.0)
  tracesSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.1 : 1.0,

  // Don't send errors if DSN is missing
  enabled: !!SENTRY_DSN,

  // Filter out sensitive data
  beforeSend(event) {
    // Remove sensitive environment variables
    if (event.contexts?.runtime?.env) {
      delete event.contexts.runtime.env;
    }

    // Remove sensitive headers
    if (event.request?.headers) {
      delete event.request.headers.authorization;
      delete event.request.headers.cookie;
      delete event.request.headers["stripe-signature"];
    }

    return event;
  },

  // Ignore common non-critical errors
  ignoreErrors: [
    // Expected auth redirects
    "NEXT_REDIRECT",
    // Network timeouts
    "ETIMEDOUT",
    "ECONNRESET",
  ],
});
