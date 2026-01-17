// 🔒 CORE SYSTEM — DO NOT MODIFY
// Error types for the AI infrastructure.
// Normalizes errors from different providers into a consistent format.

import * as Sentry from "@sentry/nextjs";

/**
 * Error codes for AI operations
 */
export type AIErrorCode =
  | "PROVIDER_NOT_CONFIGURED"
  | "PROVIDER_NOT_AVAILABLE"
  | "INVALID_REQUEST"
  | "RATE_LIMITED"
  | "CONTEXT_LENGTH_EXCEEDED"
  | "CONTENT_FILTERED"
  | "TIMEOUT"
  | "PROVIDER_ERROR"
  | "UNAUTHORIZED"
  | "INSUFFICIENT_QUOTA"
  | "UNKNOWN_ERROR";

/**
 * Base error class for AI operations
 */
export class AIError extends Error {
  public readonly code: AIErrorCode;
  public readonly provider?: string;
  public readonly statusCode: number;
  public readonly retryable: boolean;
  public readonly originalError?: unknown;

  constructor(
    message: string,
    code: AIErrorCode,
    options?: {
      provider?: string;
      statusCode?: number;
      retryable?: boolean;
      originalError?: unknown;
    }
  ) {
    super(message);
    this.name = "AIError";
    this.code = code;
    this.provider = options?.provider;
    this.statusCode = options?.statusCode ?? getDefaultStatusCode(code);
    this.retryable = options?.retryable ?? isRetryable(code);
    this.originalError = options?.originalError;
  }

  /**
   * Get a safe message to return to the client
   * (without exposing internal details)
   */
  toClientMessage(): string {
    switch (this.code) {
      case "PROVIDER_NOT_CONFIGURED":
        return "AI service is not configured. Please contact support.";
      case "PROVIDER_NOT_AVAILABLE":
        return "AI service is temporarily unavailable. Please try again later.";
      case "INVALID_REQUEST":
        return "Invalid request. Please check your input and try again.";
      case "RATE_LIMITED":
        return "Too many requests. Please wait before trying again.";
      case "CONTEXT_LENGTH_EXCEEDED":
        return "Input is too long. Please reduce the length and try again.";
      case "CONTENT_FILTERED":
        return "Request was blocked by content filters.";
      case "TIMEOUT":
        return "Request timed out. Please try again.";
      case "UNAUTHORIZED":
        return "Authentication failed. Please contact support.";
      case "INSUFFICIENT_QUOTA":
        return "Service quota exceeded. Please contact support.";
      case "PROVIDER_ERROR":
      case "UNKNOWN_ERROR":
      default:
        return "An error occurred. Please try again later.";
    }
  }
}

/**
 * Get default HTTP status code for an error code
 */
function getDefaultStatusCode(code: AIErrorCode): number {
  switch (code) {
    case "INVALID_REQUEST":
    case "CONTEXT_LENGTH_EXCEEDED":
      return 400;
    case "UNAUTHORIZED":
    case "PROVIDER_NOT_CONFIGURED":
      return 401;
    case "CONTENT_FILTERED":
      return 403;
    case "RATE_LIMITED":
    case "INSUFFICIENT_QUOTA":
      return 429;
    case "TIMEOUT":
      return 504;
    case "PROVIDER_NOT_AVAILABLE":
    case "PROVIDER_ERROR":
    case "UNKNOWN_ERROR":
    default:
      return 500;
  }
}

/**
 * Determine if an error is retryable
 */
function isRetryable(code: AIErrorCode): boolean {
  switch (code) {
    case "RATE_LIMITED":
    case "TIMEOUT":
    case "PROVIDER_NOT_AVAILABLE":
    case "PROVIDER_ERROR":
      return true;
    default:
      return false;
  }
}

/**
 * Normalize provider-specific errors into AIError
 */
export function normalizeProviderError(
  error: unknown,
  provider: string
): AIError {
  // Handle known error structures
  if (error instanceof AIError) {
    return error;
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // OpenAI error patterns
    if (message.includes("rate limit") || message.includes("429")) {
      return new AIError("Rate limit exceeded", "RATE_LIMITED", {
        provider,
        originalError: error,
      });
    }
    if (message.includes("timeout") || message.includes("timed out")) {
      return new AIError("Request timed out", "TIMEOUT", {
        provider,
        originalError: error,
      });
    }
    if (
      message.includes("context length") ||
      message.includes("maximum context") ||
      message.includes("too long")
    ) {
      return new AIError("Context length exceeded", "CONTEXT_LENGTH_EXCEEDED", {
        provider,
        originalError: error,
      });
    }
    if (message.includes("content") && message.includes("filter")) {
      return new AIError("Content filtered", "CONTENT_FILTERED", {
        provider,
        originalError: error,
      });
    }
    if (
      message.includes("unauthorized") ||
      message.includes("invalid api key") ||
      message.includes("401")
    ) {
      return new AIError("Unauthorized", "UNAUTHORIZED", {
        provider,
        originalError: error,
      });
    }
    if (
      message.includes("quota") ||
      message.includes("insufficient") ||
      message.includes("billing")
    ) {
      return new AIError("Insufficient quota", "INSUFFICIENT_QUOTA", {
        provider,
        originalError: error,
      });
    }

    // Generic provider error
    return new AIError(`Provider error: ${error.message}`, "PROVIDER_ERROR", {
      provider,
      originalError: error,
    });
  }

  // Unknown error type
  return new AIError("Unknown error occurred", "UNKNOWN_ERROR", {
    provider,
    originalError: error,
  });
}

/**
 * Capture AI error to Sentry with context
 */
export function captureAIError(
  error: AIError,
  context?: {
    userId?: string;
    requestId?: string;
    model?: string;
  }
): void {
  // Don't report certain expected errors
  if (error.code === "RATE_LIMITED" || error.code === "CONTENT_FILTERED") {
    return;
  }

  Sentry.captureException(error.originalError || error, {
    tags: {
      type: "ai_error",
      ai_provider: error.provider || "unknown",
      ai_error_code: error.code,
    },
    user: context?.userId ? { id: context.userId } : undefined,
    contexts: {
      ai: {
        provider: error.provider,
        code: error.code,
        retryable: error.retryable,
        model: context?.model,
        requestId: context?.requestId,
      },
    },
  });
}
