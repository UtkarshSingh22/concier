// 🔒 CORE SYSTEM — DO NOT MODIFY
// Stripe payment provider implementation.
// Handles Stripe Checkout and subscription management.

import Stripe from "stripe";
import { db } from "@/lib/db";
import type {
  PaymentProvider,
  CreateCheckoutParams,
  CheckoutResult,
  ProviderSubscription,
  WebhookEvent,
} from "./types";
import type { SubscriptionStatus } from "@prisma/client";

// Validate environment variables
function getStripeConfig() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY environment variable is required");
  }
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET environment variable is required");
  }

  return { secretKey, webhookSecret };
}

// Lazy initialization of Stripe client
let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripeClient) {
    const { secretKey } = getStripeConfig();
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2024-06-20",
    });
  }
  return stripeClient;
}

/**
 * Map Stripe subscription status to our SubscriptionStatus enum
 */
function mapStripeStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    incomplete: "incomplete",
    incomplete_expired: "incomplete_expired",
    trialing: "trialing",
    active: "active",
    past_due: "past_due",
    canceled: "canceled",
    unpaid: "unpaid",
    paused: "paused",
  };
  return statusMap[status] || "active";
}

/**
 * Stripe payment provider implementation
 */
class StripeProvider implements PaymentProvider {
  readonly name = "stripe" as const;

  async getPlanProviderId(planName: string): Promise<string> {
    const plan = await db.plan.findUnique({
      where: { name: planName },
    });

    if (!plan) {
      throw new Error(`Plan "${planName}" not found in database`);
    }

    if (!plan.stripePriceId) {
      throw new Error(
        `Plan "${planName}" does not have a Stripe price ID configured`
      );
    }

    if (!plan.stripePriceId.startsWith("price_")) {
      throw new Error(
        `Plan "${planName}" has invalid Stripe price ID "${plan.stripePriceId}". ` +
          `Please configure a valid Stripe price ID from your Stripe dashboard.`
      );
    }

    return plan.stripePriceId;
  }

  async createCheckoutSession(
    params: CreateCheckoutParams
  ): Promise<CheckoutResult> {
    const stripe = getStripeClient();
    const priceId = await this.getPlanProviderId(params.planName);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: params.userEmail,
      client_reference_id: params.userId,
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      throw new Error("Failed to create Stripe checkout session");
    }

    return {
      url: session.url,
      sessionId: session.id,
    };
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<void> {
    const stripe = getStripeClient();
    await stripe.subscriptions.update(providerSubscriptionId, {
      cancel_at_period_end: true,
    });
  }

  async reactivateSubscription(providerSubscriptionId: string): Promise<void> {
    const stripe = getStripeClient();
    await stripe.subscriptions.update(providerSubscriptionId, {
      cancel_at_period_end: false,
    });
  }

  async getSubscription(
    providerSubscriptionId: string
  ): Promise<ProviderSubscription | null> {
    const stripe = getStripeClient();

    try {
      const subscription = await stripe.subscriptions.retrieve(
        providerSubscriptionId
      );

      // Get plan from our database by Stripe price ID
      const priceId = subscription.items.data[0]?.price.id;
      const plan = await db.plan.findFirst({
        where: { stripePriceId: priceId },
      });

      if (!plan) {
        throw new Error(`Plan not found for Stripe price: ${priceId}`);
      }

      return {
        id: subscription.id,
        customerId: subscription.customer as string,
        status: mapStripeStatus(subscription.status),
        planId: plan.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      };
    } catch (error) {
      if ((error as any)?.code === "resource_missing") {
        return null;
      }
      throw error;
    }
  }

  async verifyWebhook(
    payload: string,
    signature: string
  ): Promise<WebhookEvent> {
    const stripe = getStripeClient();
    const { webhookSecret } = getStripeConfig();

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    return {
      type: event.type,
      data: event.data.object,
    };
  }
}

// Export singleton instance
export const stripeProvider = new StripeProvider();

// Export Stripe client for direct access in webhook handlers
export { getStripeClient };
