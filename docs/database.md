# Database

ZeroDrag uses PostgreSQL with Prisma ORM.

## Schema Overview

The database has these main tables:

| Table               | Purpose                                                   |
| ------------------- | --------------------------------------------------------- |
| `users`             | User accounts                                             |
| `accounts`          | OAuth provider links                                      |
| `sessions`          | Active sessions                                           |
| `plans`             | Subscription plans (free, pro) with provider-specific IDs |
| `subscriptions`     | User subscriptions (provider-agnostic)                    |
| `entitlements`      | Features/permissions                                      |
| `plan_entitlements` | Links plans to entitlements                               |
| `ai_usage`          | AI API usage tracking (optional)                          |

## Key Files

| File                    | Purpose                |
| ----------------------- | ---------------------- |
| `/prisma/schema.prisma` | Database schema        |
| `/prisma/seed.ts`       | Initial data setup     |
| `/lib/db.ts`            | Prisma client instance |

## Setup Commands

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Seed initial data
pnpm db:seed

# All-in-one setup
pnpm db:setup

# Open Prisma Studio
pnpm db:studio
```

## Default Plans

The seed script creates:

**Free Plan**

- Price: $0
- Entitlements: `basic_access`

**Pro Plan**

- Price: $29/month
- Entitlements: `basic_access`, `pro_features`, `api_access`, `priority_support`

## Default Entitlements

| Name               | Display Name     | Description                  |
| ------------------ | ---------------- | ---------------------------- |
| `basic_access`     | Basic Access     | Dashboard and basic features |
| `pro_features`     | Pro Features     | Advanced tools               |
| `api_access`       | API Access       | REST API endpoints           |
| `priority_support` | Priority Support | Faster support response      |

## Adding New Plans

1. Add the plan to `/prisma/seed.ts`
2. Create the price/plan in your payment provider:
   - **Stripe**: Create price in Stripe Dashboard
   - **Razorpay**: Create plan in Razorpay Dashboard
3. Run the update script:

   ```bash
   # For Stripe
   node scripts/update-stripe-price.js your_plan_name price_xxxx

   # For Razorpay
   node scripts/update-razorpay-plan.js your_plan_name plan_xxxx
   ```

4. Link entitlements in the seed script

## Adding New Entitlements

1. Add to `/prisma/seed.ts`:
   ```typescript
   prisma.entitlement.upsert({
     where: { name: "your_feature" },
     update: {},
     create: {
       name: "your_feature",
       displayName: "Your Feature",
       description: "What this feature does",
     },
   });
   ```
2. Link to plans in the seed script
3. Run `pnpm db:seed`

## What NOT to Change

- `/prisma/schema.prisma` - Core schema structure
- The relationship between plans, entitlements, and subscriptions

Adding new fields to existing models is safe. Changing the core subscription logic is not recommended.
