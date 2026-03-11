"use client";

import Link from "next/link";

function scrollToWaitlist(e: React.MouseEvent) {
  e.preventDefault();
  document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
}

type NavProps = {
  scrolled: boolean;
};

export function Nav({ scrolled }: NavProps) {
  return (
    <nav id="concier-nav" className={scrolled ? "scrolled" : ""}>
      <Link href="#" className="logo">
        Concie<span>r</span>
      </Link>
      <ul className="nav-links">
        {/* <li>
          <Link href="#how-it-works">How it works</Link>
        </li> */}
        {/* <li>
          <Link href="#pricing">Pricing</Link>
        </li> */}
        {/* <li>
          <Link href="#install">Install</Link>
        </li> */}
        <li>
          <Link href="#waitlist" className="btn-nav" onClick={scrollToWaitlist}>
            Join waitlist
          </Link>
        </li>
      </ul>
    </nav>
  );
}
