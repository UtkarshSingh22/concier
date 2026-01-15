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

interface PaymentFailedEmailProps {
  userName: string;
  amount: string;
  failureReason: string;
  retryUrl: string;
}

export const PaymentFailedEmail = ({
  userName,
  amount,
  failureReason,
  retryUrl,
}: PaymentFailedEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>Payment Failed ⚠️</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>

            <Text style={paragraph}>
              We were unable to process your payment of {amount}. This can
              happen for several reasons, and we've included the details below.
            </Text>

            <Section style={errorDetails}>
              <Text style={errorTitle}>Payment Details:</Text>
              <Text style={errorItem}>Amount: {amount}</Text>
              <Text style={errorItem}>Reason: {failureReason}</Text>
            </Section>

            <Text style={paragraph}>
              Don't worry! You can try the payment again with a different
              payment method, or update your billing information.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={retryUrl}>
                Retry Payment
              </Button>
            </Section>

            <Text style={paragraph}>
              If you continue to experience issues or have questions about your
              payment, please contact our support team. We're here to help!
            </Text>

            <Text style={paragraph}>
              Best regards,
              <br />
              The Your SaaS App Billing Team
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This is an automated notification about a failed payment attempt.
              Your account access remains unchanged until the payment is
              successfully processed.
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
  color: "#dc2626",
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

const errorDetails = {
  backgroundColor: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const errorTitle = {
  color: "#dc2626",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const errorItem = {
  color: "#7f1d1d",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#dc2626",
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
