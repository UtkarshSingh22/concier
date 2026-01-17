// 🔒 CORE SYSTEM — DO NOT MODIFY
// AI module exports.
// This is the main entry point for the AI infrastructure.

// Main client
export {
  aiClient,
  generate,
  generateStream,
  getAvailableProviders,
  isAIConfigured,
} from "./ai-client";

// Types
export type {
  AIProvider,
  AIGenerateRequest,
  AIGenerateResponse,
  AIStreamChunk,
  AITokenUsage,
} from "./ai-types";
export { AI_LIMITS } from "./ai-types";

// Errors
export { AIError, captureAIError } from "./ai-errors";
export type { AIErrorCode } from "./ai-errors";

// Usage tracking
export {
  trackAIUsage,
  getUserAIUsage,
  getUserDailyTokens,
  getRecentAIUsage,
} from "./ai-usage";

// Rate limiting
export {
  checkAIRateLimit,
  getAIRateLimitStatus,
  resetAIRateLimit,
  AI_RATE_LIMITS,
} from "./ai-rate-limit";
