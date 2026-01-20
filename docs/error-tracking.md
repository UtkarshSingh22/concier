# Error Tracking with Sentry

ZeroDrag includes Sentry for production error tracking and monitoring.

## What Sentry Tracks

| Category        | What's Captured                               |
| --------------- | --------------------------------------------- |
| React Errors    | Component crashes, render failures            |
| API Errors      | Route handler exceptions, unexpected failures |
| Stripe Webhooks | Payment processing errors, webhook failures   |
| Auth Failures   | OAuth errors, magic link delivery issues      |
| Email Failures  | Resend API errors, delivery failures          |
| Server Errors   | Database errors, unexpected exceptions        |

## Setup

### 1. Get Sentry DSN

1. Create account at [sentry.io](https://sentry.io)
2. Create a new project (Next.js)
3. Copy your DSN (looks like `https://xxx@xxx.ingest.sentry.io/xxx`)

### 2. Configure Environment Variables

Add to `.env`:

```bash
# Sentry Error Tracking
SENTRY_ENVIRONMENT=development

# Server-side error tracking
SENTRY_DSN=https://1234567890abcdef1234567890abcdef@o123456.ingest.sentry.io/1234567

# Client-side error tracking
NEXT_PUBLIC_SENTRY_DSN=https://1234567890abcdef1234567890abcdef@o123456.ingest.sentry.io/1234567
```

**Production:**

```bash
SENTRY_ENVIRONMENT=production
SENTRY_DSN=https://your-real-dsn@o123456.ingest.sentry.io/1234567
NEXT_PUBLIC_SENTRY_DSN=https://your-real-dsn@o123456.ingest.sentry.io/1234567
```

### 3. Verify Setup

The app works fine without Sentry configured. If `SENTRY_DSN` is missing, error tracking is disabled but the app functions normally.

## Configuration Files

| File                      | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `sentry.client.config.ts` | Client-side error tracking (React)       |
| `sentry.server.config.ts` | Server-side error tracking (API routes)  |
| `sentry.edge.config.ts`   | Edge runtime error tracking (Middleware) |

These files are marked 🔒 CORE SYSTEM - do not modify.

## What Gets Filtered

Sentry automatically removes sensitive data:

- Cookies
- Authorization headers
- Stripe signatures
- Environment variables
- Auth tokens

## Common Errors You'll See

### Stripe Webhook Failures

**What it means:** Payment processing failed

**Where to look:**

- Sentry → Issues → Search "stripe_webhook"
- Check subscription ID and customer ID in context
- Verify webhook secret is correct

**Fix:**

1. Check Stripe Dashboard → Webhooks → Logs
2. Verify `STRIPE_WEBHOOK_SECRET` matches
3. Ensure webhook URL is correct

### Email Delivery Failures

**What it means:** Email failed to send (magic link, welcome, etc.)

**Where to look:**

- Sentry → Issues → Search "resend" or "email"
- Check Resend Dashboard for delivery status

**Fix:**

1. Verify `RESEND_API_KEY` is valid
2. Check sender domain is verified in Resend
3. Verify `EMAIL_FROM` is correct

### Auth Errors

**What it means:** Google OAuth or magic link failed

**Where to look:**

- Sentry → Issues → Filter by "auth"
- Check error message for details

**Fix:**

1. Verify Google OAuth credentials
2. Check redirect URIs match exactly
3. Verify `AUTH_SECRET` is set

### Database Errors

**What it means:** Database query failed

**Where to look:**

- Sentry → Issues → Search "prisma"
- Check database connection

**Fix:**

1. Verify `DATABASE_URL` is correct
2. Ensure database is running
3. Check if schema is up to date: `pnpm db:push`

## Using Error Tracking in Your Code

### API Routes

Use the error handler wrapper:

```typescript
import { withErrorHandler } from "@/lib/error-handler";

export async function POST(request: NextRequest) {
  return withErrorHandler(
    async () => {
      // Your logic here
      return NextResponse.json({ success: true });
    },
    {
      context: "my-feature",
      tags: { feature: "custom" },
    }
  );
}
```

### Expected Errors

For validation or expected errors, don't use Sentry:

```typescript
import { createErrorResponse } from "@/lib/error-handler";

// This won't send to Sentry (expected error)
if (!isValid) {
  return createErrorResponse("Invalid input", 400);
}
```

### Background Operations

For non-critical errors:

```typescript
import { captureError } from "@/lib/error-handler";

try {
  await backgroundTask();
} catch (error) {
  // Log to Sentry but don't throw
  captureError(error, "background-task");
}
```

### Logging

Use the logger for structured logging:

```typescript
import { logger } from "@/lib/logger";

// Info (console only, not Sentry)
logger.info("User logged in", {
  context: "auth",
  userId: "123",
});

// Warning (console + Sentry)
logger.warn("Slow API response", {
  context: "api",
  metadata: { duration: 5000 },
});

// Error (console + Sentry)
logger.error(new Error("Failed"), {
  context: "payment",
  userId: "123",
});
```

## Performance Monitoring

Sentry includes performance monitoring with:

**Traces Sample Rate:**

- Development: 100% (all requests)
- Production: 10% (1 in 10 requests)

This keeps quota usage reasonable while still catching issues.

## Debugging Production Errors

1. **Find the Error:**
   - Go to Sentry Dashboard
   - Look at Issues tab
   - Sort by frequency or last seen

2. **Check Context:**
   - Event ID
   - User ID (if available)
   - Tags (context, type)
   - Breadcrumbs (what led to the error)

3. **Reproduce Locally:**
   - Use error message and stack trace
   - Check if error exists in development
   - Add more logging if needed

4. **Fix and Deploy:**
   - Fix the issue
   - Deploy to production
   - Mark as resolved in Sentry

## Disabling Sentry

To disable error tracking:

1. **Remove from `.env`:**

   ```bash
   # Comment out or delete
   # SENTRY_DSN=...
   # NEXT_PUBLIC_SENTRY_DSN=...
   ```

2. **App continues working normally** - Sentry is optional

## Best Practices

### ✅ Do

- Log unexpected errors to Sentry
- Add context (user ID, feature name)
- Filter sensitive data
- Keep sample rates low in production

### ❌ Don't

- Log expected validation errors
- Log 404s or auth redirects
- Include sensitive data in error messages
- Over-log (increases quota usage)

## Extending Error Tracking

### Add Custom Tags

```typescript
Sentry.setTag("feature", "custom-feature");
Sentry.setTag("plan", "pro");
```

### Add User Context

```typescript
Sentry.setUser({
  id: user.id,
  email: user.email, // Sentry hashes this
});
```

### Add Breadcrumbs

```typescript
Sentry.addBreadcrumb({
  category: "user-action",
  message: "User clicked button",
  level: "info",
});
```

## Cost Management

Sentry has usage limits on free tier:

- **Free:** 5,000 errors/month
- **Team:** 50,000 errors/month+

To manage quota:

1. **Lower sample rates** (already done)
2. **Filter noisy errors** (already configured)
3. **Upgrade plan** if needed

## Troubleshooting

### "Sentry not capturing errors"

1. Verify `SENTRY_DSN` is set correctly
2. Check Sentry Dashboard → Project Settings → Client Keys
3. Ensure error is not in ignore list
4. Check if error happens in development (may be filtered)

### "Too many errors"

1. Fix frequent errors first
2. Add more specific error handling
3. Consider lowering sample rate further

### "Missing context in errors"

1. Add tags when capturing errors
2. Use `logger` with metadata
3. Add user context where available

## Files Modified for Sentry

| File                                          | Changes                    |
| --------------------------------------------- | -------------------------- |
| `sentry.*.config.ts`                          | Sentry configuration       |
| `app/error.tsx`                               | Error boundary             |
| `app/global-error.tsx`                        | Root error boundary        |
| `lib/error-handler.ts`                        | API error handling         |
| `lib/logger.ts`                               | Structured logging         |
| `api/stripe/webhook/route.ts`                 | Stripe error capture       |
| `api/stripe/create-checkout-session/route.ts` | Uses withErrorHandler      |
| `api/contact/route.ts`                        | Contact form error capture |
| `api/auth/magic-link/route.ts`                | Auth error capture         |
| `api/send-welcome-email/route.ts`             | Uses withErrorHandler      |

**Pattern Used:**

- Expected errors (validation, auth) → `createErrorResponse()` (not sent to Sentry)
- Unexpected errors (crashes, DB failures) → Automatically captured by `withErrorHandler()`
