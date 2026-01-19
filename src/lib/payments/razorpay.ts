// 🔒 CORE SYSTEM — DO NOT MODIFY
// Razorpay payment provider implementation.
// Handles Razorpay subscriptions and checkout.

import Razorpay from "razorpay";
import crypto from "crypto";
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
function getRazorpayConfig() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!keyId) {
    throw new Error("RAZORPAY_KEY_ID environment variable is required");
  }
  if (!keySecret) {
    throw new Error("RAZORPAY_KEY_SECRET environment variable is required");
  }
  if (!webhookSecret) {
    throw new Error("RAZORPAY_WEBHOOK_SECRET environment variable is required");
  }

  return { keyId, keySecret, webhookSecret };
}

// Lazy initialization of Razorpay client
let razorpayClient: Razorpay | null = null;

function getRazorpayClient(): Razorpay {
  if (!razorpayClient) {
    const { keyId, keySecret } = getRazorpayConfig();
    razorpayClient = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayClient;
}

/**
 * Map Razorpay subscription status to our SubscriptionStatus enum
 */
function mapRazorpayStatus(status: string): SubscriptionStatus {
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
 * Razorpay payment provider implementation
 */
class RazorpayProvider implements PaymentProvider {
  readonly name = "razorpay" as const;

  async getPlanProviderId(planName: string): Promise<string> {
    const plan = await db.plan.findUnique({
      where: { name: planName },
    });

    if (!plan) {
      throw new Error(`Plan "${planName}" not found in database`);
    }

    if (!plan.razorpayPlanId) {
      throw new Error(
        `Plan "${planName}" does not have a Razorpay plan ID configured`
      );
    }

    if (!plan.razorpayPlanId.startsWith("plan_")) {
      throw new Error(
        `Plan "${planName}" has invalid Razorpay plan ID "${plan.razorpayPlanId}". ` +
          `Please configure a valid Razorpay plan ID from your Razorpay dashboard.`
      );
    }

    return plan.razorpayPlanId;
  }

  async createCheckoutSession(
    params: CreateCheckoutParams
  ): Promise<CheckoutResult> {
    const razorpay = getRazorpayClient();
    const { keyId } = getRazorpayConfig();
    const planId = await this.getPlanProviderId(params.planName);

    // Create a Razorpay subscription
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId,
      total_count: 120, // Max billing cycles (10 years for monthly)
      quantity: 1,
      customer_notify: 1,
      notes: {
        userId: params.userId,
        userEmail: params.userEmail,
        planName: params.planName,
      },
    });

    // Build hosted checkout URL
    // Razorpay uses a different checkout flow - we return data for client-side checkout
    // For server-side redirect, we use Razorpay's hosted page
    const checkoutUrl = new URL(
      `${process.env.NEXTAUTH_URL}/api/payments/razorpay-checkout`
    );
    checkoutUrl.searchParams.set("subscription_id", subscription.id);
    checkoutUrl.searchParams.set("key_id", keyId);
    checkoutUrl.searchParams.set("success_url", params.successUrl);
    checkoutUrl.searchParams.set("cancel_url", params.cancelUrl);
    checkoutUrl.searchParams.set("user_id", params.userId);
    checkoutUrl.searchParams.set("email", params.userEmail);

    return {
      url: checkoutUrl.toString(),
      sessionId: subscription.id,
    };
  }

  async cancelSubscription(providerSubscriptionId: string): Promise<void> {
    const razorpay = getRazorpayClient();
    await razorpay.subscriptions.cancel(providerSubscriptionId, false); // false = cancel at period end
  }

  async reactivateSubscription(providerSubscriptionId: string): Promise<void> {
    const razorpay = getRazorpayClient();
    // Razorpay doesn't have a direct "reactivate" - we need to resume if paused
    // or the subscription needs to be recreated if canceled
    try {
      await razorpay.subscriptions.resume(providerSubscriptionId);
    } catch {
      throw new Error(
        "Cannot reactivate this subscription. Please create a new subscription."
      );
    }
  }

  async getSubscription(
    providerSubscriptionId: string
  ): Promise<ProviderSubscription | null> {
    const razorpay = getRazorpayClient();

    try {
      const subscription = await razorpay.subscriptions.fetch(
        providerSubscriptionId
      );

      // Get plan from our database by Razorpay plan ID
      const razorpayPlanId = subscription.plan_id;
      const plan = await db.plan.findFirst({
        where: { razorpayPlanId },
      });

      if (!plan) {
        throw new Error(`Plan not found for Razorpay plan: ${razorpayPlanId}`);
      }

      // Razorpay timestamps are in seconds
      const currentPeriodStart = subscription.current_start
        ? new Date(subscription.current_start * 1000)
        : new Date();
      const currentPeriodEnd = subscription.current_end
        ? new Date(subscription.current_end * 1000)
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // Default 30 days

      return {
        id: subscription.id,
        customerId: subscription.customer_id || "",
        status: mapRazorpayStatus(subscription.status),
        planId: plan.id,
        currentPeriodStart,
        currentPeriodEnd,
        cancelAtPeriodEnd:
          subscription.status === "cancelled" || subscription.ended_at !== null,
      };
    } catch (error) {
      if ((error as any)?.statusCode === 400) {
        return null;
      }
      throw error;
    }
  }

  async verifyWebhook(
    payload: string,
    signature: string
  ): Promise<WebhookEvent> {
    const { webhookSecret } = getRazorpayConfig();

    // Razorpay webhook signature verification
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(payload)
      .digest("hex");

    if (expectedSignature !== signature) {
      throw new Error("Invalid Razorpay webhook signature");
    }

    const event = JSON.parse(payload);

    return {
      type: event.event,
      data: event.payload,
    };
  }
}

// Export singleton instance
export const razorpayProvider = new RazorpayProvider();

// Export client getter for webhook handlers
export { getRazorpayClient };
