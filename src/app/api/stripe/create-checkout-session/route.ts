// 🔒 CORE SYSTEM - DO NOT MODIFY
// Stripe checkout session creation API
// Creates Stripe checkout sessions for subscription purchases

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createCheckoutSession, getStripePriceId } from "@/lib/stripe";
import { withErrorHandler, createErrorResponse } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  return withErrorHandler(
    async () => {
      // Get authenticated user
      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
        return createErrorResponse("Unauthorized", 401, "AUTH_REQUIRED");
      }

      // Parse request body
      const { planName } = await request.json();
      if (!planName || typeof planName !== "string") {
        return createErrorResponse(
          "Plan name is required",
          400,
          "VALIDATION_ERROR"
        );
      }

      // Get user and plan data in single query
      const { db } = await import("@/lib/db");
      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: {
          id: true,
        },
      });

      if (!user) {
        return createErrorResponse("User not found", 404, "USER_NOT_FOUND");
      }

      // Get Stripe price ID for the plan
      const priceId = await getStripePriceId(planName);
      if (!priceId) {
        return createErrorResponse(
          "Plan not found or not configured",
          404,
          "PLAN_NOT_FOUND"
        );
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
    },
    {
      context: "stripe-checkout",
      tags: { type: "payment" },
    }
  );
}
