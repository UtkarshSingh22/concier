# Payment Integration

The boilerplate includes complete subscription management with support for multiple payment providers. Switch between Stripe and Razorpay by changing a single environment variable.

## Supported Providers

| Provider | Status       | Region Focus  | Currencies      |
| -------- | ------------ | ------------- | --------------- |
| Stripe   | ✅ Default   | Global        | 135+ currencies |
| Razorpay | ✅ Supported | India-focused | INR, USD, etc.  |

## What's Implemented

- Unified checkout flow (works with any provider)
- Subscription management (create, cancel, reactivate)
- Webhook handling (automatic entitlement sync)
- Entitlement-based access control
- Provider abstraction (switch without code changes)

## Quick Setup

### 1. Choose Your Provider

Set in `.env`:

```bash
# Use Stripe (default)
PAYMENT_PROVIDER=stripe

# Or use Razorpay
PAYMENT_PROVIDER=razorpay
```

### 2. Configure Provider Keys

#### Stripe Configuration

```bash
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

#### Razorpay Configuration

```bash
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxx
```

See [13-environment-variables.md](13-environment-variables.md) for complete reference.

### 3. Create Products/Plans

**Stripe:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/) → Products
2. Create product (e.g., "Pro Plan")
3. Add price ($29/month)
4. Copy **Price ID** (starts with `price_`)

**Razorpay:**

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/) → Subscriptions → Plans
2. Create plan (e.g., "Pro Plan")
3. Set billing cycle and amount
4. Copy **Plan ID** (starts with `plan_`)

### 4. Update Database

Link your payment provider plan to database:

**Stripe:**

```bash
node scripts/update-stripe-price.js pro price_xxxxxxxxxxxxx
```

**Razorpay:**

```bash
node scripts/update-razorpay-plan.js pro plan_xxxxxxxxxxxxx
```

### 5. Configure Webhooks

**Stripe:**

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook/stripe`
3. Select events:
   - `checkout.session.completed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

**Razorpay:**

1. Razorpay Dashboard → Settings → Webhooks
2. Add endpoint: `https://yourdomain.com/api/payments/webhook/razorpay`
3. Select events:
   - `subscription.activated`
   - `subscription.charged`
   - `subscription.cancelled`
   - `subscription.paused`
   - `subscription.resumed`
   - `payment.failed`
4. Copy webhook secret to `RAZORPAY_WEBHOOK_SECRET`

## Architecture

### File Structure

```
src/lib/payments/
├── types.ts           # Common interfaces
├── stripe.ts          # Stripe implementation
├── razorpay.ts        # Razorpay implementation
└── index.ts           # Provider switch

src/lib/webhooks/
├── stripe.ts          # Stripe webhook handlers
└── razorpay.ts        # Razorpay webhook handlers

src/app/api/payments/
├── checkout/route.ts              # Unified checkout
├── razorpay-checkout/route.ts     # Razorpay hosted page
└── webhook/
    ├── stripe/route.ts            # Stripe webhooks
    └── razorpay/route.ts          # Razorpay webhooks
```

### Legacy Stripe Files (Still Used)

| File                      | Purpose               |
| ------------------------- | --------------------- |
| `/lib/stripe.ts`          | Stripe-specific utils |
| `/lib/stripe-webhooks.ts` | Stripe event handlers |
| `/api/stripe/route.ts`    | Subscription API      |

These are kept for backward compatibility.

### Payment Provider Interface

Both providers implement this common interface:

```typescript
interface PaymentProvider {
  readonly name: "stripe" | "razorpay";

  createCheckoutSession(params): Promise<{ url: string; sessionId: string }>;
  cancelSubscription(subscriptionId): Promise<void>;
  reactivateSubscription(subscriptionId): Promise<void>;
  getSubscription(subscriptionId): Promise<ProviderSubscription | null>;
  verifyWebhook(payload, signature): Promise<WebhookEvent>;
  getPlanProviderId(planName): Promise<string>;
}
```

### Database Schema

The schema is provider-agnostic:

```prisma
model Plan {
  id             String   @id
  name           String   @unique
  displayName    String
  price          Int
  stripePriceId    String?  @unique  // Stripe price ID
  razorpayPlanId   String?  @unique  // Razorpay plan ID
}

model Subscription {
  id                     String           @id
  userId                 String
  planId                 String
  provider               PaymentProvider  // "stripe" or "razorpay"
  providerSubscriptionId String?          @unique
  providerCustomerId     String?
  status                 SubscriptionStatus
  currentPeriodStart     DateTime?
  currentPeriodEnd       DateTime?
  cancelAtPeriodEnd      Boolean
}

enum PaymentProvider {
  stripe
  razorpay
}
```

## Payment Flow

```
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Frontend   │────▶│  POST /checkout │────▶│ Payment Provider │
│ (Upgrade Btn)│     │   (unified)     │     │ (Stripe/Razorpay)│
└──────────────┘     └─────────────────┘     └──────────────────┘
                                                       │
                                                       ▼
┌──────────────┐     ┌─────────────────┐     ┌──────────────────┐
│   Database   │◀────│ Webhook Handler │◀────│  Provider Event  │
│ (Subscription)│     │  (per provider) │     │                  │
└──────────────┘     └─────────────────┘     └──────────────────┘
```

1. User clicks "Upgrade" button
2. Frontend calls `POST /api/payments/checkout` with `{ planName }`
3. Server reads `PAYMENT_PROVIDER` env var
4. Creates checkout session with appropriate provider
5. Returns checkout URL
6. User completes payment on provider-hosted page
7. Provider sends webhook
8. Webhook handler verifies signature
9. Creates/updates subscription in database
10. Entitlements sync automatically via plan relationship

## Webhook Events

### Stripe Events

| Event                           | Handler                          | Action                      |
| ------------------------------- | -------------------------------- | --------------------------- |
| `checkout.session.completed`    | `handleCheckoutSessionCompleted` | Creates subscription        |
| `invoice.paid`                  | `handleInvoicePaid`              | Updates status to active    |
| `customer.subscription.updated` | `handleSubscriptionUpdated`      | Syncs subscription data     |
| `customer.subscription.deleted` | `handleSubscriptionDeleted`      | Cancels subscription        |
| `invoice.payment_failed`        | `handlePaymentFailed`            | Marks subscription past_due |

### Razorpay Events

| Event                    | Handler                       | Action                      |
| ------------------------ | ----------------------------- | --------------------------- |
| `subscription.activated` | `handleSubscriptionActivated` | Creates subscription        |
| `subscription.charged`   | `handleSubscriptionCharged`   | Updates payment status      |
| `subscription.cancelled` | `handleSubscriptionCancelled` | Cancels subscription        |
| `subscription.paused`    | `handleSubscriptionPaused`    | Pauses subscription         |
| `subscription.resumed`   | `handleSubscriptionResumed`   | Resumes subscription        |
| `payment.failed`         | `handlePaymentFailed`         | Marks subscription past_due |

## Usage

### Frontend (No Changes Needed)

The unified checkout endpoint handles provider selection:

```typescript
// Works with both Stripe and Razorpay
const response = await fetch("/api/payments/checkout", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ planName: "pro" }),
});

const { url } = await response.json();
window.location.href = url;
```

### Using Components

Use the `UpgradeButton` component (works with any provider):

```tsx
import { UpgradeButton } from "@/components/UpgradeButton";

<UpgradeButton planName="pro">Upgrade to Pro</UpgradeButton>;
```

### Server-Side Provider Access

```typescript
import { getPaymentProvider, getCurrentProvider } from "@/lib/payments";

// Get active provider instance
const provider = getPaymentProvider();
console.log(provider.name); // "stripe" or "razorpay"

// Get active provider type
const providerType = getCurrentProvider();
console.log(providerType); // "stripe" or "razorpay"

// Cancel subscription
await provider.cancelSubscription(subscriptionId);
```

### Check Provider Configuration

```typescript
import { isProviderConfigured, getConfiguredProviders } from "@/lib/payments";

// Check if specific provider is configured
if (isProviderConfigured("razorpay")) {
  console.log("Razorpay is available");
}

// Get list of all configured providers
const providers = getConfiguredProviders();
// ["stripe", "razorpay"] or ["stripe"] etc.
```

## Switching Providers

To switch from Stripe to Razorpay:

1. Update `.env`:

   ```bash
   PAYMENT_PROVIDER=razorpay
   RAZORPAY_KEY_ID=rzp_xxxxx
   RAZORPAY_KEY_SECRET=xxxxx
   RAZORPAY_WEBHOOK_SECRET=xxxxx
   ```

2. Ensure plans have Razorpay IDs:

   ```bash
   node scripts/update-razorpay-plan.js pro plan_xxxxx
   ```

3. Configure Razorpay webhooks (see setup section above)

4. Restart the application

**No frontend code changes required!** The abstraction layer handles everything.

## Webhook Security

Both providers require webhook signature verification:

### Stripe

Uses `stripe.webhooks.constructEvent()` with `STRIPE_WEBHOOK_SECRET`.

### Razorpay

Uses HMAC-SHA256 verification with `RAZORPAY_WEBHOOK_SECRET`:

```typescript
const expectedSignature = crypto
  .createHmac("sha256", webhookSecret)
  .update(payload)
  .digest("hex");
```

## Testing

### Stripe Test Mode

Use test keys from Stripe Dashboard:

- `sk_test_xxxxx`
- `pk_test_xxxxx`

Test card: `4242 4242 4242 4242`

**Local webhook testing:**

```bash
stripe listen --forward-to localhost:3000/api/payments/webhook/stripe
```

### Razorpay Test Mode

Use test keys from Razorpay Dashboard:

- `rzp_test_xxxxx`

Test card: `4111 1111 1111 1111`

**Webhook testing:**

Use Razorpay Dashboard → Webhooks → Test to send test events.

## Migration from Old Stripe-Only Setup

If upgrading from the old Stripe-only implementation:

1. Run database migration:

   ```bash
   npx prisma db push
   ```

2. The migration will:
   - Rename `stripeId` to `stripePriceId` in Plan
   - Rename `stripeId` to `providerSubscriptionId` in Subscription
   - Add `provider` field to Subscription (defaults to "stripe")
   - Add `providerCustomerId` to Subscription
   - Add `razorpayPlanId` to Plan

3. Existing Stripe subscriptions will continue to work.

## Error Handling

All errors are normalized across providers:

```typescript
try {
  const result = await provider.createCheckoutSession(params);
} catch (error) {
  // Same error format for both providers
  console.error(error.message);
}
```

Webhook errors return appropriate HTTP status codes:

- `400` - Invalid signature
- `500` - Processing error

## Cost Considerations

### Stripe

- 2.9% + $0.30 per transaction (US)
- Additional fees for international cards
- Best for: Global products, international customers

### Razorpay

- 2% per transaction (India)
- Lower fees for UPI/netbanking
- Best for: India-focused products, UPI payments

## Troubleshooting

### "Plan does not have a provider ID"

Run the appropriate script to set the ID:

```bash
# For Stripe
node scripts/update-stripe-price.js pro price_xxxxx

# For Razorpay
node scripts/update-razorpay-plan.js pro plan_xxxxx
```

### Webhook Not Triggering

1. Verify webhook URL is correct
2. Check webhook secret matches
3. Ensure events are selected in provider dashboard
4. Check server logs for signature verification errors

**Stripe:**

- Check Stripe Dashboard → Developers → Webhooks → Logs
- Verify endpoint: `https://yourdomain.com/api/payments/webhook/stripe`

**Razorpay:**

- Check Razorpay Dashboard → Webhooks → Logs
- Verify endpoint: `https://yourdomain.com/api/payments/webhook/razorpay`

### "Invalid signature" Error

1. Verify webhook secret is correct
2. Ensure raw body is passed to verification (not parsed JSON)
3. Check for proxy/middleware that might modify the request body

### Razorpay Checkout Not Opening

1. Verify subscription was created successfully
2. Check browser console for JavaScript errors
3. Ensure `RAZORPAY_KEY_ID` is correct

### Subscription Not Syncing

1. Check webhook events are being received (provider dashboard logs)
2. Verify webhook secret matches
3. Check server logs for errors
4. Ensure plan IDs are correctly configured in database

## What NOT to Change

### Core System (🔒)

- `/lib/payments/` - Provider abstraction
- `/lib/webhooks/` - Webhook handlers
- `/api/payments/` - API routes
- Subscription ↔ entitlement sync logic

These ensure subscriptions stay in sync with database entitlements regardless of provider.

### Legacy Stripe Files (🔒)

- `/lib/stripe.ts` - Still used for Stripe-specific operations
- `/lib/stripe-webhooks.ts` - Stripe webhook handlers
- `/api/stripe/` - Stripe-specific endpoints

These are kept for backward compatibility.

## Adding a New Provider

To add a new payment provider:

1. Create `src/lib/payments/newprovider.ts` implementing `PaymentProvider`
2. Create `src/lib/webhooks/newprovider.ts` with event handlers
3. Update `src/lib/payments/index.ts` to include the new provider
4. Add webhook route at `src/app/api/payments/webhook/newprovider/route.ts`
5. Update database schema (add `newproviderPlanId` to Plan)
6. Update this documentation

## Related Documentation

- [04-entitlements.md](04-entitlements.md) - Feature gating system
- [08-paywalls.md](08-paywalls.md) - Paywall implementation
- [11-deployment.md](11-deployment.md) - Production deployment
- [13-environment-variables.md](13-environment-variables.md) - Environment variables
