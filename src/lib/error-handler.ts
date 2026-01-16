// 🔒 CORE SYSTEM - DO NOT MODIFY
// Centralized error handling for API routes
// Standardizes error responses and Sentry integration

import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

/**
 * Standard API error response format
 */
export interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

/**
 * Wrap API route logic with error handling
 * Captures unexpected errors to Sentry and returns standardized responses
 *
 * @example
 * export async function POST(request: NextRequest) {
 *   return withErrorHandler(async () => {
 *     // Your logic here
 *     return NextResponse.json({ success: true });
 *   }, { context: "create-user" });
 * }
 */
export async function withErrorHandler(
  handler: () => Promise<NextResponse>,
  options?: {
    context?: string;
    tags?: Record<string, string>;
  }
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (error) {
    // Log to Sentry
    Sentry.captureException(error, {
      tags: {
        type: "api_error",
        context: options?.context || "unknown",
        ...options?.tags,
      },
    });

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(
        `[API Error${options?.context ? ` - ${options.context}` : ""}]:`,
        error
      );
    }

    // Return standardized error response
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";

    return NextResponse.json(
      {
        error: message,
        code: "INTERNAL_ERROR",
      } as ApiError,
      { status: 500 }
    );
  }
}

/**
 * Create a standardized error response
 * Use this for expected errors (validation, auth, etc.)
 */
export function createErrorResponse(
  message: string,
  status: number = 400,
  code?: string
): NextResponse {
  return NextResponse.json(
    {
      error: message,
      code: code || `HTTP_${status}`,
    } as ApiError,
    { status }
  );
}

/**
 * Capture error to Sentry without throwing
 * Useful for non-critical errors or background operations
 */
export function captureError(
  error: unknown,
  context?: string,
  tags?: Record<string, string>
): void {
  Sentry.captureException(error, {
    tags: {
      type: "background_error",
      context: context || "unknown",
      ...tags,
    },
  });

  if (process.env.NODE_ENV === "development") {
    console.error(
      `[Background Error${context ? ` - ${context}` : ""}]:`,
      error
    );
  }
}
