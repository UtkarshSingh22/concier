#!/usr/bin/env node

/**
 * Script to update Stripe price IDs in the database
 * Usage: node scripts/update-stripe-price.js <plan_name> <price_id>
 * Example: node scripts/update-stripe-price.js pro price_1AbCdEfGhIjKlMnOpQrSt
 */

const { PrismaClient } = require("@prisma/client");

async function updateStripePrice(planName, priceId) {
  const prisma = new PrismaClient();

  try {
    console.log(`Updating ${planName} plan with Stripe price ID: ${priceId}`);

    const plan = await prisma.plan.update({
      where: { name: planName },
      data: { stripeId: priceId },
    });

    console.log("✅ Successfully updated plan:");
    console.log(`   Name: ${plan.name}`);
    console.log(`   Display Name: ${plan.displayName}`);
    console.log(`   Stripe ID: ${plan.stripeId}`);
    console.log(`   Price: $${plan.price / 100}/${plan.interval}`);
  } catch (error) {
    console.error("❌ Error updating plan:", error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Check command line arguments
const [, , planName, priceId] = process.argv;

if (!planName || !priceId) {
  console.log(
    "Usage: node scripts/update-stripe-price.js <plan_name> <price_id>"
  );
  console.log(
    "Example: node scripts/update-stripe-price.js pro price_1AbCdEfGhIjKlMnOpQrSt"
  );
  process.exit(1);
}

if (!priceId.startsWith("price_")) {
  console.log('❌ Error: Price ID must start with "price_"');
  console.log(
    "Make sure you copied the correct Price ID from Stripe Dashboard"
  );
  process.exit(1);
}

updateStripePrice(planName, priceId);
