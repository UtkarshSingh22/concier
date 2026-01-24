// 🔒 CORE SYSTEM
// This seed script sets up default plans, entitlements, and admin user.
// You can modify this script to customize the initial data for your application.
// Run with: pnpm prisma db seed

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create entitlements (features)
  console.log("Creating entitlements...");
  const entitlements = await Promise.all([
    prisma.entitlement.upsert({
      where: { name: "basic_access" },
      update: {},
      create: {
        name: "basic_access",
        displayName: "Basic Access",
        description: "Access to basic features and dashboard",
      },
    }),
    prisma.entitlement.upsert({
      where: { name: "pro_features" },
      update: {},
      create: {
        name: "pro_features",
        displayName: "Pro Features",
        description: "Access to advanced features and tools",
      },
    }),
    prisma.entitlement.upsert({
      where: { name: "api_access" },
      update: {},
      create: {
        name: "api_access",
        displayName: "API Access",
        description: "Access to REST API endpoints",
      },
    }),
    prisma.entitlement.upsert({
      where: { name: "priority_support" },
      update: {},
      create: {
        name: "priority_support",
        displayName: "Priority Support",
        description: "Priority email support and faster response times",
      },
    }),
    prisma.entitlement.upsert({
      where: { name: "ai_access" },
      update: {},
      create: {
        name: "ai_access",
        displayName: "AI Access",
        description: "Access to AI-powered features and API endpoints",
      },
    }),
  ]);

  console.log(`✅ Created ${entitlements.length} entitlements`);

  // Create plans
  console.log("Creating plans...");
  const freePlan = await prisma.plan.upsert({
    where: { name: "free" },
    update: {},
    create: {
      name: "free",
      displayName: "Free Plan",
      description: "Perfect for getting started",
      price: 0,
      interval: "month",
      isActive: true,
      stripePriceId: null, // Free plan doesn't need payment provider IDs
      razorpayPlanId: null,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { name: "pro" },
    update: {},
    create: {
      name: "pro",
      displayName: "Pro Plan",
      description: "Full access to all features",
      price: 2900, // $29.00
      interval: "month",
      isActive: true,
      // Placeholder IDs - replace with actual IDs from your payment provider dashboards
      stripePriceId: "price_pro_monthly", // Stripe price ID (e.g., "price_xxx")
      razorpayPlanId: "plan_pro_monthly", // Razorpay plan ID (e.g., "plan_xxx")
    },
  });

  console.log(`✅ Created plans: ${freePlan.name}, ${proPlan.name}`);

  // Link entitlements to plans
  console.log("Linking entitlements to plans...");

  // Free plan gets basic access only
  await prisma.planEntitlement.upsert({
    where: {
      planId_entitlementId: {
        planId: freePlan.id,
        entitlementId: entitlements.find((e) => e.name === "basic_access")!.id,
      },
    },
    update: {},
    create: {
      planId: freePlan.id,
      entitlementId: entitlements.find((e) => e.name === "basic_access")!.id,
    },
  });

  // Pro plan gets all entitlements
  for (const entitlement of entitlements) {
    await prisma.planEntitlement.upsert({
      where: {
        planId_entitlementId: {
          planId: proPlan.id,
          entitlementId: entitlement.id,
        },
      },
      update: {},
      create: {
        planId: proPlan.id,
        entitlementId: entitlement.id,
      },
    });
  }

  console.log("✅ Linked entitlements to plans");

  // Create admin user
  console.log("Creating admin user...");
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
      emailVerified: new Date(),
    },
  });

  // Create a subscription for admin user (Pro plan)
  const adminSubscription = await prisma.subscription.upsert({
    where: {
      userId_planId_status: {
        userId: adminUser.id,
        planId: proPlan.id,
        status: "active",
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      planId: proPlan.id,
      provider: "stripe", // Default provider
      status: "active",
      providerSubscriptionId: "admin_subscription", // Placeholder for admin
      providerCustomerId: "admin_customer",
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    },
  });

  console.log(`✅ Created admin user: ${adminUser.email}`);
  console.log(`✅ Created admin subscription: ${adminSubscription.id}`);

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
