// 🔒 CORE SYSTEM - DO NOT MODIFY
// Stripe webhook event handlers
// Processes Stripe events to keep database entitlements in sync

import Stripe from "stripe";
import { updateUserEntitlements } from "./stripe";
import { db } from "./db";

// Handle checkout.session.completed
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  if (session.client_reference_id) {
    // Update user entitlements for the new subscription
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await updateUserEntitlements(session.client_reference_id, subscription);
  }
}

// Handle invoice.paid
export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  if (invoice.customer && typeof invoice.customer === "string") {
    // Find user by Stripe customer ID
    const account = await db.account.findFirst({
      where: {
        provider: "stripe",
        providerAccountId: invoice.customer,
      },
    });

    if (account) {
      // Update subscription status to active
      await db.subscription.updateMany({
        where: {
          userId: account.userId,
          stripeId: invoice.subscription as string,
        },
        data: {
          status: "active",
        },
      });

      // Refresh entitlements
      const subscription = await stripe.subscriptions.retrieve(
        invoice.subscription as string
      );
      await updateUserEntitlements(account.userId, subscription);
    }
  }
}

// Handle customer.subscription.updated
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  // Find user by subscription
  const dbSubscription = await db.subscription.findUnique({
    where: { stripeId: subscription.id },
  });

  if (dbSubscription) {
    // Update subscription in database
    await db.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: subscription.status as any,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    });

    // Update user entitlements
    await updateUserEntitlements(dbSubscription.userId, subscription);
  }
}

// Handle customer.subscription.deleted
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  // Find and update subscription in database
  const dbSubscription = await db.subscription.findUnique({
    where: { stripeId: subscription.id },
  });

  if (dbSubscription) {
    await db.subscription.update({
      where: { id: dbSubscription.id },
      data: {
        status: "canceled",
        cancelAtPeriodEnd: false, // Already canceled
      },
    });

    // Remove entitlements (user goes back to free plan)
    await updateUserEntitlements(dbSubscription.userId, null);
  }
}

// Import stripe here to avoid circular dependencies
import { stripe } from "./stripe";
