# Payments

Multi-provider payment system supporting Stripe and Razorpay with unified API and automatic entitlement sync.

## Architecture

### Provider Abstraction

The system uses a common interface allowing seamless switching between payment providers:

```typescript
// Provider interface
interface PaymentProvider {
  createCheckoutSession(params: CheckoutParams): Promise<CheckoutSession>
  cancelSubscription(subscriptionId: string): Promise<void>
  getSubscription(subscriptionId: string): Promise<Subscription>
}

// Usage
import { payments } from "@/lib/payments"

const session = await payments.createCheckoutSession({
  priceId: "price_xxx",
  successUrl: "/success",
  cancelUrl: "/cancel"
})
```

### File Structure

```
src/lib/payments/
├── index.ts           # Provider factory & exports
├── types.ts           # Common interfaces
├── stripe.ts          # Stripe implementation
└── razorpay.ts        # Razorpay implementation

src/lib/webhooks/
├── stripe.ts          # Stripe webhook handlers
└── razorpay.ts        # Razorpay webhook handlers

src/app/api/payments/
├── checkout/          # Unified checkout endpoint
├── webhook/stripe/    # Stripe webhooks
└── webhook/razorpay/  # Razorpay webhooks
```

## Provider Switching

Switch providers by changing the `PAYMENT_PROVIDER` environment variable:

```typescript
// In payments/index.ts
const provider = process.env.PAYMENT_PROVIDER === 'razorpay'
  ? razorpayProvider
  : stripeProvider

export const payments = provider
```

## Checkout Flow

### Unified Checkout

Single API endpoint handles both providers:

```typescript
// POST /api/payments/checkout
{
  "priceId": "price_xxx",    // or "plan_xxx" for Razorpay
  "successUrl": "/success",
  "cancelUrl": "/cancel"
}
```

### Response Handling

```typescript
// Client-side redirect
if (session.url) {
  window.location.href = session.url
} else if (session.id) {
  // Handle inline checkout (Stripe)
  stripe.redirectToCheckout({ sessionId: session.id })
}
```

## Webhook Processing

### Event Mapping

Webhooks automatically sync subscription state and entitlements:

| Stripe Event | Razorpay Event | Action |
|-------------|---------------|--------|
| `checkout.session.completed` | `subscription.activated` | Grant entitlements |
| `invoice.paid` | `subscription.charged` | Update billing info |
| `invoice.payment_failed` | `payment.failed` | Handle failed payment |
| `customer.subscription.updated` | `subscription.paused/resumed` | Update subscription status |
| `customer.subscription.deleted` | `subscription.cancelled` | Revoke entitlements |

### Entitlement Sync

Webhooks trigger database updates:

```typescript
// Automatic entitlement management
async function handleSubscriptionActivated(subscription: Subscription) {
  await db.user.update({
    where: { id: subscription.userId },
    data: {
      entitlements: subscription.plan.entitlements,
      subscriptionStatus: 'active'
    }
  })
}
```

## Subscription Management

### Client-Side API

```typescript
// Cancel subscription
const response = await fetch('/api/user/subscription', {
  method: 'DELETE'
})

// Reactivate subscription
const response = await fetch('/api/payments/checkout', {
  method: 'POST',
  body: JSON.stringify({
    priceId: user.subscription.priceId,
    isReactivation: true
  })
})
```

### Database Schema

Subscriptions link to user entitlements:

```prisma
model User {
  subscriptionId     String?
  subscriptionStatus SubscriptionStatus?
  entitlements       Json?  // ["pro_features", "api_access"]

  // ... other fields
}
```

## Error Handling

### Webhook Verification

All webhooks are cryptographically verified:

```typescript
// Stripe verification
const event = stripe.webhooks.constructEvent(
  body, signature, webhookSecret
)

// Razorpay verification
const isValid = crypto.createHmac('sha256', secret)
  .update(body)
  .digest('hex') === signature
```

### Failed Payment Handling

Automatic retry logic with email notifications:

```typescript
async function handlePaymentFailed(subscriptionId: string) {
  // Send payment failed email
  await sendEmail({
    to: user.email,
    template: PaymentFailedEmail,
    data: { retryUrl: generateRetryUrl(subscriptionId) }
  })

  // Update subscription status
  await updateSubscriptionStatus(subscriptionId, 'past_due')
}
```

## Modifying Payment Behavior

### Adding Custom Plans

1. Create plan in payment provider dashboard
2. Add to database schema if needed
3. Update scripts to link plan IDs

### Custom Checkout Flow

Extend the checkout endpoint:

```typescript
// In /api/payments/checkout/route.ts
export async function POST(request: Request) {
  const { priceId, customData } = await request.json()

  // Add custom logic here
  const session = await payments.createCheckoutSession({
    priceId,
    metadata: customData  // Pass to webhook
  })

  return Response.json(session)
}
```

### Custom Webhook Events

Add handlers for new webhook events:

```typescript
// In webhooks/stripe.ts
export async function handleWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'custom.event':
      await handleCustomEvent(event.data.object)
      break
    // ... existing cases
  }
}
```

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
│(Subscription)│     │  (per provider) │     │                  │
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

Test card: `5500 6700 0000 1002`

**Webhook testing:**

See [payment-setup.md](payment-setup.md) for webhook configuration instructions.

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

Ensure webhooks are properly configured following the [payment setup guide](payment-setup.md).

**Stripe:**

- Check Stripe Dashboard → Developers → Webhooks → Logs
- Verify endpoint: `https://yourdomain.com/api/payments/webhook/stripe`

**Razorpay:**

- Check Razorpay Dashboard → Webhooks → Logs
- Verify endpoint: `https://yourdomain.com/api/payments/webhook/razorpay`

### "Invalid signature" Error

Verify webhook secret matches what was set during [payment setup](payment-setup.md).

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

- [entitlements.md](entitlements.md) - Feature gating system
- [deployment.md](deployment.md) - Production deployment
- [environment-variables.md](environment-variables.md) - Environment variables
