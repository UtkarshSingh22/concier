// 🔒 CORE SYSTEM — DO NOT MODIFY
// Main entry point for AI operations.
// Provides a unified interface for all AI providers.

import {
  AIProvider,
  AIProviderInterface,
  AIGenerateRequest,
  AIGenerateResponse,
  AIStreamChunk,
  AI_LIMITS,
} from "./ai-types";
import { AIError, captureAIError } from "./ai-errors";
import { openaiProvider } from "./providers/openai";
import { anthropicProvider } from "./providers/anthropic";
import { geminiProvider } from "./providers/gemini";
import { trackAIUsage } from "./ai-usage";
import { checkAIRateLimit } from "./ai-rate-limit";

/**
 * Get the default provider based on configuration
 */
function getDefaultProvider(): AIProvider {
  // Prefer OpenAI if configured, otherwise Anthropic, then Gemini
  if (openaiProvider.isAvailable()) {
    return "openai";
  }
  if (anthropicProvider.isAvailable()) {
    return "anthropic";
  }
  if (geminiProvider.isAvailable()) {
    return "gemini";
  }
  throw new AIError(
    "No AI provider configured. Set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY.",
    "PROVIDER_NOT_CONFIGURED"
  );
}

/**
 * Get provider instance by name
 */
function getProvider(name: AIProvider) {
  switch (name) {
    case "openai":
      return openaiProvider;
    case "anthropic":
      return anthropicProvider;
    case "gemini":
      return geminiProvider;
    default:
      throw new AIError(`Unknown provider: ${name}`, "INVALID_REQUEST");
  }
}

/**
 * Validate request parameters
 */
function validateRequest(request: AIGenerateRequest): void {
  if (!request.prompt || request.prompt.trim().length === 0) {
    throw new AIError("Prompt is required", "INVALID_REQUEST");
  }

  if (request.prompt.length > AI_LIMITS.MAX_PROMPT_LENGTH) {
    throw new AIError(
      `Prompt exceeds maximum length of ${AI_LIMITS.MAX_PROMPT_LENGTH} characters`,
      "CONTEXT_LENGTH_EXCEEDED"
    );
  }

  if (
    request.maxTokens &&
    request.maxTokens > AI_LIMITS.MAX_TOKENS_PER_REQUEST
  ) {
    throw new AIError(
      `maxTokens exceeds limit of ${AI_LIMITS.MAX_TOKENS_PER_REQUEST}`,
      "INVALID_REQUEST"
    );
  }

  if (
    request.temperature !== undefined &&
    (request.temperature < 0 || request.temperature > 2)
  ) {
    throw new AIError("Temperature must be between 0 and 2", "INVALID_REQUEST");
  }
}

/**
 * Generate text using AI
 *
 * @param request - The generation request
 * @param options - Additional options for tracking and rate limiting
 * @returns The generated response
 *
 * @example
 * const response = await aiClient.generate({
 *   prompt: "Explain quantum computing in simple terms",
 *   provider: "openai",
 *   maxTokens: 500,
 * }, { userId: user.id });
 */
export async function generate(
  request: AIGenerateRequest,
  options?: {
    userId?: string;
    skipRateLimit?: boolean;
    skipUsageTracking?: boolean;
  }
): Promise<AIGenerateResponse> {
  // Validate request
  validateRequest(request);

  // Determine provider
  const providerName = request.provider || getDefaultProvider();
  const provider = getProvider(providerName);

  // Check if provider is available
  if (!provider.isAvailable()) {
    throw new AIError(
      `Provider ${providerName} is not configured`,
      "PROVIDER_NOT_CONFIGURED",
      { provider: providerName }
    );
  }

  // Check rate limit
  if (!options?.skipRateLimit && options?.userId) {
    const rateLimitResult = checkAIRateLimit(options.userId);
    if (!rateLimitResult.allowed) {
      throw new AIError(
        "AI rate limit exceeded. Please wait before making more requests.",
        "RATE_LIMITED",
        { provider: providerName }
      );
    }
  }

  try {
    // Call provider
    const response = await provider.generate(request);

    // Track usage
    if (!options?.skipUsageTracking && options?.userId) {
      await trackAIUsage({
        userId: options.userId,
        provider: response.provider,
        model: response.model,
        promptTokens: response.usage.promptTokens,
        completionTokens: response.usage.completionTokens,
      }).catch((error) => {
        // Don't fail the request if usage tracking fails
        console.error("Failed to track AI usage:", error);
      });
    }

    return response;
  } catch (error) {
    if (error instanceof AIError) {
      captureAIError(error, {
        userId: options?.userId,
        model: request.model,
      });
      throw error;
    }
    throw error;
  }
}

/**
 * Generate text with streaming
 *
 * @param request - The generation request
 * @param options - Additional options for tracking and rate limiting
 * @returns Async iterable of stream chunks
 *
 * @example
 * const stream = aiClient.generateStream({
 *   prompt: "Write a story",
 *   provider: "anthropic",
 * }, { userId: user.id });
 *
 * for await (const chunk of stream) {
 *   process.stdout.write(chunk.content);
 * }
 */
export async function* generateStream(
  request: AIGenerateRequest,
  options?: {
    userId?: string;
    skipRateLimit?: boolean;
    skipUsageTracking?: boolean;
  }
): AsyncIterable<AIStreamChunk> {
  // Validate request
  validateRequest(request);

  // Determine provider
  const providerName = request.provider || getDefaultProvider();
  const provider = getProvider(providerName);

  // Check if provider is available
  if (!provider.isAvailable()) {
    throw new AIError(
      `Provider ${providerName} is not configured`,
      "PROVIDER_NOT_CONFIGURED",
      { provider: providerName }
    );
  }

  // Check if streaming is supported (cast to interface for optional method access)
  const streamFn = (provider as AIProviderInterface).generateStream;
  if (!streamFn) {
    throw new AIError(
      `Provider ${providerName} does not support streaming`,
      "INVALID_REQUEST",
      { provider: providerName }
    );
  }

  // Check rate limit
  if (!options?.skipRateLimit && options?.userId) {
    const rateLimitResult = checkAIRateLimit(options.userId);
    if (!rateLimitResult.allowed) {
      throw new AIError(
        "AI rate limit exceeded. Please wait before making more requests.",
        "RATE_LIMITED",
        { provider: providerName }
      );
    }
  }

  try {
    let finalUsage: AIStreamChunk["usage"] | undefined;

    for await (const chunk of streamFn.call(provider, request)) {
      if (chunk.usage) {
        finalUsage = chunk.usage;
      }
      yield chunk;
    }

    // Track usage after stream completes
    if (!options?.skipUsageTracking && options?.userId && finalUsage) {
      await trackAIUsage({
        userId: options.userId,
        provider: providerName,
        model: request.model || "unknown",
        promptTokens: finalUsage.promptTokens,
        completionTokens: finalUsage.completionTokens,
      }).catch((error) => {
        console.error("Failed to track AI usage:", error);
      });
    }
  } catch (error) {
    if (error instanceof AIError) {
      captureAIError(error, {
        userId: options?.userId,
        model: request.model,
      });
      throw error;
    }
    throw error;
  }
}

/**
 * Check which providers are available
 */
export function getAvailableProviders(): AIProvider[] {
  const available: AIProvider[] = [];
  if (openaiProvider.isAvailable()) {
    available.push("openai");
  }
  if (anthropicProvider.isAvailable()) {
    available.push("anthropic");
  }
  if (geminiProvider.isAvailable()) {
    available.push("gemini");
  }
  return available;
}

/**
 * Check if any AI provider is configured
 */
export function isAIConfigured(): boolean {
  return getAvailableProviders().length > 0;
}

// Export as namespace for cleaner imports
export const aiClient = {
  generate,
  generateStream,
  getAvailableProviders,
  isAIConfigured,
};
