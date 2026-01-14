# 🚀 Swift Deploy - Get Your Saas Live in 10 Minutes

**Deploy your SaaS application in minutes with authentication, payments, and modern UI.**

## ⚡ Quick Start

### 1. Environment Setup (2 minutes)

```bash
cp .env.example .env
# Edit .env and add your API keys:
# - AUTH_SECRET (generate random string)
# - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET (from Google OAuth - add redirect URI: https://yourdomain.com/api/auth/callback/google)
# - DATABASE_URL (your PostgreSQL connection string)
# - STRIPE_SECRET_KEY & STRIPE_WEBHOOK_SECRET (from Stripe dashboard)
# - RESEND_API_KEY (from Resend for email)
```

**Note**: This project requires Node.js 20.9.0+.

### 2. Install & Setup Database (3 minutes)

```bash
pnpm install
pnpm db:setup
```

### 2.5. Configure Stripe (5 minutes)

1. **Create Stripe Products & Prices:**
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Navigate to **Products** → **Create product**
   - Name: "Pro Plan", Price: $29/month
   - Copy the **Price ID** (looks like `price_1AbCdEfGhIjKlMnOpQrSt`)

2. **Update Database:**
   - Use the update script
     ```bash
     pnpm stripe:update-price pro YOUR_PRICE_ID
     # Example: pnpm stripe:update-price pro price_1AbCdEfGhIjKlMnOpQrSt
     ```

3. **Configure Webhooks:**
   - In Stripe Dashboard → **Webhooks**
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **webhook secret** to `STRIPE_WEBHOOK_SECRET`

### 3. Start Development Server (1 minute)

```bash
pnpm dev
```

### 4. Test Authentication (4 minutes)

- Open [http://localhost:3000](http://localhost:3000)
- Click "Continue with Google" or "Send magic link"
- Complete authentication flow
- **Your Swift Deploy app is working!** 🎉

### 5. Deploy to Production (2 minutes)

- Push to GitHub
- Connect to Vercel
- Deploy
- Your SaaS is live with authentication

## 🏗️ Build Your Product

**Edit ONLY the `/product` folder.** Everything else is protected boilerplate.

- `/src/app/product/page.tsx` - Your main product dashboard
- `/src/app/product/api/` - Add your API routes
- `/src/components/product/` - Add your UI components

### Paywall Protection Example

```typescript
// Protect a route with entitlements
import { requireEntitlement } from "@/lib/auth-utils";

export default async function ProFeaturePage() {
  const user = await requireEntitlement("pro_features");
  // User has pro_features entitlement, show premium content
  return <div>Premium feature content</div>;
}

// Check entitlements without redirecting
import { hasEntitlement } from "@/lib/auth-utils";

export default async function Dashboard() {
  const hasProAccess = await hasEntitlement("pro_features");

  return (
    <div>
      <h1>Dashboard</h1>
      {hasProAccess ? (
        <ProFeatures />
      ) : (
        <UpgradePrompt />
      )}
    </div>
  );
}
```

The boilerplate handles:

- ✅ **Authentication**: Google OAuth + Email Magic Links
- ✅ **Database**: PostgreSQL with Prisma ORM
- ✅ **Email**: Passwordless auth via Resend
- ✅ **UI**: Modern design with shadcn/ui + Tailwind
- ✅ **Security**: Enterprise-grade session management

**You focus on building your product features.**

## 💳 Subscription Management

Swift Deploy includes a complete subscription system:

- **Plans & Entitlements**: Flexible permission system
- **Stripe Integration**: Secure payment processing
- **Subscription Dashboard**: `/product/subscription` for billing management
- **Webhook Sync**: Automatic entitlement updates
- **Upgrade Flow**: One-click subscription upgrades

### Adding New Plans

1. **Create Stripe Price** in Stripe Dashboard
2. **Add to Database Seed** (`prisma/seed.ts`)
3. **Link Entitlements** in the seed script
4. **Update UI** to show new plan options

The system automatically handles billing, webhooks, and entitlement management.

## 🔐 Authentication System

Swift Deploy uses NextAuth.js v4 with secure, modern authentication:

- **Google OAuth**: One-click sign-in with Google accounts
- **Email Magic Links**: Passwordless authentication via Resend
- **Account Linking**: Seamless linking between Google and email accounts
- **Session Management**: JWT-based sessions with automatic renewal
- **Security**: CSRF protection, secure cookies, rate limiting

## 🎨 UI & Design

Clean, professional SaaS design with modern components:

- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with dark mode support
- **Components**: shadcn/ui (Button, Input, Card, Separator, Sonner toasts)
- **Icons**: Lucide React for consistent iconography
- **Typography**: Geist Sans font family
- **Responsive**: Mobile-first design

## 🔧 Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Authentication**: NextAuth.js v4
- **Database**: PostgreSQL + Prisma ORM
- **Email**: Resend API
- **Deployment**: Vercel-ready
- **Development**: Turbopack for fast builds

## 🚀 Deployment

Swift Deploy deploys seamlessly to Vercel:

1. **Push to GitHub**
2. **Connect Vercel** to your repository
3. **Configure environment variables** in Vercel dashboard
4. **Deploy** - your SaaS is live!

## 🔧 Troubleshooting

If something doesn't work:

1. **Check `.env`** - All API keys must be set correctly
2. **Database connection** - Ensure PostgreSQL is running
3. **Google OAuth** - Verify redirect URI in Google Cloud Console
4. **Email delivery** - Check Resend dashboard for email logs

## 🎯 Philosophy

Swift Deploy is opinionated and production-ready. No tutorials, no choices, no learning curve. Just working code that gets you deployed fast.

**Built for serious SaaS founders who want to ship, not tinker.**
