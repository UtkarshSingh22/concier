// 🏗️ USER EDITABLE - TERMS OF SERVICE PAGE
// Customize your terms of service content and legal language.
// This page is fully editable - update terms and styling as needed.

import type { Metadata } from "next";
import { createStaticPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createStaticPageMetadata(
  "Terms of Service",
  "Read our terms of service and usage guidelines."
);

const TermsPage = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <div className="mt-10 space-y-8 text-gray-600">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                Acceptance of Terms
              </h2>
              <p className="mt-4">
                By accessing and using Your SaaS, you accept and agree to be
                bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                Use License
              </h2>
              <p className="mt-4">
                Permission is granted to temporarily use Your SaaS for personal
                and business use. This is the grant of a license, not a transfer
                of title.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                User Responsibilities
              </h2>
              <p className="mt-4">
                You are responsible for maintaining the confidentiality of your
                account and password and for restricting access to your
                computer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                Service Availability
              </h2>
              <p className="mt-4">
                We strive to provide continuous service but do not guarantee
                that the service will be uninterrupted or error-free.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                Limitation of Liability
              </h2>
              <p className="mt-4">
                In no event shall Your SaaS be liable for any damages arising
                out of the use or inability to use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900">
                Contact Information
              </h2>
              <p className="mt-4">
                If you have any questions about these Terms of Service, please
                contact us at legal@acmesaas.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
