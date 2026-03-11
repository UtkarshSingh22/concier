"use client";

import { useEffect, useRef, useState } from "react";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { StatBar } from "./StatBar";
import { BeforeAfter } from "./BeforeAfter";
import { AgentDemo } from "./AgentDemo";
import { WelcomeSection } from "./WelcomeSection";
// import { StatesSection } from "./StatesSection";
// import { PricingSection } from "./PricingSection";
// import { InstallSection } from "./InstallSection";
import { FooterCta } from "./FooterCta";
import { Footer } from "./Footer";
import "./concier-landing.css";

export function ConcierLandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });
  const trailRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const link1 = document.createElement("link");
    link1.rel = "preconnect";
    link1.href = "https://fonts.googleapis.com";
    document.head.appendChild(link1);
    const link2 = document.createElement("link");
    link2.rel = "stylesheet";
    link2.href =
      "https://fonts.googleapis.com/css2?family=Unbounded:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap";
    document.head.appendChild(link2);
    return () => {
      link1.remove();
      link2.remove();
    };
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    function animateTrail() {
      const mx = cursorRef.current.x;
      const my = cursorRef.current.y;
      trailRef.current.x += (mx - trailRef.current.x) * 0.18;
      trailRef.current.y += (my - trailRef.current.y) * 0.18;
      const trailEl = wrapperRef.current?.querySelector(".glow-cursor-trail") as HTMLElement;
      if (trailEl) {
        trailEl.style.transform = `translate(${trailRef.current.x - 30}px, ${trailRef.current.y - 30}px)`;
      }
      rafRef.current = requestAnimationFrame(animateTrail);
    }
    rafRef.current = requestAnimationFrame(animateTrail);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("v");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    el.querySelectorAll(".fi").forEach((node) => obs.observe(node));
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="concier-landing">
      <div
        className="glow-cursor"
        style={{
          transform: `translate(${cursor.x - 10}px, ${cursor.y - 10}px)`,
        }}
        aria-hidden
      />
      <div
        className="glow-cursor-trail"
        style={{
          transform: `translate(${cursor.x - 30}px, ${cursor.y - 30}px)`,
        }}
        aria-hidden
      />
      <div className="noise-overlay" aria-hidden />

      <Nav scrolled={scrolled} />
      <Hero />
      <StatBar />
      <BeforeAfter />
      <AgentDemo />
      <WelcomeSection />
      {/* <StatesSection /> */}
      {/* <PricingSection /> */}
      {/* <InstallSection /> */}
      <FooterCta />
      <Footer />
    </div>
  );
}
