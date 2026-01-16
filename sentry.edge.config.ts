// 🔒 CORE SYSTEM - DO NOT MODIFY
// Sentry edge runtime configuration for error tracking
// This captures errors in middleware and edge functions

import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || "development";

Sentry.init({
  dsn: SENTRY_DSN,
  environment: SENTRY_ENVIRONMENT,

  // Lower sample rate for edge to reduce quota usage
  tracesSampleRate: SENTRY_ENVIRONMENT === "production" ? 0.05 : 1.0,

  // Disable debug in production
  debug: SENTRY_ENVIRONMENT === "development",

  // Don't send errors if DSN is missing
  enabled: !!SENTRY_DSN,
});

