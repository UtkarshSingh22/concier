# App Pages

App pages are the authenticated parts of your application where users interact with your product.

## Protected Route Structure

All authenticated pages live in `/app/(protected)/`:

```
src/app/(protected)/
├── layout.tsx        # Auth check wrapper
├── billing/
│   ├── layout.tsx    # Billing metadata
│   └── page.tsx      # Subscription management
├── product/
│   └── page.tsx      # Main dashboard
└── pro-feature/
    └── page.tsx      # Demo paywall page
```

## How Protection Works

The layout at `/app/(protected)/layout.tsx` calls `requireAuth()`:

```typescript
export default async function ProtectedLayout({ children }) {
  await requireAuth();  // Redirects to /auth if not logged in
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}
```

All pages inside `(protected)/` automatically inherit this check.

## Existing Pages

### Product Dashboard (`/product`)

**Location**: `/app/(protected)/product/page.tsx`

This is your main dashboard. Currently shows:
- User info
- Email test button
- Placeholder content

**This is where you build your product.**

### Billing Page (`/billing`)

**Location**: `/app/(protected)/billing/page.tsx`

Shows:
- Current subscription plan
- Entitlements list
- Upgrade options
- Refresh button

**Don't modify** - This is core billing functionality.

### Pro Feature Demo (`/pro-feature`)

**Location**: `/app/(protected)/pro-feature/page.tsx`

Demonstrates paywall usage:
- Gated feature (requires `pro_features`)
- Free feature (always visible)

Use this as a reference for your own paywalls.

## Adding New Pages

### Basic Protected Page

1. Create folder and page:
   ```
   /app/(protected)/your-page/page.tsx
   ```

2. Add content:
   ```typescript
   import Header from "@/components/Header";
   import { createStaticPageMetadata } from "@/lib/seo";

   export const metadata = createStaticPageMetadata(
     "Your Page",
     "Page description"
   );

   export default function YourPage() {
     return (
       <div className="min-h-screen bg-gray-50">
         <Header />
         <main className="max-w-7xl mx-auto py-6 px-4">
           <h1>Your Page</h1>
         </main>
       </div>
     );
   }
   ```

### Page with Entitlement Check

```typescript
import { requireEntitlement } from "@/lib/auth-utils";
import Header from "@/components/Header";

export default async function ProPage() {
  await requireEntitlement("pro_features");  // Redirects if missing
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>Pro-only content</main>
    </div>
  );
}
```

### Page with Inline Paywalls

```typescript
import Header from "@/components/Header";
import { FeatureGate } from "@/components/FeatureGate";

export default function MixedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 px-4">
        <FreeSection />
        
        <FeatureGate entitlement="pro_features">
          <ProSection />
        </FeatureGate>
      </main>
    </div>
  );
}
```

## Header Component

Use the `Header` component for consistent navigation:

```typescript
import Header from "@/components/Header";
```

It includes:
- Logo/brand link to `/product`
- Billing link (or back button when on billing)
- User avatar and name
- Sign out button

## Page Patterns

### Consistent Layout

```tsx
<div className="min-h-screen bg-gray-50">
  <Header />
  <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    <div className="px-4 py-6 sm:px-0">
      {/* Your content */}
    </div>
  </main>
</div>
```

### With Cards

```tsx
<main className="max-w-7xl mx-auto py-6 px-4">
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
    </CardHeader>
    <CardContent>
      Content here
    </CardContent>
  </Card>
</main>
```

## What You Should Build Here

- Your product dashboard in `/product`
- Additional feature pages
- Settings pages
- Any authenticated user experiences

## What NOT to Change

- `/app/(protected)/layout.tsx` - Auth wrapper
- `/app/(protected)/billing/` - Billing system
- The auth check pattern

