// 🔒 CORE SYSTEM — DO NOT MODIFY
// Razorpay webhook event handlers.
// Processes Razorpay events to sync subscriptions and entitlements.

import { db } from "@/lib/db";
import { getRazorpayClient } from "@/lib/payments/razorpay";
import { logger } from "@/lib/logger";
import type { SubscriptionStatus } from "@prisma/client";

/**
 * Razorpay subscription payload from webhook
 */
export interface RazorpaySubscriptionPayload {
  subscription: {
    entity: {
      id: string;
      plan_id: string;
      customer_id: string;
      status: string;
      current_start: number;
      current_end: number;
      ended_at: number | null;
      notes: {
        userId?: string;
        userEmail?: string;
        planName?: string;
      };
    };
  };
}

/**
 * Razorpay payment payload from webhook
 */
export interface RazorpayPaymentPayload {
  payment: {
    entity: {
      id: string;
      subscription_id: string;
      status: string;
      error_code?: string;
      error_description?: string;
    };
  };
}

/**
 * Map Razorpay status to our SubscriptionStatus enum
 */
function mapStatus(status: string): SubscriptionStatus {
  const statusMap: Record<string, SubscriptionStatus> = {
    created: "incomplete",
    authenticated: "incomplete",
    active: "active",
    pending: "past_due",
    halted: "past_due",
    cancelled: "canceled",
    completed: "canceled",
    expired: "canceled",
    paused: "paused",
  };
  return statusMap[status] || "active";
}

/**
 * Update subscription in database from Razorpay subscription data
 */
async function upsertSubscription(
  subscription: RazorpaySubscriptionPayload["subscription"]["entity"]
): Promise<void> {
  const userId = subscription.notes?.userId;

  if (!userId) {
    // Try to find existing subscription by provider ID
    const existing = await db.subscription.findFirst({
      where: {
        providerSubscriptionId: subscription.id,
        provider: "razorpay",
      },
    });

    if (!existing) {
      logger.warn("Razorpay subscription missing userId in notes", {
        context: "razorpay-webhook",
        metadata: { subscriptionId: subscription.id },
      });
      return;
    }

    // Update existing subscription
    await db.subscription.update({
      where: { id: existing.id },
      data: {
        status: mapStatus(subscription.status),
        currentPeriodStart: subscription.current_start
          ? new Date(subscription.current_start * 1000)
          : undefined,
        currentPeriodEnd: subscription.current_end
          ? new Date(subscription.current_end * 1000)
          : undefined,
        cancelAtPeriodEnd:
          subscription.status === "cancelled" || subscription.ended_at !== null,
        providerCustomerId: subscription.customer_id,
      },
    });

    logger.info("Subscription updated", {
      context: "razorpay-webhook",
      metadata: {
        subscriptionId: subscription.id,
        status: subscription.status,
      },
    });
    return;
  }

  // Get plan from Razorpay plan ID
  const plan = await db.plan.findFirst({
    where: { razorpayPlanId: subscription.plan_id },
  });

  if (!plan) {
    throw new Error(
      `Plan not found for Razorpay plan: ${subscription.plan_id}`
    );
  }

  await db.subscription.upsert({
    where: {
      providerSubscriptionId: subscription.id,
    },
    update: {
      status: mapStatus(subscription.status),
      currentPeriodStart: subscription.current_start
        ? new Date(subscription.current_start * 1000)
        : undefined,
      currentPeriodEnd: subscription.current_end
        ? new Date(subscription.current_end * 1000)
        : undefined,
      cancelAtPeriodEnd:
        subscription.status === "cancelled" || subscription.ended_at !== null,
      providerCustomerId: subscription.customer_id,
    },
    create: {
      userId,
      planId: plan.id,
      provider: "razorpay",
      providerSubscriptionId: subscription.id,
      providerCustomerId: subscription.customer_id,
      status: mapStatus(subscription.status),
      currentPeriodStart: subscription.current_start
        ? new Date(subscription.current_start * 1000)
        : new Date(),
      currentPeriodEnd: subscription.current_end
        ? new Date(subscription.current_end * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancelAtPeriodEnd: false,
    },
  });

  logger.info("Subscription synced", {
    context: "razorpay-webhook",
    metadata: {
      userId,
      subscriptionId: subscription.id,
      status: subscription.status,
    },
  });
}

/**
 * Handle subscription.activated event
 * Called when subscription becomes active (first payment succeeds)
 */
export async function handleSubscriptionActivated(
  payload: RazorpaySubscriptionPayload
): Promise<void> {
  await upsertSubscription(payload.subscription.entity);

  logger.info("Subscription activated", {
    context: "razorpay-webhook",
    metadata: { subscriptionId: payload.subscription.entity.id },
  });
}

/**
 * Handle subscription.charged event
 * Called when a subscription payment succeeds (including renewals)
 */
export async function handleSubscriptionCharged(
  payload: RazorpaySubscriptionPayload
): Promise<void> {
  // Fetch latest subscription details
  const razorpay = getRazorpayClient();
  const subscription = await razorpay.subscriptions.fetch(
    payload.subscription.entity.id
  );

  // Build entity with notes from original payload
  const entity = {
    ...subscription,
    notes: payload.subscription.entity.notes || subscription.notes || {},
  } as RazorpaySubscriptionPayload["subscription"]["entity"];

  await upsertSubscription(entity);

  logger.info("Subscription charged", {
    context: "razorpay-webhook",
    metadata: { subscriptionId: subscription.id },
  });
}

/**
 * Handle subscription.cancelled event
 * Called when subscription is canceled
 */
export async function handleSubscriptionCancelled(
  payload: RazorpaySubscriptionPayload
): Promise<void> {
  const subscriptionId = payload.subscription.entity.id;

  const dbSubscription = await db.subscription.findFirst({
    where: {
      providerSubscriptionId: subscriptionId,
      provider: "razorpay",
    },
  });

  if (!dbSubscription) {
    logger.warn("Subscription cancel for unknown subscription", {
      context: "razorpay-webhook",
      metadata: { subscriptionId },
    });
    return;
  }

  await db.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "canceled",
      cancelAtPeriodEnd: false,
    },
  });

  logger.info("Subscription cancelled", {
    context: "razorpay-webhook",
    metadata: { subscriptionId, userId: dbSubscription.userId },
  });
}

/**
 * Handle subscription.paused event
 */
export async function handleSubscriptionPaused(
  payload: RazorpaySubscriptionPayload
): Promise<void> {
  const subscriptionId = payload.subscription.entity.id;

  const dbSubscription = await db.subscription.findFirst({
    where: {
      providerSubscriptionId: subscriptionId,
      provider: "razorpay",
    },
  });

  if (!dbSubscription) {
    return;
  }

  await db.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "paused",
    },
  });

  logger.info("Subscription paused", {
    context: "razorpay-webhook",
    metadata: { subscriptionId },
  });
}

/**
 * Handle subscription.resumed event
 */
export async function handleSubscriptionResumed(
  payload: RazorpaySubscriptionPayload
): Promise<void> {
  await upsertSubscription(payload.subscription.entity);

  logger.info("Subscription resumed", {
    context: "razorpay-webhook",
    metadata: { subscriptionId: payload.subscription.entity.id },
  });
}

/**
 * Handle payment.failed event
 * Called when a subscription payment fails
 */
export async function handlePaymentFailed(
  payload: RazorpayPaymentPayload
): Promise<void> {
  const subscriptionId = payload.payment.entity.subscription_id;

  if (!subscriptionId) {
    return; // One-time payment failure
  }

  const dbSubscription = await db.subscription.findFirst({
    where: {
      providerSubscriptionId: subscriptionId,
      provider: "razorpay",
    },
  });

  if (!dbSubscription) {
    return;
  }

  await db.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "past_due",
    },
  });

  logger.warn("Payment failed", {
    context: "razorpay-webhook",
    metadata: {
      subscriptionId,
      paymentId: payload.payment.entity.id,
      error: payload.payment.entity.error_description,
    },
  });
}
