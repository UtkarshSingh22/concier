// 🔒 CORE SYSTEM — DO NOT MODIFY
// Rate limiting for AI operations.
// Prevents abuse and controls costs.

/**
 * Rate limit configuration
 */
export const AI_RATE_LIMITS = {
  /** Maximum requests per minute per user */
  REQUESTS_PER_MINUTE: 10,
  /** Maximum requests per hour per user */
  REQUESTS_PER_HOUR: 60,
  /** Rate limit window in milliseconds (1 minute) */
  WINDOW_MS: 60 * 1000,
} as const;

/**
 * In-memory rate limit store
 * Note: For production with multiple instances, use Redis or similar
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Clean up expired entries periodically
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore.entries()) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupExpiredEntries, 5 * 60 * 1000);

/**
 * Check if a user is within rate limits
 *
 * @param userId - User identifier
 * @returns Object with allowed status and reset time
 */
export function checkAIRateLimit(userId: string): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const key = `ai:${userId}`;
  const limit = rateLimitStore.get(key);

  if (!limit || now > limit.resetTime) {
    // First request or window expired
    const resetTime = now + AI_RATE_LIMITS.WINDOW_MS;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: AI_RATE_LIMITS.REQUESTS_PER_MINUTE - 1,
      resetTime,
    };
  }

  if (limit.count >= AI_RATE_LIMITS.REQUESTS_PER_MINUTE) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: limit.resetTime,
    };
  }

  // Increment count
  limit.count++;
  return {
    allowed: true,
    remaining: AI_RATE_LIMITS.REQUESTS_PER_MINUTE - limit.count,
    resetTime: limit.resetTime,
  };
}

/**
 * Get current rate limit status for a user
 *
 * @param userId - User identifier
 * @returns Current rate limit status
 */
export function getAIRateLimitStatus(userId: string): {
  used: number;
  limit: number;
  remaining: number;
  resetTime: number | null;
} {
  const key = `ai:${userId}`;
  const limit = rateLimitStore.get(key);
  const now = Date.now();

  if (!limit || now > limit.resetTime) {
    return {
      used: 0,
      limit: AI_RATE_LIMITS.REQUESTS_PER_MINUTE,
      remaining: AI_RATE_LIMITS.REQUESTS_PER_MINUTE,
      resetTime: null,
    };
  }

  return {
    used: limit.count,
    limit: AI_RATE_LIMITS.REQUESTS_PER_MINUTE,
    remaining: Math.max(0, AI_RATE_LIMITS.REQUESTS_PER_MINUTE - limit.count),
    resetTime: limit.resetTime,
  };
}

/**
 * Reset rate limit for a user (admin function)
 *
 * @param userId - User identifier
 */
export function resetAIRateLimit(userId: string): void {
  const key = `ai:${userId}`;
  rateLimitStore.delete(key);
}
