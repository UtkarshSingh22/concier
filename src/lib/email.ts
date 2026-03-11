// 🔒 CORE SYSTEM - DO NOT MODIFY
// Modular email system using Resend
// Single gateway for all non-auth email communications

import { Resend } from "resend";
import { render } from "@react-email/components";

// Initialize Resend client only when API key is set (optional for local/dev)
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Email configuration
export const EMAIL_CONFIG = {
  from: {
    email: process.env.EMAIL_FROM,
    name: process.env.NEXT_PUBLIC_APP_NAME || "Your SaaS App",
  },
} as const;

// Generic email sending function
export async function sendEmail({
  to,
  subject,
  template,
  templateProps,
}: {
  to: string;
  subject: string;
  template: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  templateProps: Record<string, unknown>;
}) {
  try {
    // Render the React template to HTML
    const html = await render(template(templateProps));

    // Validate required fields
    if (!to || !subject || !html) {
      throw new Error("Missing required email fields: to, subject, or html");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error("Invalid recipient email format");
    }

    if (!resend) {
      console.warn("Email skipped: RESEND_API_KEY is not set.");
      return {
        success: false,
        error: "Email is not configured (RESEND_API_KEY missing).",
      };
    }

    const fromEmail = `${EMAIL_CONFIG.from.name} <${EMAIL_CONFIG.from.email}>`;

    const result = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject,
      html,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Email sending failed:", error);

    // Log more details for debugging
    if (error && typeof error === "object" && "response" in error) {
      const err = error as { response?: { data?: unknown } };
      console.error("Resend API response:", err.response?.data);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Typed email functions for specific use cases
export const EmailService = {
  // Welcome email for new users
  async sendWelcomeEmail({
    to,
    userName,
    loginUrl,
  }: {
    to: string;
    userName: string;
    loginUrl: string;
  }) {
    try {
      const { WelcomeEmail } = await import("@/emails/templates/WelcomeEmail");

      return sendEmail({
        to,
        subject: `Welcome to ${process.env.NEXT_PUBLIC_APP_NAME || "Your SaaS App"}! 🎉`,
        template: WelcomeEmail,
        templateProps: {
          userName,
          loginUrl,
          appName: process.env.NEXT_PUBLIC_APP_NAME || "Your SaaS App",
        },
      });
    } catch (error) {
      console.error("❌ Failed to load WelcomeEmail template:", error);
      return {
        success: false,
        error: `Template loading failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      };
    }
  },

  // Subscription confirmation
  async sendSubscriptionConfirmation({
    to,
    userName,
    planName,
    amount,
    nextBillingDate,
  }: {
    to: string;
    userName: string;
    planName: string;
    amount: string;
    nextBillingDate: string;
  }) {
    const { SubscriptionConfirmationEmail } =
      await import("@/emails/templates/SubscriptionConfirmationEmail");

    return sendEmail({
      to,
      subject: `Subscription Confirmed - ${planName}`,
      template: SubscriptionConfirmationEmail,
      templateProps: {
        userName,
        planName,
        amount,
        nextBillingDate,
        appName: process.env.NEXT_PUBLIC_APP_NAME || "Your SaaS App",
      },
    });
  },

  // Payment failed notification
  async sendPaymentFailedEmail({
    to,
    userName,
    amount,
    failureReason,
    retryUrl,
  }: {
    to: string;
    userName: string;
    amount: string;
    failureReason: string;
    retryUrl: string;
  }) {
    const { PaymentFailedEmail } =
      await import("@/emails/templates/PaymentFailedEmail");

    return sendEmail({
      to,
      subject: "Payment Failed - Action Required",
      template: PaymentFailedEmail,
      templateProps: {
        userName,
        amount,
        failureReason,
        retryUrl,
        appName: process.env.NEXT_PUBLIC_APP_NAME || "Your SaaS App",
      },
    });
  },

  // Contact form message
  async sendContactFormMessage({
    fromName,
    fromEmail,
    subject,
    message,
    adminEmail,
  }: {
    fromName: string;
    fromEmail: string;
    subject: string;
    message: string;
    adminEmail: string;
  }) {
    const { ContactFormEmail } =
      await import("@/emails/templates/ContactFormEmail");

    return sendEmail({
      to: adminEmail,
      subject: `Contact Form: ${subject}`,
      template: ContactFormEmail,
      templateProps: { fromName, fromEmail, subject, message },
    });
  },
};

// Export types for use in components
export type EmailTemplateProps = {
  WelcomeEmail: {
    userName: string;
    loginUrl: string;
  };
  SubscriptionConfirmationEmail: {
    userName: string;
    planName: string;
    amount: string;
    nextBillingDate: string;
  };
  PaymentFailedEmail: {
    userName: string;
    amount: string;
    failureReason: string;
    retryUrl: string;
  };
  ContactFormEmail: {
    fromName: string;
    fromEmail: string;
    subject: string;
    message: string;
  };
};
