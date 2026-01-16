# Deployment

The boilerplate is ready for deployment to Vercel.

## Prerequisites

Before deploying:

- [ ] Stripe products and prices created
- [ ] Database hosted (e.g., Supabase, Railway, Neon)
- [ ] Google OAuth configured with production redirect URI
- [ ] Resend API key ready

## Environment Variables

Set these in your hosting platform:

```
# Required
DATABASE_URL=postgresql://...
AUTH_SECRET=your-random-32-char-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com

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

2. **Configure Stripe Webhook**:
   - Stripe Dashboard → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

3. **Run Database Migration**:

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Update Stripe Price IDs**:
   ```bash
   pnpm stripe:update-price pro price_live_xxxxx
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
- [ ] Stripe prices linked to database
- [ ] Stripe webhook configured
- [ ] Google OAuth redirect URI updated
- [ ] Test login flow
- [ ] Test subscription flow
- [ ] Test email delivery

### After Launch

- [ ] Monitor Stripe webhook logs
- [ ] Check error logging
- [ ] Test magic link emails
- [ ] Verify SEO (sitemap, robots.txt)

## Stripe Live Mode

When moving to production:

1. Switch from test keys to live keys:

   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   ```

2. Create live products in Stripe Dashboard

3. Update price IDs in database:

   ```bash
   pnpm stripe:update-price pro price_live_xxxxx
   ```

4. Configure live webhook endpoint

## Troubleshooting

### Webhook Failures

- Check Stripe Dashboard → Developers → Webhooks → Logs
- Verify webhook secret is correct
- Ensure endpoint URL is correct

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
