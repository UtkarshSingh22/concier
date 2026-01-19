#!/usr/bin/env node

/**
 * Script to update Razorpay plan IDs in the database
 * Usage: node scripts/update-razorpay-plan.js <plan_name> <razorpay_plan_id>
 * Example: node scripts/update-razorpay-plan.js pro plan_1AbCdEfGhIjKlMnOpQrSt
 */

const { PrismaClient } = require("@prisma/client");

async function updateRazorpayPlan(planName, razorpayPlanId) {
  const prisma = new PrismaClient();

  try {
    console.log(
      `Updating ${planName} plan with Razorpay plan ID: ${razorpayPlanId}`
    );

    const plan = await prisma.plan.update({
      where: { name: planName },
      data: { razorpayPlanId: razorpayPlanId },
    });

    console.log("✅ Successfully updated plan:");
    console.log(`   Name: ${plan.name}`);
    console.log(`   Display Name: ${plan.displayName}`);
    console.log(`   Razorpay Plan ID: ${plan.razorpayPlanId}`);
    console.log(`   Price: ₹${plan.price / 100}/${plan.interval}`);
  } catch (error) {
    console.error("❌ Error updating plan:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Check command line arguments
const [, , planName, razorpayPlanId] = process.argv;

if (!planName || !razorpayPlanId) {
  console.log(
    "Usage: node scripts/update-razorpay-plan.js <plan_name> <razorpay_plan_id>"
  );
  console.log(
    "Example: node scripts/update-razorpay-plan.js pro plan_1AbCdEfGhIjKlMnOpQrSt"
  );
  process.exit(1);
}

if (!razorpayPlanId.startsWith("plan_")) {
  console.log('❌ Error: Razorpay Plan ID must start with "plan_"');
  console.log(
    "Make sure you copied the correct Plan ID from Razorpay Dashboard"
  );
  process.exit(1);
}

updateRazorpayPlan(planName, razorpayPlanId);
