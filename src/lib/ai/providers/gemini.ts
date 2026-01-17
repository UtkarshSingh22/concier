// 🔒 CORE SYSTEM — DO NOT MODIFY
// Google Gemini provider implementation.
// Handles all Google Generative AI API interactions.

import {
  AIProviderInterface,
  AIGenerateRequest,
  AIGenerateResponse,
  AIProviderConfig,
  AI_LIMITS,
} from "../ai-types";
import { AIError, normalizeProviderError } from "../ai-errors";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models";

/**
 * Default configuration for Gemini
 */
const DEFAULT_CONFIG: Omit<AIProviderConfig, "apiKey"> = {
  defaultModel: "gemini-2.0-flash",
  defaultMaxTokens: 1024,
  defaultTemperature: 0.7,
  timeoutMs: AI_LIMITS.DEFAULT_TIMEOUT_MS,
};

/**
 * Estimate token count from text (rough approximation)
 * Gemini doesn't always return token counts, so we estimate
 */
function estimateTokens(text: string): number {
  // Rough estimate: ~4 characters per token for English
  return Math.ceil(text.length / 4);
}

/**
 * Google Gemini provider implementation
 */
class GeminiProvider implements AIProviderInterface {
  readonly name = "gemini" as const;
  private config: AIProviderConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig(): void {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      this.config = {
        apiKey,
        ...DEFAULT_CONFIG,
      };
    }
  }

  isAvailable(): boolean {
    return this.config !== null && this.config.apiKey.length > 0;
  }

  private getConfig(): AIProviderConfig {
    if (!this.config) {
      throw new AIError(
        "Gemini API key not configured",
        "PROVIDER_NOT_CONFIGURED",
        { provider: this.name }
      );
    }
    return this.config;
  }

  async generate(request: AIGenerateRequest): Promise<AIGenerateResponse> {
    const config = this.getConfig();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const model = request.model || config.defaultModel;
      const maxTokens = Math.min(
        request.maxTokens || config.defaultMaxTokens,
        AI_LIMITS.MAX_TOKENS_PER_REQUEST
      );

      // Build the request body for Gemini
      const contents: Array<{ role: string; parts: Array<{ text: string }> }> =
        [];

      // Add system instruction if provided (Gemini handles this differently)
      const systemInstruction = request.systemPrompt
        ? { parts: [{ text: request.systemPrompt }] }
        : undefined;

      // Add user message
      contents.push({
        role: "user",
        parts: [{ text: request.prompt }],
      });

      const url = `${GEMINI_API_URL}/${model}:generateContent?key=${config.apiKey}`;

      // Build request body (only include systemInstruction if provided)
      const requestBody: Record<string, unknown> = {
        contents,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: request.temperature ?? config.defaultTemperature,
        },
      };

      if (systemInstruction) {
        requestBody.systemInstruction = systemInstruction;
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();

        // Handle rate limiting (429)
        if (response.status === 429) {
          throw new AIError(
            "Gemini rate limit exceeded. Please wait and try again.",
            "RATE_LIMITED",
            { provider: this.name }
          );
        }

        throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
      }

      const data = await response.json();

      // Check for blocked content
      if (data.promptFeedback?.blockReason) {
        throw new AIError(
          `Content blocked: ${data.promptFeedback.blockReason}`,
          "CONTENT_FILTERED",
          { provider: this.name }
        );
      }

      // Extract content from response
      const candidate = data.candidates?.[0];
      if (!candidate) {
        throw new AIError("No response generated", "PROVIDER_ERROR", {
          provider: this.name,
        });
      }

      // Check for finish reason issues
      if (candidate.finishReason === "SAFETY") {
        throw new AIError(
          "Response blocked by safety filters",
          "CONTENT_FILTERED",
          { provider: this.name }
        );
      }

      const content =
        candidate.content?.parts
          ?.map((part: { text?: string }) => part.text || "")
          .join("") || "";

      // Get token usage from response metadata or estimate
      const usageMetadata = data.usageMetadata;
      const promptTokens =
        usageMetadata?.promptTokenCount || estimateTokens(request.prompt);
      const completionTokens =
        usageMetadata?.candidatesTokenCount || estimateTokens(content);

      return {
        content,
        provider: this.name,
        model,
        usage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        responseId: undefined, // Gemini doesn't provide response IDs in the same way
      };
    } catch (error) {
      // Log error details in development
      if (process.env.NODE_ENV === "development") {
        console.error("[Gemini Provider Error]:", error);
      }

      if (error instanceof AIError) {
        throw error;
      }
      if (error instanceof Error && error.name === "AbortError") {
        throw new AIError("Request timed out", "TIMEOUT", {
          provider: this.name,
          originalError: error,
        });
      }
      throw normalizeProviderError(error, this.name);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Note: Streaming not implemented for Gemini in this version
  // Can be added later following the same pattern as OpenAI/Anthropic
}

// Export singleton instance
export const geminiProvider = new GeminiProvider();
