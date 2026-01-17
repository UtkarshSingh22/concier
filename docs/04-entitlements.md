# Entitlements

Entitlements are feature flags that control access to parts of your app. Users get entitlements through their subscription plan.

## Why Entitlements (Not Plans)

Check entitlements, not plan names:

```typescript
// ✅ Good - check entitlement
if (hasEntitlement("api_access")) { ... }

// ❌ Bad - check plan name
if (user.plan === "pro") { ... }
```

Benefits:

- Add/remove features from plans without code changes
- Multiple plans can share entitlements
- More granular control

## Default Entitlements

| Name               | Display Name     | Plans     |
| ------------------ | ---------------- | --------- |
| `basic_access`     | Basic Access     | Free, Pro |
| `pro_features`     | Pro Features     | Pro       |
| `api_access`       | API Access       | Pro       |
| `priority_support` | Priority Support | Pro       |
| `ai_access`        | AI Access        | Pro       |

## Server-Side Checks

```typescript
import { requireEntitlement, hasEntitlement } from "@/lib/auth-utils";

// Redirect if missing (for full pages)
export default async function ProPage() {
  await requireEntitlement("pro_features");
  return <ProContent />;
}

// Check without redirect (for conditional UI)
export default async function Dashboard() {
  const hasPro = await hasEntitlement("pro_features");
  return hasPro ? <ProDashboard /> : <FreeDashboard />;
}
```

## Client-Side Checks

Use the `FeatureGate` component:

```tsx
import { FeatureGate } from "@/components/FeatureGate";

<FeatureGate entitlement="api_access">
  <ApiKeyGenerator /> {/* Only shown if user has api_access */}
</FeatureGate>;
```

Or use the hook directly:

```typescript
import { useEntitlements } from "@/hooks/use-entitlements";

function MyComponent() {
  const { hasEntitlement, loading } = useEntitlements();

  if (loading) return <Spinner />;
  if (!hasEntitlement("pro_features")) return <UpgradePrompt />;

  return <ProFeature />;
}
```

## Key Files

| File                              | Purpose                        |
| --------------------------------- | ------------------------------ |
| `/lib/auth-utils.ts`              | Server-side entitlement checks |
| `/hooks/use-entitlements.ts`      | Client-side hook               |
| `/components/FeatureGate.tsx`     | UI gating component            |
| `/components/UpgradePrompt.tsx`   | Upgrade prompt UI              |
| `/api/user/entitlements/route.ts` | Entitlements API               |

## Adding New Entitlements

1. Add to `/prisma/seed.ts`:

   ```typescript
   prisma.entitlement.upsert({
     where: { name: "your_feature" },
     create: {
       name: "your_feature",
       displayName: "Your Feature",
       description: "What it does",
     },
   });
   ```

2. Link to plan in seed script

3. Run `pnpm db:seed`

4. Update `PLAN_REQUIREMENTS` in `/components/UpgradePrompt.tsx`:

   ```typescript
   const PLAN_REQUIREMENTS = {
     your_feature: { name: "Pro Plan", planName: "pro" },
   };
   ```

5. Use in code:
   ```tsx
   <FeatureGate entitlement="your_feature">
     <YourFeature />
   </FeatureGate>
   ```

## FeatureGate Props

| Prop          | Type      | Description                      |
| ------------- | --------- | -------------------------------- |
| `entitlement` | string    | Required entitlement name        |
| `fallback`    | ReactNode | Custom UI when locked (optional) |
| `children`    | ReactNode | Content shown when unlocked      |

## UpgradePrompt Props

| Prop          | Type   | Description                   |
| ------------- | ------ | ----------------------------- |
| `entitlement` | string | Entitlement that's required   |
| `title`       | string | Custom title (optional)       |
| `description` | string | Custom description (optional) |
| `buttonText`  | string | Custom button text (optional) |

## What You Can Edit

- `/components/FeatureGate.tsx` - Customize loading/locked states
- `/components/UpgradePrompt.tsx` - Customize upgrade messaging
- `PLAN_REQUIREMENTS` mapping in UpgradePrompt

## What NOT to Change

- `/lib/auth-utils.ts` - Core entitlement logic
- `/hooks/use-entitlements.ts` - Client hook logic
- The entitlement → plan relationship structure
