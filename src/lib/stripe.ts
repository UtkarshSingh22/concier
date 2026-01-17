// 🔒 CORE SYSTEM - DO NOT MODIFY
// Stripe integration utilities for payments and subscriptions
// Handles all Stripe API interactions in a modular way

import Stripe from "stripe";
import { db } from "./db";

// Validate Stripe environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET environment variable is required");
}

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Stripe configuration
export const STRIPE_CONFIG = {
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
} as const;

// Helper to get Stripe price ID for a plan
export async function getStripePriceId(
  planName: string
): Promise<string | null> {
  const plan = await db.plan.findUnique({
    where: { name: planName },
  });

  if (!plan) {
    throw new Error(`Plan "${planName}" not found in database`);
  }

  if (!plan.stripeId) {
    throw new Error(
      `Plan "${planName}" does not have a Stripe price ID configured. Please update the database seed with your actual Stripe price ID.`
    );
  }

  if (plan.stripeId.startsWith("price_")) {
    // Looks like a real Stripe price ID
    return plan.stripeId;
  } else {
    // Placeholder value - user needs to configure
    throw new Error(
      `Plan "${planName}" has placeholder price ID "${plan.stripeId}". Please replace with your actual Stripe price ID from the Stripe dashboard.`
    );
  }
}

// Helper to get plan by Stripe price ID
export async function getPlanByStripePriceId(stripePriceId: string) {
  return await db.plan.findFirst({
    where: { stripeId: stripePriceId },
    include: {
      entitlements: {
        include: {
          entitlement: true,
        },
      },
    },
  });
}

// Create checkout session for subscription
export async function createCheckoutSession({
  priceId,
  userId,
  userEmail,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}) {
  return await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer_email: userEmail,
    client_reference_id: userId,
    success_url: successUrl,
    cancel_url: cancelUrl,
    allow_promotion_codes: true,
  });
}

// Update user entitlements based on subscription
export async function updateUserEntitlements(
  userId: string,
  subscription: Stripe.Subscription | null
) {
  // Get current active subscription
  const currentSubscription = await db.subscription.findFirst({
    where: {
      userId,
      status: "active",
    },
    include: {
      plan: {
        include: {
          entitlements: {
            include: {
              entitlement: true,
            },
          },
        },
      },
    },
  });

  if (subscription) {
    // Update or create subscription
    const plan = await getPlanByStripePriceId(
      subscription.items.data[0].price.id
    );

    if (!plan) {
      throw new Error(
        `Plan not found for Stripe price: ${subscription.items.data[0].price.id}`
      );
    }

    await db.subscription.upsert({
      where: {
        stripeId: subscription.id,
      },
      update: {
        status: subscription.status as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      create: {
        userId,
        planId: plan.id,
        stripeId: subscription.id,
        status: subscription.status as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });
  } else if (currentSubscription) {
    // Cancel subscription if it exists and no active Stripe subscription
    await db.subscription.update({
      where: { id: currentSubscription.id },
      data: { status: "canceled" },
    });
  }
}

// Get user's current active subscription
export async function getCurrentUserSubscription(userId: string) {
  return await db.subscription.findFirst({
    where: {
      userId,
      status: "active",
    },
    include: {
      plan: {
        include: {
          entitlements: {
            include: {
              entitlement: true,
            },
          },
        },
      },
    },
  });
}

// Get user's current entitlements
export async function getCurrentUserEntitlements(userId: string) {
  const subscription = await getCurrentUserSubscription(userId);

  if (!subscription) {
    // Return free plan entitlements
    const freePlan = await db.plan.findUnique({
      where: { name: "free" },
      include: {
        entitlements: {
          include: {
            entitlement: true,
          },
        },
      },
    });

    return freePlan?.entitlements.map((pe) => pe.entitlement) || [];
  }

  return subscription.plan.entitlements.map((pe) => pe.entitlement);
}

// Check if user has specific entitlement
export async function hasEntitlement(
  userId: string,
  entitlementName: string
): Promise<boolean> {
  const entitlements = await getCurrentUserEntitlements(userId);
  return entitlements.some(
    (entitlement) => entitlement.name === entitlementName
  );
}

// Cancel subscription
export async function cancelSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}

// Reactivate subscription
export async function reactivateSubscription(subscriptionId: string) {
  return await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  });
}
