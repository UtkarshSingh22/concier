# Deployment

ZeroDrag is ready for deployment to Vercel.

## Prerequisites

Before deploying:

- [ ] Payment provider products/plans created (Stripe prices or Razorpay plans)
- [ ] Database hosted (e.g., Supabase, Railway, Neon)
- [ ] Google OAuth configured with production redirect URI
- [ ] Resend API key ready
- [ ] Payment provider webhook configured

## Environment Variables

Set these in your hosting platform:

```bash
# Required
DATABASE_URL=postgresql://...
AUTH_SECRET=your-random-32-char-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

# Payment Provider (choose one)
PAYMENT_PROVIDER=stripe  # or "razorpay"

# Stripe (if using Stripe)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...

# Razorpay (if using Razorpay)
# RAZORPAY_KEY_ID=rzp_live_...
# RAZORPAY_KEY_SECRET=...
# RAZORPAY_WEBHOOK_SECRET=...

# Optional - AI Providers
# OPENAI_API_KEY=sk-...
# ANTHROPIC_API_KEY=sk-ant-...
# GEMINI_API_KEY=AIzaSy...

# Optional - Error Tracking
# SENTRY_DSN=https://...
# NEXT_PUBLIC_SENTRY_DSN=https://...
```

## Vercel Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/you/your-repo.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables
5. Deploy

### 3. Post-Deployment

1. **Update Google OAuth**:
   - Go to Google Cloud Console
   - Add production redirect URI: `https://yourdomain.com/api/auth/callback/google`

2. **Configure Payment Provider Webhooks**:

   **For Stripe:**
   - Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook/stripe`
   - Select events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

   **For Razorpay:**
   - Generate a secure webhook secret (see [payments.md](payments.md) for generation options)
   - Razorpay Dashboard → Settings → Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook/razorpay`
   - Use your generated secret as the webhook secret in Razorpay
   - Select events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.failed`
   - Add the same secret to `RAZORPAY_WEBHOOK_SECRET` in your environment variables

3. **Connect to Production Database Locally**:

   Update your local `.env` to point to production temporarily:

   ```bash
   # Save your local DATABASE_URL first!
   DATABASE_URL="your-production-database-url"
   ```

4. **Run Database Migration & Seed**:

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

   This will:
   - Create all tables
   - Seed default plans (free, pro)
   - Create admin user
   - Link entitlements to plans

5. **Update Payment Provider Plan IDs**:

   **For Stripe:**

   ```bash
   node scripts/update-stripe-price.js pro price_live_xxxxx
   ```

   **For Razorpay:**

   ```bash
   node scripts/update-razorpay-plan.js pro plan_live_xxxxx
   ```

6. **Restore Local Database URL**:

   ```bash
   # Switch back to local database
   DATABASE_URL="postgresql://localhost:5432/saas"
   ```

## Database Hosting Options

### Supabase (Recommended)

- Free tier available
- Postgres compatible
- Easy setup

### Neon

- Serverless Postgres
- Free tier available
- Auto-scaling

### Railway

- Simple setup
- Pay-as-you-go

### PlanetScale

- MySQL (requires schema changes)
- Generous free tier

## Domain Setup

1. Add custom domain in Vercel
2. Update DNS records
3. Update environment variables:
   - `NEXT_PUBLIC_APP_URL`
   - `NEXTAUTH_URL`
4. Update Google OAuth redirect URI
5. Update Stripe webhook URL

## Production Checklist

### Before Launch

- [ ] Environment variables set
- [ ] Database migrated and seeded
- [ ] Payment provider plan IDs linked to database
- [ ] Payment provider webhooks configured
- [ ] Google OAuth redirect URI updated
- [ ] Test login flow
- [ ] Test subscription flow
- [ ] Test email delivery
- [ ] Verify payment provider is working (test mode first)

### After Launch

- [ ] Monitor payment provider webhook logs
- [ ] Check error logging (Sentry if configured)
- [ ] Test magic link emails
- [ ] Verify SEO (sitemap, robots.txt)
- [ ] Monitor subscription creation and cancellation flows

## Payment Provider Live Mode

When moving to production:

### Stripe Live Mode

1. Switch from test keys to live keys:

   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

2. Create live products in Stripe Dashboard

3. Update price IDs in production database:

   ```bash
   node scripts/update-stripe-price.js pro price_live_xxxxx
   ```

4. Configure live webhook endpoint

### Razorpay Live Mode

1. Switch from test keys to live keys:

   ```bash
   RAZORPAY_KEY_ID=rzp_live_...
   RAZORPAY_KEY_SECRET=your-live-secret
   ```

2. Create live plans in Razorpay Dashboard

3. Update plan IDs in production database:

   ```bash
   node scripts/update-razorpay-plan.js pro plan_live_xxxxx
   ```

4. Configure live webhook endpoint

## Troubleshooting

### Webhook Failures

**For Stripe:**

- Check Stripe Dashboard → Developers → Webhooks → Logs
- Verify `STRIPE_WEBHOOK_SECRET` is correct
- Ensure endpoint URL is `https://yourdomain.com/api/payments/webhook/stripe`

**For Razorpay:**

- Check Razorpay Dashboard → Webhooks → Logs
- Verify `RAZORPAY_WEBHOOK_SECRET` is correct
- Ensure endpoint URL is `https://yourdomain.com/api/payments/webhook/razorpay`

### Auth Issues

- Verify `AUTH_SECRET` is set
- Check Google OAuth redirect URI matches exactly
- Verify `NEXTAUTH_URL` matches your domain

### Database Issues

- Check `DATABASE_URL` connection string
- Ensure database is accessible from Vercel
- Run `prisma db push` if schema is out of sync

### Email Issues

- Verify Resend API key
- Check Resend dashboard for delivery logs
- Ensure sender domain is verified

## Monitoring

Consider adding:

- Error tracking (Sentry)
- Analytics (Vercel Analytics, PostHog)
- Uptime monitoring (Better Uptime, Checkly)
