// 🔒 CORE SYSTEM — DO NOT MODIFY
// Payment provider abstraction layer.
// Dynamically selects between Stripe and Razorpay based on environment config.

import { stripeProvider } from "./stripe";
import { razorpayProvider } from "./razorpay";
import {
  getCurrentProvider,
  type PaymentProvider,
  type PaymentProviderType,
} from "./types";

// Re-export types
export type {
  PaymentProvider,
  PaymentProviderType,
  CreateCheckoutParams,
  CheckoutResult,
  ProviderSubscription,
  WebhookEvent,
  SubscriptionUpdateData,
} from "./types";

export { getCurrentProvider } from "./types";

/**
 * Get the active payment provider based on PAYMENT_PROVIDER env var
 */
export function getPaymentProvider(): PaymentProvider {
  const providerType = getCurrentProvider();

  switch (providerType) {
    case "razorpay":
      return razorpayProvider;
    case "stripe":
    default:
      return stripeProvider;
  }
}

/**
 * Get a specific payment provider by name
 * Useful for webhook handlers that need to use a specific provider
 */
export function getProviderByName(name: PaymentProviderType): PaymentProvider {
  switch (name) {
    case "razorpay":
      return razorpayProvider;
    case "stripe":
    default:
      return stripeProvider;
  }
}

/**
 * Check if a specific provider is configured
 */
export function isProviderConfigured(provider: PaymentProviderType): boolean {
  try {
    if (provider === "stripe") {
      return !!(
        process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET
      );
    }
    if (provider === "razorpay") {
      return !!(
        process.env.RAZORPAY_KEY_ID &&
        process.env.RAZORPAY_KEY_SECRET &&
        process.env.RAZORPAY_WEBHOOK_SECRET
      );
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Get list of configured payment providers
 */
export function getConfiguredProviders(): PaymentProviderType[] {
  const providers: PaymentProviderType[] = [];

  if (isProviderConfigured("stripe")) {
    providers.push("stripe");
  }
  if (isProviderConfigured("razorpay")) {
    providers.push("razorpay");
  }

  return providers;
}

// Export individual providers for direct access
export { stripeProvider } from "./stripe";
export { razorpayProvider } from "./razorpay";
