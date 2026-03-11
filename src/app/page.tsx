import type { Metadata } from "next";
import { createHomeMetadata } from "@/lib/seo";
import { ConcierLandingPage } from "@/components/concier-landing";

export const metadata: Metadata = createHomeMetadata({
  title: "Concier — Your website's AI salesperson",
  description:
    "Your website's AI salesperson. Concier speaks first — at the right moment, with the right message. Join the waitlist.",
});

export default function Home() {
  return <ConcierLandingPage />;
}
