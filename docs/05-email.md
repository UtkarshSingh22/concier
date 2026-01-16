# Email System

The boilerplate uses Resend for transactional emails with React-based templates.

## Email Types

| Type                      | Template                            | Trigger                 |
| ------------------------- | ----------------------------------- | ----------------------- |
| Magic Link                | Built into NextAuth                 | User requests login     |
| Welcome                   | `WelcomeEmail.tsx`                  | Manual or after signup  |
| Subscription Confirmation | `SubscriptionConfirmationEmail.tsx` | After payment           |
| Payment Failed            | `PaymentFailedEmail.tsx`            | Failed payment          |
| Contact Form              | `ContactFormEmail.tsx`              | Contact form submission |

## Key Files

| File                               | Purpose                  |
| ---------------------------------- | ------------------------ |
| `/lib/email.ts`                    | Email service and sender |
| `/emails/templates/`               | React email templates    |
| `/api/send-welcome-email/route.ts` | Welcome email API        |
| `/api/contact/route.ts`            | Contact form handler     |

## Environment Variables

```
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@yourdomain.com
```

## Sending Emails

Use the `EmailService` object:

```typescript
import { EmailService } from "@/lib/email";

// Welcome email
await EmailService.sendWelcomeEmail({
  to: "user@example.com",
  userName: "John",
  loginUrl: "https://yourapp.com/auth",
});

// Subscription confirmation
await EmailService.sendSubscriptionConfirmation({
  to: "user@example.com",
  userName: "John",
  planName: "Pro Plan",
  amount: "$29.00",
  nextBillingDate: "Feb 1, 2025",
});

// Payment failed
await EmailService.sendPaymentFailedEmail({
  to: "user@example.com",
  userName: "John",
  amount: "$29.00",
  failureReason: "Card declined",
  retryUrl: "https://yourapp.com/billing",
});

// Contact form
await EmailService.sendContactFormMessage({
  fromName: "John",
  fromEmail: "john@example.com",
  subject: "Question",
  message: "Hello...",
  adminEmail: "support@yourapp.com",
});
```

## Testing Emails

From the product dashboard (`/product`):

1. Find "📧 Test Email System" section
2. Click "Send Welcome Email"
3. Check your inbox

## Creating New Email Templates

1. Create template in `/emails/templates/`:

```tsx
// /emails/templates/MyEmail.tsx
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
} from "@react-email/components";

interface MyEmailProps {
  userName: string;
  actionUrl: string;
}

export const MyEmail = ({ userName, actionUrl }: MyEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: "sans-serif" }}>
      <Container>
        <Text>Hi {userName},</Text>
        <Button href={actionUrl}>Take Action</Button>
      </Container>
    </Body>
  </Html>
);
```

2. Add to EmailService in `/lib/email.ts`:

```typescript
async sendMyEmail({
  to,
  userName,
  actionUrl,
}: {
  to: string;
  userName: string;
  actionUrl: string;
}) {
  const { MyEmail } = await import("@/emails/templates/MyEmail");

  return sendEmail({
    to,
    subject: "Your Subject",
    template: MyEmail,
    templateProps: { userName, actionUrl },
  });
}
```

3. Use it:

```typescript
await EmailService.sendMyEmail({
  to: "user@example.com",
  userName: "John",
  actionUrl: "https://yourapp.com/action",
});
```

## What You Can Edit

- `/emails/templates/` - All email templates
- Template styling and content
- Add new email types to EmailService

## What NOT to Change

- `/lib/email.ts` - Core email sending logic
- The `sendEmail` function signature
- Magic link email (handled by auth system)
