import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface SubscriptionConfirmationEmailProps {
  userName: string;
  planName: string;
  amount: string;
  nextBillingDate: string;
}

export const SubscriptionConfirmationEmail = ({
  userName,
  planName,
  amount,
  nextBillingDate,
}: SubscriptionConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>Subscription Confirmed! 🎉</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>

            <Text style={paragraph}>
              Great news! Your subscription to the <strong>{planName}</strong>{" "}
              plan has been successfully activated.
            </Text>

            <Section style={billingDetails}>
              <Text style={billingTitle}>Billing Details:</Text>
              <Text style={billingItem}>Plan: {planName}</Text>
              <Text style={billingItem}>Amount: {amount}</Text>
              <Text style={billingItem}>
                Next billing date: {nextBillingDate}
              </Text>
            </Section>

            <Text style={paragraph}>
              You now have access to all the features included in your{" "}
              {planName} plan. You can manage your subscription and billing
              information anytime from your account dashboard.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href="https://yourapp.com/billing">
                Manage Subscription
              </Button>
            </Section>

            <Text style={paragraph}>
              If you have any questions about your subscription or need
              assistance, please don't hesitate to contact our support team.
            </Text>

            <Text style={paragraph}>
              Thank you for choosing us!
              <br />
              The Your SaaS App Team
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This is an automated confirmation email for your recent
              subscription purchase. You can view your receipt and manage your
              subscription in your account settings.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const header = {
  padding: "40px 48px 20px",
};

const heading = {
  color: "#333",
  fontSize: "28px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 40px",
};

const content = {
  padding: "0 48px",
};

const greeting = {
  color: "#333",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 16px",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const billingDetails = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const billingTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const billingItem = {
  color: "#525f7f",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#10b981",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  padding: "0 48px",
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  margin: "0",
};
