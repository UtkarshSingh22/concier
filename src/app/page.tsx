// 🏗️ USER EDITABLE - HOME PAGE
// This is your main landing page. Customize the layout, components,
// and footer as needed. All landing page components are fully editable.

import type { Metadata } from "next";
import Link from "next/link";
import { createHomeMetadata } from "@/lib/seo";
import {
  Hero,
  ProblemSolution,
  FeatureHighlights,
  HowItWorks,
  CallToAction,
} from "@/components/landing";

export const metadata: Metadata = createHomeMetadata({
  openGraph: {
    images: [
      {
        url: "/og-homepage.jpg", // Add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Your SaaS - Streamline your workflow with our professional platform",
      },
    ],
  },
});

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ProblemSolution />
      <FeatureHighlights />
      <HowItWorks />
      <CallToAction />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © 2024 Your SaaS. All rights reserved.
              </p>
            </div>
            <div className="flex space-x-6">
              <Link
                href="/contact"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
