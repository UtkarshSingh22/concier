// 🔒 CORE SYSTEM — DO NOT MODIFY
// Razorpay webhook endpoint.
// Verifies webhook signatures and processes Razorpay events.

import { NextRequest, NextResponse } from "next/server";
import { razorpayProvider } from "@/lib/payments/razorpay";
import {
  handleSubscriptionActivated,
  handleSubscriptionCharged,
  handleSubscriptionCancelled,
  handleSubscriptionPaused,
  handleSubscriptionResumed,
  handlePaymentFailed,
} from "@/lib/webhooks/razorpay";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!signature) {
    logger.warn("Missing Razorpay webhook signature", {
      context: "razorpay-webhook",
    });
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    // Verify webhook signature
    const event = await razorpayProvider.verifyWebhook(body, signature);

    logger.info(`Processing Razorpay webhook: ${event.type}`, {
      context: "razorpay-webhook",
    });

    // Route to appropriate handler
    switch (event.type) {
      case "subscription.activated":
        await handleSubscriptionActivated(event.data as any);
        break;

      case "subscription.charged":
        await handleSubscriptionCharged(event.data as any);
        break;

      case "subscription.cancelled":
        await handleSubscriptionCancelled(event.data as any);
        break;

      case "subscription.paused":
        await handleSubscriptionPaused(event.data as any);
        break;

      case "subscription.resumed":
        await handleSubscriptionResumed(event.data as any);
        break;

      case "payment.failed":
        await handlePaymentFailed(event.data as any);
        break;

      default:
        logger.info(`Unhandled Razorpay event type: ${event.type}`, {
          context: "razorpay-webhook",
        });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Razorpay webhook error", error as Error, {
      context: "razorpay-webhook",
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
