// 🏗️ USER EDITABLE - CONTACT PAGE
// Customize the page layout, heading, and description.
// Safe to edit: Heading text, description, styling.
// The ContactForm component handles the actual form.

import type { Metadata } from "next";
import { createStaticPageMetadata } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";
import { LandingNav } from "@/components/landing";

export const metadata: Metadata = createStaticPageMetadata(
  "Contact Us",
  "Get in touch with our team. We're here to help with any questions or feedback."
);

const ContactPage = () => {
  return (
    <div className="bg-background min-h-screen">
      <LandingNav />
      <div className="pt-24 pb-16 sm:pt-32 sm:pb-24">
        <div className="mx-auto max-w-2xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Have a question or need help? We&apos;d love to hear from you.
              Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <div className="mt-12">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
