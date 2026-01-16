# Entitlement System Documentation

This SaaS boilerplate uses an **entitlement-based** feature gating system, which provides maximum flexibility for managing access to features.

## Overview

### Why Entitlements (Not Plan Checks)?

✅ **Use Entitlements** - Check for specific capabilities
❌ **Don't Use Plans** - Don't check if user is on "Pro Plan"

**Benefits:**

- Add/remove features from plans without changing code
- Multiple plans can share the same entitlements
- More granular control over feature access
- Easier to create custom plans or bundles

## Available Entitlements

Your database currently has these entitlements:

| Entitlement Name   | Display Name     | Description                                | Default Plan |
| ------------------ | ---------------- | ------------------------------------------ | ------------ |
| `basic_access`     | Basic Access     | Access to basic features and dashboard     | Free         |
| `pro_features`     | Pro Features     | Access to advanced features and tools      | Pro          |
| `api_access`       | API Access       | Access to REST API endpoints               | Pro          |
| `priority_support` | Priority Support | Priority email support and faster response | Pro          |

## How to Use

### 1. Server-Side Protection (Whole Pages)

Protect entire pages using server-side checks:

```tsx
// src/app/(protected)/some-page/page.tsx
import { requireEntitlement } from "@/lib/auth-utils";

export default async function SomePage() {
  // Redirects to /pricing if user lacks entitlement
  await requireEntitlement("api_access");

  return <div>Protected content</div>;
}
```

### 2. Client-Side Feature Gating (UI Components)

Gate specific UI sections using the `<FeatureGate>` component:

```tsx
import { FeatureGate } from "@/components/FeatureGate";

export default function Dashboard() {
  return (
    <div>
      {/* Free feature - no gate needed */}
      <Card>Basic dashboard content</Card>

      {/* Pro feature - behind entitlement gate */}
      <FeatureGate entitlement="api_access">
        <Card>API Key Generator</Card>
      </FeatureGate>
    </div>
  );
}
```

### 3. Custom Upgrade Prompts

Show custom upgrade messaging:

```tsx
<FeatureGate
  entitlement="priority_support"
  fallback={
    <UpgradePrompt
      entitlement="priority_support"
      title="Upgrade for Priority Support"
      description="Get faster response times and dedicated support."
    />
  }
>
  <SupportChatWidget />
</FeatureGate>
```

## Components

### `<FeatureGate>`

**Location:** `src/components/FeatureGate.tsx`

**Props:**

- `entitlement` (string) - Required entitlement name
- `fallback` (ReactNode) - Optional custom UI when locked
- `children` (ReactNode) - Content to show when unlocked

**Behavior:**

- Shows loading spinner while checking
- Shows children if user has entitlement
- Shows upgrade prompt or custom fallback if locked

### `<UpgradePrompt>`

**Location:** `src/components/UpgradePrompt.tsx`

**Props:**

- `entitlement` (string) - Entitlement that's required
- `title` (string) - Optional custom title
- `description` (string) - Optional custom description
- `planName` (string) - Optional override for target plan
- `buttonText` (string) - Optional custom button text

**Behavior:**

- Automatically determines required plan from entitlement
- Triggers Stripe checkout on upgrade click
- Shows loading states during checkout

## Server-Side Utilities

Located in `src/lib/auth-utils.ts`:

```tsx
// Require specific entitlement (redirects if missing)
await requireEntitlement("api_access");

// Require authentication only
const user = await requireAuth();

// Check entitlement (returns boolean, no redirect)
const hasAPI = await hasEntitlement("api_access");

// Get user's active subscription
const subscription = await getActiveSubscription();
```

## Client-Side Hook

Use the `useEntitlements()` hook for custom logic:

```tsx
import { useEntitlements } from "@/hooks/use-entitlements";

function CustomComponent() {
  const { entitlements, hasEntitlement, loading } = useEntitlements();

  if (hasEntitlement("pro_features")) {
    return <ProDashboard />;
  }

  return <FreeDashboard />;
}
```

## Adding New Entitlements

1. **Add to Database** (via Prisma seed or admin UI)
2. **Update `PLAN_REQUIREMENTS` mapping** in `src/components/UpgradePrompt.tsx`
3. **Use in your code** with `<FeatureGate entitlement="your_new_entitlement">`

Example:

```tsx
// src/components/UpgradePrompt.tsx
const PLAN_REQUIREMENTS: Record<string, { name: string; planName: string }> = {
  basic_access: { name: "Free Plan", planName: "free" },
  pro_features: { name: "Pro Plan", planName: "pro" },
  api_access: { name: "Pro Plan", planName: "pro" },
  priority_support: { name: "Pro Plan", planName: "pro" },

  // Add new entitlement
  advanced_analytics: { name: "Pro Plan", planName: "pro" },
};
```

## Best Practices

### ✅ DO:

- Check entitlements, not plan names
- Use descriptive entitlement names (`api_access`, not `feature_1`)
- Gate features at the component level for flexibility
- Add server-side checks for full page protection
- Provide clear upgrade messaging

### ❌ DON'T:

- Check if user is on "Pro Plan" (use entitlements instead)
- Hardcode plan names in feature code
- Skip server-side protection for sensitive pages
- Forget to handle loading and error states

## Examples

See these files for working examples:

- **Demo page:** `src/app/(protected)/pro-feature/page.tsx`
- **Feature gate:** `src/components/FeatureGate.tsx`
- **Upgrade prompt:** `src/components/UpgradePrompt.tsx`
- **Protected layout:** `src/app/(protected)/layout.tsx`

## Architecture

```
User Request
    ↓
Server-Side Check (requireAuth/requireEntitlement)
    ↓
Page Renders
    ↓
Client-Side Check (<FeatureGate>)
    ↓
Feature Unlocked or Upgrade Prompt
```

This two-layer approach provides:

- **Security:** Server-side checks prevent unauthorized access
- **UX:** Client-side gates provide smooth upgrade flows
- **Flexibility:** Easy to add/modify features

---

**Questions?** Check the code comments or refer to the existing examples in the codebase.
