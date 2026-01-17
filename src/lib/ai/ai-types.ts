// 🔒 CORE SYSTEM — DO NOT MODIFY
// Type definitions for the AI infrastructure.
// Provides a common interface for all AI providers.

/**
 * Supported AI providers
 */
export type AIProvider = "openai" | "anthropic" | "gemini";

/**
 * Common request format for text generation
 */
export interface AIGenerateRequest {
  /** The prompt or messages to send to the AI */
  prompt: string;
  /** Optional system message for context */
  systemPrompt?: string;
  /** Which provider to use */
  provider?: AIProvider;
  /** Model override (uses provider default if not specified) */
  model?: string;
  /** Maximum tokens to generate */
  maxTokens?: number;
  /** Temperature for randomness (0-1) */
  temperature?: number;
  /** Enable streaming response */
  stream?: boolean;
}

/**
 * Token usage information
 */
export interface AITokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

/**
 * Common response format for text generation
 */
export interface AIGenerateResponse {
  /** The generated text content */
  content: string;
  /** Which provider was used */
  provider: AIProvider;
  /** Which model was used */
  model: string;
  /** Token usage statistics */
  usage: AITokenUsage;
  /** Response ID from provider (if available) */
  responseId?: string;
}

/**
 * Streaming chunk format
 */
export interface AIStreamChunk {
  /** Partial content */
  content: string;
  /** Is this the final chunk? */
  done: boolean;
  /** Token usage (only available on final chunk) */
  usage?: AITokenUsage;
}

/**
 * Provider-specific configuration
 */
export interface AIProviderConfig {
  apiKey: string;
  defaultModel: string;
  defaultMaxTokens: number;
  defaultTemperature: number;
  timeoutMs: number;
}

/**
 * Internal provider interface
 * Implemented by each provider (OpenAI, Anthropic, etc.)
 */
export interface AIProviderInterface {
  readonly name: AIProvider;

  /**
   * Generate text from a prompt
   */
  generate(request: AIGenerateRequest): Promise<AIGenerateResponse>;

  /**
   * Generate text with streaming (returns async iterable)
   */
  generateStream?(request: AIGenerateRequest): AsyncIterable<AIStreamChunk>;

  /**
   * Check if the provider is configured and available
   */
  isAvailable(): boolean;
}

/**
 * Configuration limits for safety
 */
export const AI_LIMITS = {
  /** Maximum tokens per single request */
  MAX_TOKENS_PER_REQUEST: 4096,
  /** Default timeout for AI calls (30 seconds) */
  DEFAULT_TIMEOUT_MS: 30000,
  /** Maximum prompt length in characters */
  MAX_PROMPT_LENGTH: 100000,
} as const;
