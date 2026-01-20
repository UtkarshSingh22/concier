# Database Seeding

The seed script creates initial data required for the app to function: plans, entitlements, and an admin user.

## What Gets Created

### Entitlements (Features)

| Name               | Display Name     | Description                                      |
| ------------------ | ---------------- | ------------------------------------------------ |
| `basic_access`     | Basic Access     | Access to basic features and dashboard           |
| `pro_features`     | Pro Features     | Access to advanced features and tools            |
| `api_access`       | API Access       | Access to REST API endpoints                     |
| `priority_support` | Priority Support | Priority email support and faster response times |

### Plans

| Name   | Display Name | Price     | Entitlements     |
| ------ | ------------ | --------- | ---------------- |
| `free` | Free Plan    | $0/month  | `basic_access`   |
| `pro`  | Pro Plan     | $29/month | All entitlements |

### Admin User

- **Email**: `admin@example.com`
- **Role**: `admin`
- **Subscription**: Pro Plan (active)

This user is for development testing. Remove or change in production.

## Running the Seed

### First Time Setup

```bash
pnpm db:setup
```

This runs:

1. `prisma generate` - Generates Prisma client
2. `prisma db push` - Creates tables in database
3. `pnpm db:seed` - Seeds initial data

### Re-seeding

To run seed again (safe to run multiple times):

```bash
pnpm db:seed
```

The seed uses `upsert` operations, so running it multiple times won't create duplicates.

## Seed File Location

```
/prisma/seed.ts
```

This file is configured in `package.json`:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

## Adding New Entitlements

1. Add to the entitlements array in `/prisma/seed.ts`:

```typescript
prisma.entitlement.upsert({
  where: { name: "your_feature" },
  update: {},
  create: {
    name: "your_feature",
    displayName: "Your Feature",
    description: "What this feature provides",
  },
}),
```

2. Link to a plan:

```typescript
// Add to Pro plan
await prisma.planEntitlement.upsert({
  where: {
    planId_entitlementId: {
      planId: proPlan.id,
      entitlementId: entitlements.find((e) => e.name === "your_feature")!.id,
    },
  },
  update: {},
  create: {
    planId: proPlan.id,
    entitlementId: entitlements.find((e) => e.name === "your_feature")!.id,
  },
});
```

3. Run the seed:

```bash
pnpm db:seed
```

4. Update `PLAN_REQUIREMENTS` in `/components/UpgradePrompt.tsx`:

```typescript
const PLAN_REQUIREMENTS = {
  // ... existing
  your_feature: { name: "Pro Plan", planName: "pro" },
};
```

## Adding New Plans

1. Create the plan in `/prisma/seed.ts`:

```typescript
const enterprisePlan = await prisma.plan.upsert({
  where: { name: "enterprise" },
  update: {},
  create: {
    name: "enterprise",
    displayName: "Enterprise Plan",
    description: "For large teams",
    price: 9900, // $99.00 (in cents)
    interval: "month",
    isActive: true,
    stripePriceId: "price_enterprise_monthly", // Placeholder for Stripe
    razorpayPlanId: "plan_enterprise_monthly", // Placeholder for Razorpay
  },
});
```

2. Link entitlements to the new plan.

3. Create the price/plan in your payment provider dashboard.

4. Update the payment provider ID:

```bash
# For Stripe
node scripts/update-stripe-price.js enterprise price_xxxxxxxxxxxxx

# For Razorpay
node scripts/update-razorpay-plan.js enterprise plan_xxxxxxxxxxxxx
```

5. Update pricing page UI in `/app/pricing/page.tsx`.

## Updating Payment Provider Plan IDs

After creating products/plans in your payment provider dashboard:

### Stripe

```bash
# Update Pro plan price
node scripts/update-stripe-price.js pro price_xxxxxxxxxxxxx

# Update Enterprise plan price
node scripts/update-stripe-price.js enterprise price_xxxxxxxxxxxxx
```

### Razorpay

```bash
# Update Pro plan
node scripts/update-razorpay-plan.js pro plan_xxxxxxxxxxxxx

# Update Enterprise plan
node scripts/update-razorpay-plan.js enterprise plan_xxxxxxxxxxxxx
```

The scripts are located at:

- `/scripts/update-stripe-price.js`
- `/scripts/update-razorpay-plan.js`

## Seed Order

The seed script runs in this order:

1. **Create Entitlements** - Features that plans provide
2. **Create Plans** - Free and Pro plans
3. **Link Entitlements to Plans** - Which plan has which features
4. **Create Admin User** - Test user with Pro plan

This order matters because plans reference entitlements, and subscriptions reference both users and plans.

## Resetting the Database

To completely reset and re-seed:

```bash
# Drop all tables and recreate
npx prisma db push --force-reset

# Re-seed
pnpm db:seed
```

⚠️ **Warning**: This deletes all data. Only use in development.

## Production Seeding

For production:

1. Run `prisma db push` to create tables
2. Run `pnpm db:seed` to create plans and entitlements
3. **Remove or update** the admin user (don't leave `admin@example.com`)
4. Update payment provider IDs with production values

```bash
# For Stripe
node scripts/update-stripe-price.js pro price_live_xxxxxxxxxxxxx

# For Razorpay
node scripts/update-razorpay-plan.js pro plan_live_xxxxxxxxxxxxx
```

See [deployment.md](deployment.md) for complete production setup guide.

## Verifying Seed Data

Use Prisma Studio to inspect seeded data:

```bash
pnpm db:studio
```

This opens a web UI to view all database tables.

## Troubleshooting

### "Plan not found" Error

The seed hasn't run. Execute:

```bash
pnpm db:seed
```

### "Payment Provider ID" Error

The plan has a placeholder ID. Update it with your actual payment provider ID:

```bash
# For Stripe
node scripts/update-stripe-price.js pro price_xxxxxxxxxxxxx

# For Razorpay
node scripts/update-razorpay-plan.js pro plan_xxxxxxxxxxxxx
```

### Duplicate Key Error

This shouldn't happen with upsert. If it does, reset the database:

```bash
npx prisma db push --force-reset
pnpm db:seed
```

### Seed Fails to Run

Check that `tsx` is installed and `package.json` has the prisma seed config:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```
