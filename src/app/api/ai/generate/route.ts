// 🏗️ USER EDITABLE — EXAMPLE AI API ROUTE
// This is a demonstration of how to use the AI infrastructure.
// Copy and modify this route for your own AI features.
//
// Key patterns demonstrated:
// - Session authentication
// - Entitlement checking (ai_access)
// - Rate limiting
// - Usage tracking
// - Error handling

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiClient, AIError, isAIConfigured } from "@/lib/ai";
import { withErrorHandler, createErrorResponse } from "@/lib/error-handler";

/**
 * Request body schema
 */
interface GenerateRequest {
  prompt: string;
  provider?: "openai" | "anthropic" | "gemini";
  maxTokens?: number;
}

/**
 * Validate request body
 */
function validateRequest(body: unknown): GenerateRequest {
  if (!body || typeof body !== "object") {
    throw new Error("Invalid request body");
  }

  const data = body as Record<string, unknown>;

  if (!data.prompt || typeof data.prompt !== "string") {
    throw new Error("prompt is required and must be a string");
  }

  if (data.prompt.trim().length === 0) {
    throw new Error("prompt cannot be empty");
  }

  if (data.prompt.length > 10000) {
    throw new Error("prompt exceeds maximum length of 10000 characters");
  }

  if (
    data.provider &&
    !["openai", "anthropic", "gemini"].includes(data.provider as string)
  ) {
    throw new Error("provider must be 'openai', 'anthropic', or 'gemini'");
  }

  if (data.maxTokens !== undefined) {
    if (
      typeof data.maxTokens !== "number" ||
      data.maxTokens < 1 ||
      data.maxTokens > 4096
    ) {
      throw new Error("maxTokens must be a number between 1 and 4096");
    }
  }

  return {
    prompt: data.prompt.trim(),
    provider: data.provider as "openai" | "anthropic" | "gemini" | undefined,
    maxTokens: data.maxTokens as number | undefined,
  };
}

/**
 * Check if user has ai_access entitlement
 */
async function checkAIEntitlement(userId: string): Promise<boolean> {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { status: "active" },
        include: {
          plan: {
            include: {
              entitlements: {
                include: {
                  entitlement: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) return false;

  return user.subscriptions.some((sub) =>
    sub.plan.entitlements.some((pe) => pe.entitlement.name === "ai_access")
  );
}

/**
 * POST /api/ai/generate
 *
 * Generate text using AI. Requires authentication and ai_access entitlement.
 *
 * Request body:
 * - prompt: string (required) - The prompt to send to the AI
 * - provider: "openai" | "anthropic" | "gemini" (optional) - Which provider to use
 * - maxTokens: number (optional) - Maximum tokens to generate (1-4096)
 *
 * Response:
 * - content: string - The generated text
 * - provider: string - Which provider was used
 * - model: string - Which model was used
 * - usage: { promptTokens, completionTokens, totalTokens }
 */
export async function POST(request: NextRequest) {
  return withErrorHandler(
    async () => {
      // 1. Check if AI is configured
      if (!isAIConfigured()) {
        return createErrorResponse(
          "AI service is not configured",
          503,
          "AI_NOT_CONFIGURED"
        );
      }

      // 2. Authenticate user
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return createErrorResponse(
          "Authentication required",
          401,
          "UNAUTHORIZED"
        );
      }

      // Get user from database
      const user = await db.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return createErrorResponse("User not found", 404, "USER_NOT_FOUND");
      }

      const userId = user.id;

      // 3. Check entitlement
      const hasAccess = await checkAIEntitlement(userId);
      if (!hasAccess) {
        return createErrorResponse(
          "AI access requires a Pro subscription",
          403,
          "ENTITLEMENT_REQUIRED"
        );
      }

      // 4. Parse and validate request
      let body: GenerateRequest;
      try {
        const rawBody = await request.json();
        body = validateRequest(rawBody);
      } catch (error) {
        return createErrorResponse(
          error instanceof Error ? error.message : "Invalid request",
          400,
          "INVALID_REQUEST"
        );
      }

      // 5. Generate response
      try {
        const response = await aiClient.generate(
          {
            prompt: body.prompt,
            provider: body.provider,
            maxTokens: body.maxTokens,
          },
          { userId }
        );

        return NextResponse.json({
          content: response.content,
          provider: response.provider,
          model: response.model,
          usage: response.usage,
        });
      } catch (error) {
        if (error instanceof AIError) {
          return createErrorResponse(
            error.toClientMessage(),
            error.statusCode,
            error.code
          );
        }
        throw error;
      }
    },
    { context: "ai-generate" }
  );
}
