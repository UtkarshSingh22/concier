// 🔒 CORE SYSTEM - DO NOT MODIFY
// Authentication and authorization utilities for the SaaS boilerplate.
// These functions provide server-side protection for routes and API endpoints.

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// Require user to be authenticated
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/auth");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
    include: {
      subscriptions: {
        where: { status: "active" },
        include: {
          plan: {
            include: {
              entitlements: {
                include: {
                  entitlement: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    redirect("/auth");
  }

  return user;
}

// Require user to have a specific subscription plan
export async function requireSubscription(planName: string) {
  const user = await requireAuth();

  const hasSubscription = user.subscriptions.some(
    (sub) => sub.plan.name === planName && sub.status === "active"
  );

  if (!hasSubscription) {
    redirect("/pricing");
  }

  return user;
}

// Require user to have a specific entitlement
export async function requireEntitlement(entitlementName: string) {
  const user = await requireAuth();

  const hasEntitlement = user.subscriptions.some((sub) =>
    sub.plan.entitlements.some((pe) => pe.entitlement.name === entitlementName)
  );

  if (!hasEntitlement) {
    redirect("/pricing");
  }

  return user;
}

// Check if user has entitlement (doesn't redirect, returns boolean)
export async function hasEntitlement(
  entitlementName: string
): Promise<boolean> {
  try {
    const user = await requireAuth();
    return user.subscriptions.some((sub) =>
      sub.plan.entitlements.some(
        (pe) => pe.entitlement.name === entitlementName
      )
    );
  } catch {
    return false;
  }
}

// Get user's active subscription (if any)
export async function getActiveSubscription() {
  const user = await requireAuth();
  return user.subscriptions.find((sub) => sub.status === "active");
}

// Client-side helpers for subscription management
export async function getCurrentUserSubscription() {
  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import("./auth");

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  const { db } = await import("./db");
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      subscriptions: {
        where: { status: "active" },
        select: {
          id: true,
          planId: true,
          provider: true,
          providerSubscriptionId: true,
          providerCustomerId: true,
          status: true,
          currentPeriodStart: true,
          currentPeriodEnd: true,
          cancelAtPeriodEnd: true,
          plan: {
            select: {
              id: true,
              name: true,
              displayName: true,
              description: true,
              price: true,
              interval: true,
              isActive: true,
              stripePriceId: true,
              razorpayPlanId: true,
            },
          },
        },
      },
    },
  });

  return user?.subscriptions[0] || null;
}

export async function getCurrentUserEntitlements() {
  const { getServerSession } = await import("next-auth");
  const { authOptions } = await import("./auth");
  const { db } = await import("./db");

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return [];
  }

  // Single optimized query: Get user with active subscription and entitlements in one go
  const user = await db.user.findUnique({
    where: { email: session.user.email },
    select: {
      subscriptions: {
        where: { status: "active" },
        select: {
          plan: {
            select: {
              entitlements: {
                select: {
                  entitlement: {
                    select: {
                      id: true,
                      name: true,
                      displayName: true,
                      description: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // If user has active subscription, return its entitlements
  if (user?.subscriptions && user.subscriptions.length > 0) {
    return user.subscriptions[0].plan.entitlements.map((pe) => pe.entitlement);
  }

  // Otherwise, return free plan entitlements (with caching potential)
  const freePlan = await db.plan.findUnique({
    where: { name: "free" },
    select: {
      entitlements: {
        select: {
          entitlement: {
            select: {
              id: true,
              name: true,
              displayName: true,
              description: true,
            },
          },
        },
      },
    },
  });

  return freePlan?.entitlements.map((pe) => pe.entitlement) || [];
}
