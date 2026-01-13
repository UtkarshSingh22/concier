# 🚀 START HERE - Get Your SaaS Live in 10 Minutes

## Do This → You're Live

### 1. Setup Environment (2 minutes)

```bash
cp .env.example .env
# Edit .env and add your API keys:
# - AUTH_SECRET (generate random string)
# - GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET (from Google OAuth - add redirect URI: https://yourdomain.com/api/auth/callback/google)
# - DATABASE_URL (your PostgreSQL connection string)
# - STRIPE_SECRET_KEY & STRIPE_WEBHOOK_SECRET (from Stripe dashboard)
# - RESEND_API_KEY (from Resend)
```

### 2. Install & Setup Database (3 minutes)

```bash
pnpm install
pnpm db:setup
```

### 3. Start Development Server (1 minute)

```bash
pnpm dev
```

### 4. Test First Payment (4 minutes)

- Open [http://localhost:3000](http://localhost:3000)
- Click login → Sign in with Google or Email
- Click "Upgrade" → Complete Stripe checkout
- **You just got your first payment!** 🎉

### 5. Deploy to Vercel (2 minutes)

- Push to GitHub
- Connect to Vercel
- Deploy
- Your SaaS is live and charging customers

## 🏗️ Build Your Product

**Edit ONLY the `/product` folder.** Everything else is protected boilerplate.

- `/product/dashboard` - Add your dashboard pages
- `/product/api` - Add your API routes
- `/product/ui` - Add your UI components

The boilerplate handles:

- ✅ User authentication
- ✅ Stripe payments & subscriptions
- ✅ Paywall protection
- ✅ Database & email

**You focus on building your product.**

## 🔐 Authentication

Authentication is powered by Auth.js (NextAuth v5) using Google OAuth and Email Magic Links only.

- **Google OAuth**: One-click sign-in with Google accounts
- **Email Magic Links**: Passwordless authentication via Resend
- **Secure**: Enterprise-grade security with proper session management

## 🎨 UI Foundation

This boilerplate ships with shadcn/ui and lucide-react to provide a clean baseline UI. You are free to modify or remove these components.

- **shadcn/ui components**: Button, Input, Card, Separator, Sonner (toast notifications)
- **Icons**: lucide-react for consistent iconography

## 🔧 Need Help?

The golden path above works. If something breaks, check:

1. API keys are correct in `.env`
2. Database is running and accessible
3. Stripe webhook endpoint is configured (boilerplate handles this)

## 🎯 Philosophy

This boilerplate is opinionated. No tutorials, no options, no teaching. Just working code that gets you paid fast.
