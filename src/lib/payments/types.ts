// 🔒 CORE SYSTEM — DO NOT MODIFY
// Payment provider abstraction types.
// Common interfaces for Stripe and Razorpay integration.

import type { SubscriptionStatus } from "@prisma/client";

/**
 * Supported payment providers
 */
export type PaymentProviderType = "stripe" | "razorpay";

/**
 * Checkout session creation parameters
 */
export interface CreateCheckoutParams {
  planName: string;
  userId: string;
  userEmail: string;
  successUrl: string;
  cancelUrl: string;
}

/**
 * Checkout session result
 */
export interface CheckoutResult {
  /** URL to redirect user to for payment */
  url: string;
  /** Session/subscription ID from provider */
  sessionId: string;
}

/**
 * Subscription data from provider
 */
export interface ProviderSubscription {
  id: string;
  customerId: string;
  status: SubscriptionStatus;
  planId: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

/**
 * Webhook event data
 */
export interface WebhookEvent {
  type: string;
  data: unknown;
}

/**
 * Common payment provider interface
 */
export interface PaymentProvider {
  readonly name: PaymentProviderType;

  /**
   * Create a checkout session for subscription purchase
   */
  createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutResult>;

  /**
   * Cancel a subscription (at period end)
   */
  cancelSubscription(providerSubscriptionId: string): Promise<void>;

  /**
   * Reactivate a canceled subscription (before period end)
   */
  reactivateSubscription(providerSubscriptionId: string): Promise<void>;

  /**
   * Get subscription details from provider
   */
  getSubscription(
    providerSubscriptionId: string
  ): Promise<ProviderSubscription | null>;

  /**
   * Verify webhook signature and parse event
   */
  verifyWebhook(payload: string, signature: string): Promise<WebhookEvent>;

  /**
   * Get the plan's provider-specific ID
   */
  getPlanProviderId(planName: string): Promise<string>;
}

/**
 * Subscription update data for database
 */
export interface SubscriptionUpdateData {
  userId: string;
  planId: string;
  provider: PaymentProviderType;
  providerSubscriptionId: string;
  providerCustomerId: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

/**
 * Environment variable for payment provider selection
 */
export const PAYMENT_PROVIDER_ENV = "PAYMENT_PROVIDER";

/**
 * Get current payment provider from environment
 */
export function getCurrentProvider(): PaymentProviderType {
  const provider = process.env[PAYMENT_PROVIDER_ENV] as
    | PaymentProviderType
    | undefined;

  if (provider === "razorpay") {
    return "razorpay";
  }

  // Default to Stripe
  return "stripe";
}
