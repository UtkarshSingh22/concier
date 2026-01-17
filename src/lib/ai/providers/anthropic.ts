// 🔒 CORE SYSTEM — DO NOT MODIFY
// Anthropic provider implementation.
// Handles all Anthropic Claude API interactions.

import {
  AIProviderInterface,
  AIGenerateRequest,
  AIGenerateResponse,
  AIStreamChunk,
  AIProviderConfig,
  AI_LIMITS,
} from "../ai-types";
import { AIError, normalizeProviderError } from "../ai-errors";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

/**
 * Default configuration for Anthropic
 */
const DEFAULT_CONFIG: Omit<AIProviderConfig, "apiKey"> = {
  defaultModel: "claude-3-5-sonnet-20241022",
  defaultMaxTokens: 1024,
  defaultTemperature: 0.7,
  timeoutMs: AI_LIMITS.DEFAULT_TIMEOUT_MS,
};

/**
 * Anthropic provider implementation
 */
class AnthropicProvider implements AIProviderInterface {
  readonly name = "anthropic" as const;
  private config: AIProviderConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig(): void {
    const apiKey = process.env.ANTHROPIC_API_KEY;
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
        "Anthropic API key not configured",
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

      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          system: request.systemPrompt,
          messages: [{ role: "user", content: request.prompt }],
          temperature: request.temperature ?? config.defaultTemperature,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Anthropic API error (${response.status}): ${errorBody}`
        );
      }

      const data = await response.json();

      // Extract text from content blocks
      const content =
        data.content
          ?.filter((block: { type: string }) => block.type === "text")
          .map((block: { text: string }) => block.text)
          .join("") || "";

      return {
        content,
        provider: this.name,
        model,
        usage: {
          promptTokens: data.usage?.input_tokens || 0,
          completionTokens: data.usage?.output_tokens || 0,
          totalTokens:
            (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
        },
        responseId: data.id,
      };
    } catch (error) {
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

  async *generateStream(
    request: AIGenerateRequest
  ): AsyncIterable<AIStreamChunk> {
    const config = this.getConfig();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeoutMs);

    try {
      const model = request.model || config.defaultModel;
      const maxTokens = Math.min(
        request.maxTokens || config.defaultMaxTokens,
        AI_LIMITS.MAX_TOKENS_PER_REQUEST
      );

      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": config.apiKey,
          "anthropic-version": ANTHROPIC_VERSION,
        },
        body: JSON.stringify({
          model,
          max_tokens: maxTokens,
          system: request.systemPrompt,
          messages: [{ role: "user", content: request.prompt }],
          temperature: request.temperature ?? config.defaultTemperature,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Anthropic API error (${response.status}): ${errorBody}`
        );
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let totalInputTokens = 0;
      let totalOutputTokens = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);

            try {
              const parsed = JSON.parse(data);

              // Handle different event types
              if (parsed.type === "content_block_delta") {
                const content = parsed.delta?.text || "";
                if (content) {
                  yield { content, done: false };
                }
              } else if (parsed.type === "message_delta") {
                // Final usage stats
                if (parsed.usage) {
                  totalOutputTokens = parsed.usage.output_tokens || 0;
                }
              } else if (parsed.type === "message_start") {
                // Initial usage stats
                if (parsed.message?.usage) {
                  totalInputTokens = parsed.message.usage.input_tokens || 0;
                }
              } else if (parsed.type === "message_stop") {
                yield {
                  content: "",
                  done: true,
                  usage: {
                    promptTokens: totalInputTokens,
                    completionTokens: totalOutputTokens,
                    totalTokens: totalInputTokens + totalOutputTokens,
                  },
                };
                return;
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      yield { content: "", done: true };
    } catch (error) {
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
}

// Export singleton instance
export const anthropicProvider = new AnthropicProvider();
