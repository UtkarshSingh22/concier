// 🔒 CORE SYSTEM - DO NOT MODIFY
// Stripe checkout session creation API
// Creates Stripe checkout sessions for subscription purchases

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutSession, getStripePriceId } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { planName } = await request.json();
    if (!planName || typeof planName !== "string") {
      return NextResponse.json(
        { error: "Plan name is required" },
        { status: 400 }
      );
    }

    // Get Stripe price ID for the plan
    const priceId = await getStripePriceId(planName);
    if (!priceId) {
      return NextResponse.json(
        { error: "Plan not found or not configured" },
        { status: 404 }
      );
    }

    // Get user ID from database
    const { db } = await import("@/lib/db");
    const user = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create checkout session
    const checkoutSession = await createCheckoutSession({
      priceId,
      userId: user.id,
      userEmail: session.user.email,
      successUrl: `${process.env.NEXTAUTH_URL}/billing?success=true`,
      cancelUrl: `${process.env.NEXTAUTH_URL}/billing?canceled=true`,
    });

    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id,
    });
  } catch (error) {
    console.error("Checkout session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
