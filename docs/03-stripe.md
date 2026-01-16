# Stripe Integration

The boilerplate includes complete Stripe subscription management.

## What's Implemented

- Checkout session creation
- Subscription management
- Webhook handling
- Entitlement sync
- Cancel/reactivate subscriptions

## Key Files

| File                                           | Purpose                   |
| ---------------------------------------------- | ------------------------- |
| `/lib/stripe.ts`                               | Stripe client and helpers |
| `/lib/stripe-webhooks.ts`                      | Webhook event handlers    |
| `/api/stripe/route.ts`                         | Subscription API          |
| `/api/stripe/create-checkout-session/route.ts` | Checkout creation         |
| `/api/stripe/webhook/route.ts`                 | Webhook endpoint          |

## Environment Variables

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Setup Steps

### 1. Create Stripe Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/) → Products
2. Create a product (e.g., "Pro Plan")
3. Add a price ($29/month)
4. Copy the **Price ID** (starts with `price_`)

### 2. Update Database

```bash
pnpm stripe:update-price pro price_xxxxxxxxxxxxx
```

This links your Stripe price to the database plan.

### 3. Configure Webhooks

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

## Checkout Flow

1. User clicks "Upgrade" button
2. Frontend calls `/api/stripe/create-checkout-session`
3. Stripe checkout session created
4. User redirected to Stripe checkout
5. After payment, user returns to `/billing?success=true`
6. Webhook processes payment and updates entitlements

## Webhook Events

| Event                           | Handler                          | Action                   |
| ------------------------------- | -------------------------------- | ------------------------ |
| `checkout.session.completed`    | `handleCheckoutSessionCompleted` | Creates subscription     |
| `invoice.paid`                  | `handleInvoicePaid`              | Updates status to active |
| `customer.subscription.updated` | `handleSubscriptionUpdated`      | Syncs subscription data  |
| `customer.subscription.deleted` | `handleSubscriptionDeleted`      | Cancels subscription     |

## Testing with Stripe CLI

For local development:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Use the webhook secret from CLI output.

## Triggering Checkout

Use the `UpgradeButton` component:

```tsx
import { UpgradeButton } from "@/components/UpgradeButton";

<UpgradeButton planName="pro">Upgrade to Pro</UpgradeButton>;
```

Or directly call the API:

```typescript
const response = await fetch("/api/stripe/create-checkout-session", {
  method: "POST",
  body: JSON.stringify({ planName: "pro" }),
});
const { url } = await response.json();
window.location.href = url;
```

## What NOT to Change

- `/lib/stripe.ts` - Core Stripe logic
- `/lib/stripe-webhooks.ts` - Webhook handlers
- `/api/stripe/webhook/route.ts` - Webhook endpoint
- The subscription ↔ entitlement sync logic

These ensure subscriptions stay in sync with database entitlements.
