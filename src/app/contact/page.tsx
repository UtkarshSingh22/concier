// 🏗️ USER EDITABLE - CONTACT PAGE
// Customize the contact form design and messaging.
// This page is fully editable - modify form fields and styling as needed.

import type { Metadata } from "next";
import { createStaticPageMetadata } from "@/lib/seo";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = createStaticPageMetadata(
  "Contact Us",
  "Get in touch with our team. We're here to help with any questions or feedback."
);

const ContactPage = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Have a question or need help? We&apos;d love to hear from you. Send
            us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
