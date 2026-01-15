import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
} from "@react-email/components";

interface ContactFormEmailProps {
  fromName: string;
  fromEmail: string;
  subject: string;
  message: string;
}

export const ContactFormEmail = ({
  fromName,
  fromEmail,
  subject,
  message,
}: ContactFormEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>New Contact Form Message</Text>
          </Section>

          <Section style={content}>
            <Text style={intro}>
              You have received a new message through the contact form on your
              website.
            </Text>

            <Section style={messageDetails}>
              <Text style={detailTitle}>Contact Information:</Text>
              <Text style={detailItem}>Name: {fromName}</Text>
              <Text style={detailItem}>Email: {fromEmail}</Text>
              <Text style={detailItem}>Subject: {subject}</Text>
            </Section>

            <Section style={messageSection}>
              <Text style={messageTitle}>Message:</Text>
              <Text style={messageContent}>{message}</Text>
            </Section>

            <Text style={footerNote}>
              You can reply directly to this email to respond to the sender, or
              use the email address provided above.
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This message was sent from the contact form on your website.
              Please handle inquiries promptly to provide excellent customer
              service.
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
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 20px",
};

const content = {
  padding: "0 48px",
};

const intro = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px",
};

const messageDetails = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const detailTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const detailItem = {
  color: "#525f7f",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 8px",
};

const messageSection = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
};

const messageTitle = {
  color: "#333",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 12px",
};

const messageContent = {
  color: "#525f7f",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const footerNote = {
  color: "#525f7f",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "24px 0",
  fontStyle: "italic" as const,
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
