# Getting Started

This codebase provides production-ready infrastructure for web applications. It handles authentication, payments, and feature gating so you can focus on building your product.

## Mental Model

Think of this codebase as having three layers:

### 1. Core Infrastructure (Keep as-is)

Authentication, payments, database schema, and system integrations. These are battle-tested and work together seamlessly.

### 2. Example/Marketing Code (Remove or replace)

Landing pages, pricing pages, and demo components. These show how to use the infrastructure but aren't your actual product.

### 3. Your Application Code (Build here)

Your dashboard, API routes, and custom components. This is where you add business logic.

## What You'll Customize

### Files to Edit

- `/app/(protected)/product/` - Your main application pages
- `/components/product/` - Your UI components
- `/app/api/` - Your API routes (add new ones, don't modify existing)
- `/prisma/schema.prisma` - Database schema extensions

### Files to Keep

- `/lib/` - Core utilities and integrations
- `/components/ui/` - Design system components
- `/components/FeatureGate.tsx` - Paywall component
- All authentication and payment routes

### Files to Remove

- Marketing content you don't need
- Example components once you understand the patterns
- Unused email templates

## Development Workflow

1. **Setup environment** (see below)
2. **Explore the example** - Login, view dashboard, test payments
3. **Replace marketing pages** with your branding
4. **Build in `/app/(protected)/product/`** - Your main application
5. **Add API routes** in `/app/api/` as needed
6. **Gate features** with `FeatureGate` components

## Quick Setup

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Add required API keys (see docs/environment-variables.md)
# - Database URL (Supabase, Neon, etc.)
# - Auth secrets (Google OAuth, email provider)
# - Payment provider keys (Stripe or Razorpay)

# 3. Install dependencies
pnpm install

# 4. Setup database
pnpm db:setup

# 5. (Optional) Setup payments
# All core features work after completing the Quick Setup steps above.
# Payments will not work by default - complete this step to enable them.
#
# Choose one payment provider (Stripe or Razorpay), create a subscription plan,
# and save the Plan ID in the database.
#
# See docs/payment-setup.md for step-by-step instructions.

# 6. Start development
pnpm dev
```

Visit `http://localhost:3000` and explore the working example.

## Common Patterns

### Adding a Protected Page

```typescript
// /app/(protected)/my-feature/page.tsx
import { requireAuth } from "@/lib/auth-utils";

export default async function MyFeaturePage() {
  const user = await requireAuth();
  return <div>My feature for {user.email}</div>;
}
```

### Gating a Feature

```typescript
import { FeatureGate } from "@/components/FeatureGate";

<FeatureGate entitlement="pro_features">
  <PremiumFeature />
</FeatureGate>
```

### Adding an API Route

```typescript
// /app/api/my-endpoint/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response("Unauthorized", { status: 401 });

  // Your logic here
  return Response.json({ data: "..." });
}
```

## Documentation

- [Authentication & sessions](docs/auth.md)
- [Database & data access](docs/database.md)
- [Payment setup](docs/payment-setup.md)
- [Payments & billing](docs/payments.md)
- [Feature gating](docs/entitlements.md)
- [UI components](docs/ui-components.md)
- [Email system](docs/email.md)
- [Deployment](docs/deployment.md)
