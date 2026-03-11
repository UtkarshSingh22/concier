"use client";

import Link from "next/link";

function scrollToWaitlist(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid-fade" aria-hidden />

      <p className="hero-eyebrow">Proactive AI Sales Agent</p>

      <h1 className="hero-title">
        Your website closes deals.{" "}
        <span className="lime block">While you sleep.</span>
      </h1>

      <p className="hero-sub">
        Concier watches every visitor on your website and{" "}
        <span className="hero-sub-highlight">speaks first</span> — at the right
        moment, with the right message. One extra conversion a month pays for
        the entire subscription.
      </p>

      <div className="hero-actions">
        <Link href="#waitlist" className="btn-primary" onClick={scrollToWaitlist}>
          Join waitlist
        </Link>
        {/* <Link href="#how-it-works" className="btn-ghost">
          See how it works <span className="arr">→</span>
        </Link> */}
      </div>

      <div className="hero-proof">
        <strong>
          {process.env.NEXT_PUBLIC_WAITLIST_COUNT ?? "7"} founders
        </strong>{" "}
        already on the waitlist
      </div>
    </section>
  );
}
