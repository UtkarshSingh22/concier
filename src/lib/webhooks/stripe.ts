// 🔒 CORE SYSTEM — DO NOT MODIFY
// Stripe webhook event handlers.
// Processes Stripe events to sync subscriptions and entitlements.

import Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripeClient } from "@/lib/payments/stripe";
import { logger } from "@/lib/logger";

/**
 * Update subscription in database from Stripe subscription data
 */
async function upsertSubscription(
  userId: string,
  subscription: Stripe.Subscription
): Promise<void> {
  // Get plan from Stripe price ID
  const priceId = subscription.items.data[0]?.price.id;
  const plan = await db.plan.findFirst({
    where: { stripePriceId: priceId },
  });

  if (!plan) {
    throw new Error(`Plan not found for Stripe price: ${priceId}`);
  }

  await db.subscription.upsert({
    where: {
      providerSubscriptionId: subscription.id,
    },
    update: {
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      providerCustomerId: subscription.customer as string,
    },
    create: {
      userId,
      planId: plan.id,
      provider: "stripe",
      providerSubscriptionId: subscription.id,
      providerCustomerId: subscription.customer as string,
      status: subscription.status as any,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  });

  logger.info(`Subscription synced: ${subscription.id}`, {
    context: "stripe-webhook",
    metadata: { userId, status: subscription.status },
  });
}

/**
 * Handle checkout.session.completed event
 * Called when a user completes the Stripe Checkout flow
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const userId = session.client_reference_id;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    logger.warn("Checkout session missing client_reference_id", {
      context: "stripe-webhook",
      metadata: { sessionId: session.id },
    });
    return;
  }

  if (!subscriptionId) {
    logger.warn("Checkout session missing subscription", {
      context: "stripe-webhook",
      metadata: { sessionId: session.id },
    });
    return;
  }

  // Fetch full subscription details
  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await upsertSubscription(userId, subscription);

  logger.info("Checkout completed", {
    context: "stripe-webhook",
    metadata: { userId, subscriptionId },
  });
}

/**
 * Handle invoice.paid event
 * Called when a subscription payment succeeds (including renewals)
 */
export async function handleInvoicePaid(
  invoice: Stripe.Invoice
): Promise<void> {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return; // One-time payment, not a subscription
  }

  // Find existing subscription in our database
  const dbSubscription = await db.subscription.findFirst({
    where: {
      providerSubscriptionId: subscriptionId,
      provider: "stripe",
    },
  });

  if (!dbSubscription) {
    logger.warn("Invoice paid for unknown subscription", {
      context: "stripe-webhook",
      metadata: { subscriptionId, invoiceId: invoice.id },
    });
    return;
  }

  // Fetch updated subscription from Stripe
  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  await upsertSubscription(dbSubscription.userId, subscription);

  logger.info("Invoice paid, subscription updated", {
    context: "stripe-webhook",
    metadata: { subscriptionId, invoiceId: invoice.id },
  });
}

/**
 * Handle customer.subscription.updated event
 * Called when subscription is modified (plan change, status change, etc.)
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  // Find existing subscription
  const dbSubscription = await db.subscription.findFirst({
    where: {
      providerSubscriptionId: subscription.id,
      provider: "stripe",
    },
  });

  if (!dbSubscription) {
    logger.warn("Subscription update for unknown subscription", {
      context: "stripe-webhook",
      metadata: { subscriptionId: subscription.id },
    });
    return;
  }

  await upsertSubscription(dbSubscription.userId, subscription);

  logger.info("Subscription updated", {
    context: "stripe-webhook",
    metadata: { subscriptionId: subscription.id, status: subscription.status },
  });
}

/**
 * Handle customer.subscription.deleted event
 * Called when subscription is fully canceled
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  const dbSubscription = await db.subscription.findFirst({
    where: {
      providerSubscriptionId: subscription.id,
      provider: "stripe",
    },
  });

  if (!dbSubscription) {
    logger.warn("Subscription delete for unknown subscription", {
      context: "stripe-webhook",
      metadata: { subscriptionId: subscription.id },
    });
    return;
  }

  // Update subscription status to canceled
  await db.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "canceled",
      cancelAtPeriodEnd: false,
    },
  });

  logger.info("Subscription deleted", {
    context: "stripe-webhook",
    metadata: {
      subscriptionId: subscription.id,
      userId: dbSubscription.userId,
    },
  });
}

/**
 * Handle invoice.payment_failed event
 * Called when a payment attempt fails
 */
export async function handlePaymentFailed(
  invoice: Stripe.Invoice
): Promise<void> {
  const subscriptionId = invoice.subscription as string;

  if (!subscriptionId) {
    return;
  }

  const dbSubscription = await db.subscription.findFirst({
    where: {
      providerSubscriptionId: subscriptionId,
      provider: "stripe",
    },
  });

  if (!dbSubscription) {
    return;
  }

  // Update subscription status to past_due
  await db.subscription.update({
    where: { id: dbSubscription.id },
    data: {
      status: "past_due",
    },
  });

  logger.warn("Payment failed", {
    context: "stripe-webhook",
    metadata: { subscriptionId, userId: dbSubscription.userId },
  });
}
