# Your SaaS Boilerplate

A production-ready Next.js 14 SaaS boilerplate with authentication, billing, and multi-provider payments.

## Quick Start (10 minutes)

### 1. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` and add your API keys:

- `DATABASE_URL` - Your PostgreSQL connection string
- `AUTH_SECRET` - Generate a random 32+ character string
- `NEXTAUTH_URL` - Your app URL (http://localhost:3000 for dev)
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `RESEND_API_KEY` - From Resend Dashboard
- `EMAIL_FROM` - Your sender email (e.g., noreply@yourdomain.com)
- `NEXT_PUBLIC_APP_URL` - Your public app URL (same as NEXTAUTH_URL)
- **Payment Provider** (choose one):
  - Stripe: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PUBLISHABLE_KEY`
  - Razorpay: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- `PAYMENT_PROVIDER` - Set to `stripe` or `razorpay` (defaults to stripe)

See [docs/13-environment-variables.md](docs/13-environment-variables.md) for detailed instructions.

### 2. Install & Setup Database

**Supported Database Services (PostgreSQL):**

- [Supabase](https://supabase.com) - Recommended, free tier available
- [Neon](https://neon.tech) - Serverless, free tier available
- [Railway](https://railway.app) - Simple setup, pay-as-you-go
- [Vercel Postgres](https://vercel.com/storage/postgres) - Native Vercel integration

```bash
pnpm install
pnpm db:setup
```

### 3. Configure Payment Provider

**Option A: Stripe (Default)**

1. Create a product in [Stripe Dashboard](https://dashboard.stripe.com/) → Products
2. Add a monthly price (e.g., $29/month)
3. Copy the Price ID and run:
   ```bash
   node scripts/update-stripe-price.js pro price_xxxxxxxxxxxxx
   ```

**Option B: Razorpay**

1. Create a plan in [Razorpay Dashboard](https://dashboard.razorpay.com/) → Subscriptions → Plans
2. Set billing cycle and amount
3. Copy the Plan ID and run:
   ```bash
   node scripts/update-razorpay-plan.js pro plan_xxxxxxxxxxxxx
   ```
4. Set `PAYMENT_PROVIDER=razorpay` in `.env`

See [docs/03-payments.md](docs/03-payments.md) for complete payment provider setup.

### 4. Start Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Test the App

1. Click "Get Started" or "Sign In"
2. Sign in with Google or magic link
3. Explore the dashboard at `/product`
4. Check the billing page at `/billing`

## What's Included

| Feature              | Status   | Docs                                            |
| -------------------- | -------- | ----------------------------------------------- |
| Google OAuth         | ✅ Ready | [01-auth.md](docs/01-auth.md)                   |
| Magic Links          | ✅ Ready | [01-auth.md](docs/01-auth.md)                   |
| Subscriptions        | ✅ Ready | [03-payments.md](docs/03-payments.md)           |
| Stripe & Razorpay    | ✅ Ready | [03-payments.md](docs/03-payments.md)           |
| Plans & Entitlements | ✅ Ready | [04-entitlements.md](docs/04-entitlements.md)   |
| Email System         | ✅ Ready | [05-email.md](docs/05-email.md)                 |
| Landing Pages        | ✅ Ready | [07-landing-pages.md](docs/07-landing-pages.md) |
| Paywalls             | ✅ Ready | [08-paywalls.md](docs/08-paywalls.md)           |
| Protected Routes     | ✅ Ready | [09-app-pages.md](docs/09-app-pages.md)         |
| SEO                  | ✅ Ready | [06-seo.md](docs/06-seo.md)                     |
| Database             | ✅ Ready | [02-database.md](docs/02-database.md)           |
| Dark Mode            | ✅ Ready | [15-theme.md](docs/15-theme.md)                 |
| AI Infrastructure    | ✅ Ready | [16-ai-setup.md](docs/16-ai-setup.md)           |

## Project Structure

```
src/
├── app/
│   ├── (protected)/     # Auth-required pages (dashboard, billing)
│   ├── api/             # API routes
│   ├── auth/            # Login pages
│   └── ...              # Landing pages (home, pricing, contact, etc.)
├── components/
│   ├── landing/         # Landing page sections
│   ├── product/         # Your product components (editable)
│   └── ui/              # shadcn/ui components
├── emails/              # Email templates
├── hooks/               # React hooks
├── lib/                 # Core utilities
└── docs/                # Documentation
```

## File Markers

Files are marked at the top:

- **🔒 CORE SYSTEM - DO NOT MODIFY**: Critical boilerplate. Don't edit.
- **🏗️ USER EDITABLE**: Safe to customize. Build your product here.

## Build Your Product

Your code goes here:

| Location                    | Purpose            |
| --------------------------- | ------------------ |
| `/app/(protected)/product/` | Your dashboard     |
| `/components/product/`      | Your UI components |
| `/app/api/`                 | Your API routes    |

### Example: Adding a Feature

1. Create a component:

   ```typescript
   // /components/product/MyFeature.tsx
   export function MyFeature() {
     return <div>My Feature</div>;
   }
   ```

2. Add to dashboard:

   ```typescript
   // /app/(protected)/product/page.tsx
   import { MyFeature } from "@/components/product/MyFeature";
   ```

3. Gate behind paywall (optional):
   ```typescript
   <FeatureGate entitlement="pro_features">
     <MyFeature />
   </FeatureGate>
   ```

## Paywall Example

```typescript
import { FeatureGate } from "@/components/FeatureGate";

export default function Dashboard() {
  return (
    <div>
      <FreeContent />

      <FeatureGate entitlement="pro_features">
        <PremiumContent />  {/* Only shown to Pro users */}
      </FeatureGate>
    </div>
  );
}
```

## Available Entitlements

| Entitlement        | Plan | Usage             |
| ------------------ | ---- | ----------------- |
| `basic_access`     | Free | Basic dashboard   |
| `pro_features`     | Pro  | Advanced features |
| `api_access`       | Pro  | API access        |
| `priority_support` | Pro  | Priority support  |

## Commands

```bash
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm db:setup         # Setup database (generate + push + seed)
pnpm db:studio        # Open Prisma Studio

# Update payment provider plan IDs
node scripts/update-stripe-price.js pro price_xxx      # Stripe
node scripts/update-razorpay-plan.js pro plan_xxx      # Razorpay
```

## Documentation

Full documentation is in the `/docs` folder:

- [00-overview.md](docs/00-overview.md) - Project overview
- [01-auth.md](docs/01-auth.md) - Authentication system
- [02-database.md](docs/02-database.md) - Database schema
- [03-payments.md](docs/03-payments.md) - Payment integration quick start
- [04-entitlements.md](docs/04-entitlements.md) - Feature gating
- [05-email.md](docs/05-email.md) - Email system
- [06-seo.md](docs/06-seo.md) - SEO configuration
- [07-landing-pages.md](docs/07-landing-pages.md) - Marketing pages
- [08-paywalls.md](docs/08-paywalls.md) - Paywall implementation
- [09-app-pages.md](docs/09-app-pages.md) - Protected routes
- [10-product-features.md](docs/10-product-features.md) - Building features
- [11-deployment.md](docs/11-deployment.md) - Production deployment
- [12-seeding.md](docs/12-seeding.md) - Database seeding
- [13-environment-variables.md](docs/13-environment-variables.md) - All env vars
- [14-error-tracking.md](docs/14-error-tracking.md) - Error tracking (optional)
- [15-theme.md](docs/15-theme.md) - Dark mode & theming
- [16-ai-setup.md](docs/16-ai-setup.md) - AI infrastructure (optional)

## Deployment

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

See [11-deployment.md](docs/11-deployment.md) for detailed instructions.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js v4
- **Payments**: Stripe & Razorpay (switchable)
- **Email**: Resend
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI, Anthropic, Gemini (optional)
- **Error Tracking**: Sentry (optional)

## Support

- Check the `/docs` folder for detailed documentation
- Review example implementations in the codebase
- Look for 🏗️ USER EDITABLE markers for safe customization points

**Built for serious SaaS founders who want to ship, not tinker.**
