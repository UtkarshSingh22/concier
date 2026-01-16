// 🔒 CORE SYSTEM - DO NOT MODIFY
// Minimal logging utility with Sentry integration
// Provides structured logging for the application

import * as Sentry from "@sentry/nextjs";

interface LogOptions {
  context?: string;
  tags?: Record<string, string>;
  userId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log info message
 * Only logs to console, not sent to Sentry
 */
export function info(message: string, options?: LogOptions): void {
  if (process.env.NODE_ENV === "development") {
    const prefix = options?.context ? `[${options.context}]` : "";
    console.log(`${prefix} ${message}`, options?.metadata || "");
  }
}

/**
 * Log warning message
 * Logs to console and sends to Sentry
 */
export function warn(message: string, options?: LogOptions): void {
  // Console log in development
  if (process.env.NODE_ENV === "development") {
    const prefix = options?.context ? `[${options.context}]` : "";
    console.warn(`${prefix} ${message}`, options?.metadata || "");
  }

  // Send to Sentry
  Sentry.captureMessage(message, {
    level: "warning",
    tags: {
      type: "warning",
      context: options?.context || "unknown",
      ...options?.tags,
    },
    user: options?.userId ? { id: options.userId } : undefined,
    contexts: {
      metadata: options?.metadata,
    },
  });
}

/**
 * Log error message or exception
 * Logs to console and sends to Sentry
 */
export function error(
  messageOrError: string | Error,
  options?: LogOptions
): void {
  // Console log in development
  if (process.env.NODE_ENV === "development") {
    const prefix = options?.context ? `[${options.context}]` : "";
    console.error(`${prefix}`, messageOrError, options?.metadata || "");
  }

  // Send to Sentry
  if (typeof messageOrError === "string") {
    Sentry.captureMessage(messageOrError, {
      level: "error",
      tags: {
        type: "error",
        context: options?.context || "unknown",
        ...options?.tags,
      },
      user: options?.userId ? { id: options.userId } : undefined,
      contexts: {
        metadata: options?.metadata,
      },
    });
  } else {
    Sentry.captureException(messageOrError, {
      tags: {
        type: "exception",
        context: options?.context || "unknown",
        ...options?.tags,
      },
      user: options?.userId ? { id: options.userId } : undefined,
      contexts: {
        metadata: options?.metadata,
      },
    });
  }
}

/**
 * Create a scoped logger with fixed context
 * Useful for logging within a specific module
 *
 * @example
 * const log = createLogger("auth");
 * log.info("User logged in");
 * log.error("Login failed", { userId: "123" });
 */
export function createLogger(context: string) {
  return {
    info: (message: string, options?: Omit<LogOptions, "context">) =>
      info(message, { ...options, context }),
    warn: (message: string, options?: Omit<LogOptions, "context">) =>
      warn(message, { ...options, context }),
    error: (
      messageOrError: string | Error,
      options?: Omit<LogOptions, "context">
    ) => error(messageOrError, { ...options, context }),
  };
}

// Export default logger
export const logger = {
  info,
  warn,
  error,
  createLogger,
};
