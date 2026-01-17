// 🔒 CORE SYSTEM — DO NOT MODIFY
// AI usage tracking for monitoring and analytics.
// Stores usage data for cost tracking and rate limiting decisions.

import { db } from "@/lib/db";
import type { AIProvider } from "./ai-types";

/**
 * Usage record to track
 */
export interface AIUsageRecord {
  userId: string;
  provider: AIProvider;
  model: string;
  promptTokens: number;
  completionTokens: number;
}

/**
 * Track AI usage in the database
 *
 * @param record - Usage record to store
 */
export async function trackAIUsage(record: AIUsageRecord): Promise<void> {
  try {
    await db.aiUsage.create({
      data: {
        userId: record.userId,
        provider: record.provider,
        model: record.model,
        promptTokens: record.promptTokens,
        completionTokens: record.completionTokens,
        totalTokens: record.promptTokens + record.completionTokens,
      },
    });
  } catch (error) {
    // Log but don't throw - usage tracking shouldn't break the main flow
    console.error("Failed to track AI usage:", error);
  }
}

/**
 * Get user's AI usage for a time period
 *
 * @param userId - User ID
 * @param since - Start date for the period
 * @returns Aggregated usage statistics
 */
export async function getUserAIUsage(
  userId: string,
  since: Date
): Promise<{
  totalRequests: number;
  totalTokens: number;
  promptTokens: number;
  completionTokens: number;
  byProvider: Record<string, { requests: number; tokens: number }>;
}> {
  const usage = await db.aiUsage.findMany({
    where: {
      userId,
      createdAt: {
        gte: since,
      },
    },
  });

  const byProvider: Record<string, { requests: number; tokens: number }> = {};
  let totalTokens = 0;
  let promptTokens = 0;
  let completionTokens = 0;

  for (const record of usage) {
    totalTokens += record.totalTokens;
    promptTokens += record.promptTokens;
    completionTokens += record.completionTokens;

    if (!byProvider[record.provider]) {
      byProvider[record.provider] = { requests: 0, tokens: 0 };
    }
    byProvider[record.provider].requests++;
    byProvider[record.provider].tokens += record.totalTokens;
  }

  return {
    totalRequests: usage.length,
    totalTokens,
    promptTokens,
    completionTokens,
    byProvider,
  };
}

/**
 * Get user's daily token usage for the current day
 *
 * @param userId - User ID
 * @returns Total tokens used today
 */
export async function getUserDailyTokens(userId: string): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await db.aiUsage.aggregate({
    where: {
      userId,
      createdAt: {
        gte: today,
      },
    },
    _sum: {
      totalTokens: true,
    },
  });

  return result._sum.totalTokens || 0;
}

/**
 * Get recent AI usage records for a user
 *
 * @param userId - User ID
 * @param limit - Maximum records to return
 * @returns Recent usage records
 */
export async function getRecentAIUsage(
  userId: string,
  limit: number = 50
): Promise<
  Array<{
    id: string;
    provider: string;
    model: string;
    totalTokens: number;
    createdAt: Date;
  }>
> {
  return await db.aiUsage.findMany({
    where: { userId },
    select: {
      id: true,
      provider: true,
      model: true,
      totalTokens: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}
