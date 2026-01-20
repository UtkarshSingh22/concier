# Overview

This is a production-ready Next.js 14 SaaS boilerplate. Everything you need to launch a paid SaaS product is already implemented.

## What's Included

| Feature              | Status   | Location                                |
| -------------------- | -------- | --------------------------------------- |
| Authentication       | ✅ Ready | `/lib/auth.ts`, `/app/auth/`            |
| Google OAuth         | ✅ Ready | Built into auth system                  |
| Magic Links          | ✅ Ready | `/api/auth/magic-link/`                 |
| Subscriptions        | ✅ Ready | `/lib/payments/`, `/api/payments/`      |
| Stripe & Razorpay    | ✅ Ready | Multi-provider support                  |
| Plans & Entitlements | ✅ Ready | Database schema, `/lib/auth-utils.ts`   |
| PostgreSQL + Prisma  | ✅ Ready | `/prisma/schema.prisma`                 |
| Email System         | ✅ Ready | `/lib/email.ts`, `/emails/`             |
| Landing Pages        | ✅ Ready | `/app/page.tsx`, `/components/landing/` |
| Paywalls             | ✅ Ready | `/components/FeatureGate.tsx`           |
| SEO                  | ✅ Ready | `/lib/seo.ts`, sitemap, robots          |
| Protected Routes     | ✅ Ready | `/app/(protected)/`                     |
| AI Infrastructure    | ✅ Ready | `/lib/ai/`, multi-provider support      |

## Folder Structure

```
src/
├── app/
│   ├── (protected)/          # Auth-required pages
│   │   ├── billing/          # Subscription management
│   │   ├── product/          # Your dashboard
│   │   └── pro-feature/      # Demo paywall page
│   ├── api/                  # API routes
│   ├── auth/                 # Login pages
│   ├── contact/              # Contact form
│   ├── pricing/              # Pricing page
│   ├── privacy/              # Privacy policy
│   ├── terms/                # Terms of service
│   └── page.tsx              # Landing page
├── components/
│   ├── landing/              # Landing page sections
│   ├── ui/                   # shadcn/ui components
│   └── ...                   # Shared components
├── emails/                   # Email templates
├── hooks/                    # React hooks
├── lib/                      # Core utilities
└── prisma/                   # Database schema
```

## File Markers

Files are marked with comments at the top:

- **🔒 CORE SYSTEM - DO NOT MODIFY**: Critical boilerplate code. Editing may break core functionality.
- **🏗️ USER EDITABLE**: Safe to customize. This is where you build your product.

## Quick Start

1. Copy `.env.example` to `.env`
2. Fill in your API keys (see [13-environment-variables.md](13-environment-variables.md))
3. Run `pnpm install`
4. Run `pnpm db:setup` (see [12-seeding.md](12-seeding.md))
5. Run `pnpm dev`

See `START_HERE.md` for detailed setup instructions.

## Where to Build Your Product

All your custom code goes in:

- `/app/(protected)/product/` - Your main dashboard
- `/components/product/` - Your UI components
- Add new API routes in `/app/api/`

Scaffold handles authentication, billing, and infrastructure. You focus on building features.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma
- **Auth**: NextAuth.js v4
- **Payments**: Stripe & Razorpay (switchable)
- **Email**: Resend
- **Styling**: Tailwind CSS + shadcn/ui
- **Deployment**: Vercel-ready
- **AI**: OpenAI, Anthropic, Gemini (optional)

## Documentation Index

| Doc                                                        | Topic                               |
| ---------------------------------------------------------- | ----------------------------------- |
| [01-auth.md](01-auth.md)                                   | Authentication (OAuth, Magic Links) |
| [02-database.md](02-database.md)                           | Database schema and Prisma          |
| [03-payments.md](03-payments.md)                           | Payment providers (Stripe/Razorpay) |
| [04-entitlements.md](04-entitlements.md)                   | Feature gating system               |
| [05-email.md](05-email.md)                                 | Email templates and sending         |
| [06-seo.md](06-seo.md)                                     | SEO, sitemap, robots.txt            |
| [07-landing-pages.md](07-landing-pages.md)                 | Marketing pages                     |
| [08-paywalls.md](08-paywalls.md)                           | Paywall implementation              |
| [09-app-pages.md](09-app-pages.md)                         | Protected app routes                |
| [10-product-features.md](10-product-features.md)           | Building your product               |
| [11-deployment.md](11-deployment.md)                       | Production deployment               |
| [12-seeding.md](12-seeding.md)                             | Database seeding                    |
| [13-environment-variables.md](13-environment-variables.md) | All environment variables           |
| [14-error-tracking.md](14-error-tracking.md)               | Sentry error tracking (optional)    |
| [15-theme.md](15-theme.md)                                 | Dark mode and theming               |
| [16-ai-setup.md](16-ai-setup.md)                           | AI infrastructure (optional)        |
