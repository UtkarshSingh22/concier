# SaaS Boilerplate

Production-ready SaaS boilerplate for serious indie hackers.

**Add API keys → deploy → start charging customers.**

## 🚀 START HERE

**→ [START_HERE.md](START_HERE.md) - Follow this to get live in 10 minutes**

## Quick Setup

```bash
cp .env.example .env  # Add your API keys
pnpm install
pnpm db:setup
pnpm dev
```

Open [localhost:3000](http://localhost:3000) → Login → Upgrade → **First payment received** 🎉

## 📁 Folder Structure

### DO NOT TOUCH (boilerplate handles these)

- `/auth` - Authentication pages
- `/billing` - Billing management
- `/pricing` - Pricing pages
- `/api/stripe` - Stripe webhooks and API routes

### 🏗️ BUILD HERE (your product)

- `/product` - **Build your SaaS product here**
  - `/dashboard` - User dashboard
  - `/api` - Your product API routes
  - `/ui` - Reusable UI components

## 🔧 Tech Stack

- **Next.js** (App Router)
- **PostgreSQL** (Prisma ORM)
- **Auth.js** (OAuth: Google + GitHub)
- **Stripe** (Billing & subscriptions)
- **Resend** (Email)
- **Vercel** (Deployment)

## 🛠️ Setup

1. **Environment Variables**

   ```bash
   cp .env.example .env
   # Add your API keys
   ```

2. **Database Setup**

   ```bash
   pnpm db:setup
   ```

3. **Development**
   ```bash
   pnpm dev
   ```

## 📋 What's Included

✅ Authentication (OAuth Google + GitHub)  
✅ Database schema & migrations  
✅ Billing & subscriptions  
✅ Paywall / access control  
✅ Webhooks & entitlements  
✅ Email sending  
✅ Deployment ready

## 🎯 Philosophy

**Opinionated > flexible**  
**Shipping > teaching**  
**Confidence > customization**

This boilerplate handles everything around your product. You build the product itself.

## 🚀 Deploy

Ready for Vercel deployment. Just connect your repo and deploy.
