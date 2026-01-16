// 🔒 CORE SYSTEM - DO NOT MODIFY
// Stripe webhook endpoint for handling subscription events
// Processes webhook events to keep database entitlements synchronized

import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import * as Sentry from "@sentry/nextjs";
import { stripe, STRIPE_CONFIG } from "@/lib/stripe";
import {
  handleCheckoutSessionCompleted,
  handleInvoicePaid,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
} from "@/lib/stripe-webhooks";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = headersList.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        STRIPE_CONFIG.webhookSecret
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Handle the event with error tracking
    try {
      switch (event.type) {
        case "checkout.session.completed":
          await handleCheckoutSessionCompleted(
            event.data.object as Stripe.Checkout.Session
          );
          break;

        case "invoice.paid":
          await handleInvoicePaid(event.data.object as Stripe.Invoice);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(
            event.data.object as Stripe.Subscription
          );
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(
            event.data.object as Stripe.Subscription
          );
          break;

        default:
          logger.info(`Unhandled Stripe event: ${event.type}`, {
            context: "stripe-webhook",
          });
      }

      return NextResponse.json({ received: true });
    } catch (handlerError) {
      // Capture webhook handler errors with context
      Sentry.captureException(handlerError, {
        tags: {
          type: "stripe_webhook_error",
          event_type: event.type,
        },
        contexts: {
          stripe: {
            event_id: event.id,
            subscription_id:
              (event.data.object as any).subscription ||
              (event.data.object as any).id,
            customer_id: (event.data.object as any).customer,
          },
        },
      });

      logger.error(handlerError as Error, {
        context: "stripe-webhook",
        tags: { event_type: event.type },
        metadata: { event_id: event.id },
      });

      // Return 500 to tell Stripe to retry
      return NextResponse.json(
        { error: "Webhook handler failed" },
        { status: 500 }
      );
    }
  } catch (error) {
    // Capture signature verification or parsing errors
    Sentry.captureException(error, {
      tags: {
        type: "stripe_webhook_verification_error",
      },
    });

    logger.error(error as Error, {
      context: "stripe-webhook-verification",
    });

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 400 }
    );
  }
}
