// 🔒 CORE SYSTEM — DO NOT MODIFY
// Unified checkout endpoint for subscription purchases.
// Automatically routes to Stripe or Razorpay based on PAYMENT_PROVIDER env var.

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getPaymentProvider, getCurrentProvider } from "@/lib/payments";
import { logger } from "@/lib/logger";

interface CheckoutRequest {
  planName: string;
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse and validate request
    const body = (await request.json()) as CheckoutRequest;
    const { planName } = body;

    if (!planName) {
      return NextResponse.json(
        { error: "planName is required" },
        { status: 400 }
      );
    }

    // Verify plan exists
    const plan = await db.plan.findUnique({
      where: { name: planName },
    });

    if (!plan) {
      return NextResponse.json(
        { error: `Plan "${planName}" not found` },
        { status: 404 }
      );
    }

    if (!plan.isActive) {
      return NextResponse.json(
        { error: `Plan "${planName}" is not available` },
        { status: 400 }
      );
    }

    // Check if user already has an active subscription to this plan
    const existingSubscription = await db.subscription.findFirst({
      where: {
        userId: user.id,
        planId: plan.id,
        status: {
          in: ["active", "trialing"],
        },
      },
    });

    if (existingSubscription) {
      return NextResponse.json(
        { error: "You already have an active subscription to this plan" },
        { status: 400 }
      );
    }

    // Get payment provider based on environment config
    const provider = getPaymentProvider();
    const providerType = getCurrentProvider();

    // Build success and cancel URLs
    const baseUrl = process.env.NEXTAUTH_URL || request.nextUrl.origin;
    const successUrl = `${baseUrl}/billing?success=true`;
    const cancelUrl = `${baseUrl}/billing?canceled=true`;

    // Create checkout session
    const result = await provider.createCheckoutSession({
      planName,
      userId: user.id,
      userEmail: user.email,
      successUrl,
      cancelUrl,
    });

    logger.info("Checkout session created", {
      context: "payments",
      metadata: {
        userId: user.id,
        planName,
        provider: providerType,
        sessionId: result.sessionId,
      },
    });

    return NextResponse.json({
      url: result.url,
      sessionId: result.sessionId,
      provider: providerType,
    });
  } catch (error) {
    logger.error(error as Error, {
      context: "payments",
    });

    // Return user-friendly error message
    const message =
      error instanceof Error
        ? error.message
        : "Failed to create checkout session";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
