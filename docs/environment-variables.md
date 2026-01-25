# Environment Variables

Complete list of all environment variables used by the application.

## Quick Reference

```bash
# Copy to .env and fill in values
cp .env.example .env
```

## Required Variables

These must be set for the app to function:

### Database

| Variable       | Description                  | Example                               |
| -------------- | ---------------------------- | ------------------------------------- |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |

**How to get DATABASE_URL:**

| Provider | Instructions                                                                 |
| -------- | ---------------------------------------------------------------------------- |
| Supabase | Go to **Supabase Project -> Connect → ORMs → Prisma** and copy the **DIRECT_URL**                |
| Neon     | Go to your Neon project → **Dashboard → Connect to your database**, and copy the **Connection string** |

Used in: `/prisma/schema.prisma`

### Authentication

| Variable               | Description                    | Example                                |
| ---------------------- | ------------------------------ | -------------------------------------- |
| `AUTH_SECRET`          | NextAuth.js secret (32+ chars) | `your-super-secret-key-here-32-chars`  |
| `NEXTAUTH_URL`         | App URL for auth callbacks     | `http://localhost:3000`                |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID         | `123456789.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret     | `GOCSPX-xxxxxxxxxxxxx`                 |

Used in: `/lib/auth.ts`, `/api/auth/`, `/api/send-welcome-email/`

### Payments

| Variable           | Description             | Example                |
| ------------------ | ----------------------- | ---------------------- |
| `PAYMENT_PROVIDER` | Active payment provider | `stripe` or `razorpay` |

Default: `stripe` if not set.

### Stripe

| Variable                 | Description             | Example                 |
| ------------------------ | ----------------------- | ----------------------- |
| `STRIPE_SECRET_KEY`      | Stripe API secret key   | `sk_test_xxxxxxxxxxxxx` |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key  | `pk_test_xxxxxxxxxxxxx` |
| `STRIPE_WEBHOOK_SECRET`  | Webhook endpoint secret | `whsec_xxxxxxxxxxxxx`   |

Used in: `/lib/payments/stripe.ts`, `/api/payments/`

### Razorpay (Alternative to Stripe)

| Variable                  | Description                                 | Example                 |
| ------------------------- | ------------------------------------------- | ----------------------- |
| `RAZORPAY_KEY_ID`         | Razorpay API key ID                         | `rzp_test_xxxxxxxxxxxx` |
| `RAZORPAY_KEY_SECRET`     | Razorpay API key secret                     | `xxxxxxxxxxxxxxxx`      |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook endpoint secret (generate your own) | `xxxxxxxxxxxxxxxx`      |

Used in: `/lib/payments/razorpay.ts`, `/api/payments/`

**Note:** Unlike Stripe, Razorpay requires you to generate your own webhook secret. See [payments.md](payments.md) for generation instructions.

### Email

| Variable         | Description    | Example            |
| ---------------- | -------------- | ------------------ |
| `RESEND_API_KEY` | Resend API key | `re_xxxxxxxxxxxxx` |

Used in: `/lib/email.ts`, `/api/auth/magic-link/`

### App URL

| Variable              | Description                      | Example                  |
| --------------------- | -------------------------------- | ------------------------ |
| `NEXT_PUBLIC_APP_URL` | Public app URL (for SEO/sitemap) | `https://yourdomain.com` |

Used in: `/lib/seo.ts`, `/app/sitemap.ts`, `/app/robots.ts`

## Optional Variables

These have defaults or fallbacks:

| Variable               | Description            | Default                      |
| ---------------------- | ---------------------- | ---------------------------- |
| `EMAIL_FROM`           | Sender email address   | Falls back to Resend default |
| `SUPPORT_EMAIL`        | Contact form recipient | Falls back to `EMAIL_FROM`   |
| `NEXT_PUBLIC_APP_NAME` | App name for branding  | "Your SaaS"                  |

Used in: `/lib/email.ts`, `/api/contact/route.ts`, `/api/auth/magic-link/`, `/components/`

### Error Tracking (Optional)

| Variable                 | Description            | Example                       |
| ------------------------ | ---------------------- | ----------------------------- |
| `SENTRY_DSN`             | Sentry server-side DSN | `https://xxx@sentry.io/xxx`   |
| `SENTRY_ENVIRONMENT`     | Environment name       | `development` or `production` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry client-side DSN | `https://xxx@sentry.io/xxx`   |

**Note:** Sentry is optional. If not configured, the app works normally without error tracking.

Used in: `sentry.*.config.ts`, error boundaries, API routes

See [error-tracking.md](error-tracking.md) for setup instructions.

### AI Providers (Optional)

| Variable            | Description              | Example                       |
| ------------------- | ------------------------ | ----------------------------- |
| `OPENAI_API_KEY`    | OpenAI API secret key    | `sk-xxxxxxxxxxxxxxxx`         |
| `ANTHROPIC_API_KEY` | Anthropic API secret key | `sk-ant-xxxxxxxxxxxxx`        |
| `GEMINI_API_KEY`    | Google Gemini API key    | `AIzaSyxxxxxxxxxxxxxxxxxxxxx` |

**Note:** AI providers are optional. The app works normally without them. Configure at least one provider to enable AI features.

Used in: `/lib/ai/providers/`

See [ai-setup.md](ai-setup.md) for setup instructions.

## Environment File Template

Create `.env` file with these values:

```bash
# ===================
# APP DETAILS
# ===================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Your SaaS"

# ===================
# DATABASE
# ===================
DATABASE_URL="postgresql://username:password@localhost:5432/saas_db"

# ===================
# AUTHENTICATION
# ===================
AUTH_SECRET=generate-a-random-32-character-string-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ===================
# PAYMENTS
# ===================
# Select payment provider: "stripe" (default) or "razorpay"
PAYMENT_PROVIDER=stripe

# --- Stripe (if using Stripe) ---
STRIPE_SECRET_KEY=sk_test_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# --- Razorpay (if using Razorpay) ---
# RAZORPAY_KEY_ID=rzp_test_your-razorpay-key-id
# RAZORPAY_KEY_SECRET=your-razorpay-key-secret
# RAZORPAY_WEBHOOK_SECRET=your-razorpay-webhook-secret

# ===================
# EMAIL (Resend)
# ===================
RESEND_API_KEY=re_your-resend-api-key
EMAIL_FROM=noreply@yourdomain.com
SUPPORT_EMAIL=noreply@yourdomain.com

# ===================
# AI PROVIDERS (Optional)
# ===================
# OpenAI (for GPT models)
OPENAI_API_KEY=sk-your-openai-api-key

# Anthropic (for Claude models)
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# Google Gemini
GEMINI_API_KEY=AIzaSy-your-gemini-api-key

# ===================
# ERROR TRACKING (Optional - Sentry)
# ===================
SENTRY_ENVIRONMENT=development

# Server-side error tracking
SENTRY_DSN=https://1234567890abcdef1234567890abcdef@o123456.ingest.sentry.io/1234567

# Client-side error tracking
NEXT_PUBLIC_SENTRY_DSN=https://1234567890abcdef1234567890abcdef@o123456.ingest.sentry.io/1234567
```

## Getting API Keys

### AUTH_SECRET

Generate a random string:

```bash
openssl rand -base64 32
```

Or use: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Go to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`
6. Copy Client ID and Client Secret

### Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Developers → API Keys
3. Copy Publishable key and Secret key
4. For webhooks:
   - Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook/stripe`
   - Select events: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy Signing secret

### Razorpay Keys (Alternative)

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Settings → API Keys
3. Generate and copy Key ID and Key Secret
4. For webhooks:
   - Settings → Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook/razorpay`
   - Select events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `payment.failed`
   - Copy Webhook Secret

### Resend API Key

1. Go to [Resend Dashboard](https://resend.com/)
2. API Keys → Create API Key
3. Copy the key

### Database URL

Format: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`

**Local PostgreSQL:**

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas"
```

**Supabase:**

```
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"
```

**Neon:**

```
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require"
```

## Development vs Production

### Development (.env)

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Production (Vercel Dashboard)

```bash
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXTAUTH_URL=https://yourdomain.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## Vercel Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

1. Add each variable
2. Select environments (Production, Preview, Development)
3. Some variables need specific scopes:
   - `NEXT_PUBLIC_*` - Exposed to browser
   - Others - Server-side only

## Validation

The app validates required variables at startup:

- Missing `STRIPE_SECRET_KEY` → Error on startup
- Missing `STRIPE_WEBHOOK_SECRET` → Error on startup
- Missing `RESEND_API_KEY` → Error on startup
- Missing `DATABASE_URL` → Prisma connection fails

## Troubleshooting

### "STRIPE_SECRET_KEY is required"

Add Stripe keys to `.env`:

```bash
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### "RESEND_API_KEY is required"

Add Resend key to `.env`:

```bash
RESEND_API_KEY=re_xxxxx
```

### "Invalid `prisma.user.findUnique()` invocation"

Check `DATABASE_URL` is valid and database is running.

### "Google OAuth redirect_uri mismatch"

Verify redirect URI in Google Console matches exactly:

- `http://localhost:3000/api/auth/callback/google` (dev)
- `https://yourdomain.com/api/auth/callback/google` (prod)
