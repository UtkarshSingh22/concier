// 🔒 CORE SYSTEM — DO NOT MODIFY
// OpenAI provider implementation.
// Handles all OpenAI API interactions.

import {
  AIProviderInterface,
  AIGenerateRequest,
  AIGenerateResponse,
  AIStreamChunk,
  AIProviderConfig,
  AI_LIMITS,
} from "../ai-types";
import { AIError, normalizeProviderError } from "../ai-errors";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

/**
 * Default configuration for OpenAI
 */
const DEFAULT_CONFIG: Omit<AIProviderConfig, "apiKey"> = {
  defaultModel: "gpt-4o-mini",
  defaultMaxTokens: 1024,
  defaultTemperature: 0.7,
  timeoutMs: AI_LIMITS.DEFAULT_TIMEOUT_MS,
};

/**
 * OpenAI provider implementation
 */
class OpenAIProvider implements AIProviderInterface {
  readonly name = "openai" as const;
  private config: AIProviderConfig | null = null;

  constructor() {
    this.initializeConfig();
  }

  private initializeConfig(): void {
    const apiKey = process.env.OPENAI_API_KEY;
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
        "OpenAI API key not configured",
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

      const messages: Array<{ role: string; content: string }> = [];

      if (request.systemPrompt) {
        messages.push({ role: "system", content: request.systemPrompt });
      }
      messages.push({ role: "user", content: request.prompt });

      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: request.temperature ?? config.defaultTemperature,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
      }

      const data = await response.json();

      return {
        content: data.choices[0]?.message?.content || "",
        provider: this.name,
        model,
        usage: {
          promptTokens: data.usage?.prompt_tokens || 0,
          completionTokens: data.usage?.completion_tokens || 0,
          totalTokens: data.usage?.total_tokens || 0,
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

      const messages: Array<{ role: string; content: string }> = [];

      if (request.systemPrompt) {
        messages.push({ role: "system", content: request.systemPrompt });
      }
      messages.push({ role: "user", content: request.prompt });

      const response = await fetch(OPENAI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: request.temperature ?? config.defaultTemperature,
          stream: true,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              yield { content: "", done: true };
              return;
            }

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || "";
              if (content) {
                yield { content, done: false };
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
export const openaiProvider = new OpenAIProvider();
