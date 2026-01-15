// 🏗️ USER EDITABLE - PRIVACY POLICY PAGE
// Customize your privacy policy content and legal language.
// This page is fully editable - update policies and styling as needed.

import type { Metadata } from "next";
import { createStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createStaticPageMetadata(
  "Privacy Policy",
  "Learn how we collect, use, and protect your personal information."
);

const PrivacyPage = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-10 space-y-8 text-gray-600">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                Information We Collect
              </h2>
              <p className="mt-4">
                We collect information you provide directly to us, such as when
                you create an account, use our services, or contact us for
                support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                How We Use Your Information
              </h2>
              <p className="mt-4">
                We use the information we collect to provide, maintain, and
                improve our services, process transactions, and communicate with
                you.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                Information Sharing
              </h2>
              <p className="mt-4">
                We do not sell, trade, or otherwise transfer your personal
                information to third parties without your consent, except as
                described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                Data Security
              </h2>
              <p className="mt-4">
                We implement appropriate security measures to protect your
                personal information against unauthorized access, alteration,
                disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                Contact Us
              </h2>
              <p className="mt-4">
                If you have any questions about this Privacy Policy, please
                contact us at privacy@acmesaas.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
