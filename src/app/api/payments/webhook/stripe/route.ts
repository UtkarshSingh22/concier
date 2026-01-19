// 🔒 CORE SYSTEM — DO NOT MODIFY
// Stripe webhook endpoint.
// Verifies webhook signatures and processes Stripe events.

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripeProvider } from "@/lib/payments/stripe";
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaid,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handlePaymentFailed,
} from "@/lib/webhooks/stripe";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    logger.warn("Missing Stripe webhook signature", {
      context: "stripe-webhook",
    });
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    // Verify webhook signature
    const event = await stripeProvider.verifyWebhook(body, signature);

    logger.info(`Processing Stripe webhook: ${event.type}`, {
      context: "stripe-webhook",
    });

    // Route to appropriate handler
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data as Stripe.Checkout.Session
        );
        break;

      case "invoice.paid":
        await handleInvoicePaid(event.data as Stripe.Invoice);
        break;

      case "invoice.payment_failed":
        await handlePaymentFailed(event.data as Stripe.Invoice);
        break;

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data as Stripe.Subscription);
        break;

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data as Stripe.Subscription);
        break;

      default:
        logger.info(`Unhandled Stripe event type: ${event.type}`, {
          context: "stripe-webhook",
        });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error(error as Error, {
      context: "stripe-webhook",
    });

    // Return 400 for signature verification failures
    if (error instanceof Error && error.message.includes("signature")) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Return 500 for processing errors
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Disable body parsing - we need raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};
