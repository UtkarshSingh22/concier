# Paywalls

Paywalls control access to premium features based on user entitlements.

## Two Approaches

### 1. Full Page Protection (Server-Side)

Protect entire pages. Unauthenticated or unauthorized users are redirected.

```typescript
// /app/(protected)/pro-feature/page.tsx
import { requireEntitlement } from "@/lib/auth-utils";

export default async function ProFeaturePage() {
  await requireEntitlement("pro_features"); // Redirects to /pricing if missing
  
  return <ProContent />;
}
```

### 2. Inline Feature Gating (Client-Side)

Show upgrade prompts within a page. Content is replaced with an upgrade UI.

```tsx
import { FeatureGate } from "@/components/FeatureGate";

export default function Dashboard() {
  return (
    <div>
      <FreeContent />
      
      <FeatureGate entitlement="api_access">
        <ApiKeyGenerator />  {/* Hidden if user lacks entitlement */}
      </FeatureGate>
    </div>
  );
}
```

## Key Components

### FeatureGate

Wraps premium content. Shows upgrade prompt if user lacks entitlement.

**Location**: `/components/FeatureGate.tsx`

**Props**:
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `entitlement` | string | Yes | Entitlement to check |
| `fallback` | ReactNode | No | Custom locked UI |
| `children` | ReactNode | Yes | Premium content |

**Example with custom fallback**:
```tsx
<FeatureGate 
  entitlement="api_access"
  fallback={<div>Custom locked message</div>}
>
  <PremiumFeature />
</FeatureGate>
```

### UpgradePrompt

Displays upgrade messaging with Stripe checkout button.

**Location**: `/components/UpgradePrompt.tsx`

**Props**:
| Prop | Type | Description |
|------|------|-------------|
| `entitlement` | string | Entitlement that's required |
| `title` | string | Custom title |
| `description` | string | Custom description |
| `buttonText` | string | Custom button text |

**Standalone usage**:
```tsx
<UpgradePrompt 
  entitlement="pro_features"
  title="Unlock Pro Features"
  description="Get access to advanced tools"
/>
```

### UpgradeButton

Simple button that triggers Stripe checkout.

**Location**: `/components/UpgradeButton.tsx`

```tsx
<UpgradeButton planName="pro">
  Upgrade Now
</UpgradeButton>
```

## Demo Page

See `/app/(protected)/pro-feature/page.tsx` for a working example that shows:
- Gated feature (Advanced Analytics)
- Free feature (Basic Security Settings)

## Entitlement-to-Plan Mapping

The `UpgradePrompt` component maps entitlements to plans in `PLAN_REQUIREMENTS`:

```typescript
const PLAN_REQUIREMENTS = {
  basic_access: { name: "Free Plan", planName: "free" },
  pro_features: { name: "Pro Plan", planName: "pro" },
  api_access: { name: "Pro Plan", planName: "pro" },
  priority_support: { name: "Pro Plan", planName: "pro" },
};
```

When adding new entitlements, update this mapping.

## Checkout Flow

1. User sees `UpgradePrompt` or clicks `UpgradeButton`
2. Click triggers `/api/stripe/create-checkout-session`
3. User redirected to Stripe checkout
4. After payment, webhook updates entitlements
5. User returns to `/billing?success=true`

## Adding a New Paywall

1. Decide on entitlement name (e.g., `advanced_reports`)

2. Add to database seed and link to plan

3. Update `PLAN_REQUIREMENTS` in `/components/UpgradePrompt.tsx`

4. Use in your page:
   ```tsx
   <FeatureGate entitlement="advanced_reports">
     <AdvancedReports />
   </FeatureGate>
   ```

## What You Can Edit

- `/components/FeatureGate.tsx` - Loading states, locked UI
- `/components/UpgradePrompt.tsx` - Upgrade messaging, styling
- `PLAN_REQUIREMENTS` mapping

## What NOT to Change

- The entitlement checking logic in `/hooks/use-entitlements.ts`
- The checkout flow in `UpgradePrompt`
- The `/api/stripe/create-checkout-session` endpoint

