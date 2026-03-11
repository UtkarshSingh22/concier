import type { Metadata } from "next";
import { createHomeMetadata } from "@/lib/seo";
import { ConcierLandingPage } from "@/components/concier-landing";

export const metadata: Metadata = createHomeMetadata({
  title: "Concier — Your website's AI salesperson",
  openGraph: {
    images: [
      {
        url: "/og-homepage.jpg",
        width: 1200,
        height: 630,
        alt: "Concier — Your website's AI salesperson",
      },
    ],
  },
});

export default function Home() {
  return <ConcierLandingPage />;
}
