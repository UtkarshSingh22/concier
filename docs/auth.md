# Authentication

Scaffold uses NextAuth.js v4 with two authentication methods:

1. **Google OAuth** - One-click sign-in
2. **Magic Links** - Passwordless email authentication via Resend

## How It Works

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. Returns to `/api/auth/callback/google`
4. User created in database (if new)
5. Session created and user redirected to `/product`

### Magic Link Flow
1. User enters email and clicks "Send magic link"
2. API generates a verification token
3. Email sent via Resend with verification link
4. User clicks link → token verified → session created
5. User redirected to `/product`

## Key Files

| File | Purpose |
|------|---------|
| `/lib/auth.ts` | NextAuth configuration |
| `/lib/auth-utils.ts` | Server-side auth helpers |
| `/components/AuthForm.tsx` | Login form UI |
| `/app/auth/page.tsx` | Login page |
| `/app/api/auth/magic-link/route.ts` | Magic link sender |
| `/app/api/auth/magic-link/verify/route.ts` | Token verification |

## Server-Side Auth Checks

Use these functions in your pages and API routes:

```typescript
import { requireAuth, requireEntitlement, hasEntitlement } from "@/lib/auth-utils";

// Require authentication (redirects to /auth if not logged in)
const user = await requireAuth();

// Require specific entitlement (redirects to /pricing if missing)
const user = await requireEntitlement("pro_features");

// Check entitlement without redirecting
const hasPro = await hasEntitlement("pro_features");
```

## Client-Side Session

Use the `useSession` hook from NextAuth:

```typescript
"use client";
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <Loading />;
  if (!session) return <LoginPrompt />;
  
  return <div>Hello, {session.user.name}</div>;
}
```

## Protected Routes

Pages inside `/app/(protected)/` automatically require authentication. The layout at `/app/(protected)/layout.tsx` calls `requireAuth()` and redirects unauthenticated users.

## Account Linking

If a user signs up with magic link and later uses Google OAuth (or vice versa), the accounts are automatically linked based on email address.

## Session Configuration

Sessions are JWT-based with:
- **Max age**: 30 days
- **Update age**: 24 hours (refreshes automatically)

## What NOT to Change

- `/lib/auth.ts` - Core NextAuth config
- `/lib/auth-utils.ts` - Auth helper functions
- `/components/AuthForm.tsx` - Login form
- `/app/api/auth/` routes

These are marked with 🔒 CORE SYSTEM comments.

