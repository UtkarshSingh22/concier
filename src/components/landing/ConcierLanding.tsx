"use client";

import { useState, useEffect } from "react";

const TEAL = "#0d9488";
const SECTION_PADDING_DESKTOP = 90;
const MAX_CONTENT_WIDTH = 1080;

export function ConcierLanding() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const submit = () => {
    if (email.includes("@")) setDone(true);
  };

  return (
    <div
      style={{
        background: "#fff",
        color: "#0f0f0f",
        minHeight: "100vh",
        fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        * { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
        ::selection { background: #0d948822; }
        html { scroll-behavior: smooth; }
        #wl { scroll-margin-top: 80px; }
        a { text-decoration: none; color: inherit; }

        .nav-a { color: #666; font-size: 14px; font-weight: 500; transition: color 0.18s; cursor: pointer; font-family: "Open Runde", "Open Runde Placeholder", sans-serif; }
        .nav-a:hover { color: #0f0f0f; }

        .cta { background: #0d9488; color: #fff; border: none; border-radius: 10px; padding: 13px 26px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit; transition: all 0.18s; letter-spacing: -0.01em; white-space: nowrap; }
        .cta:hover { background: #0f766e; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(13,148,136,0.28); }
        .cta-sm { padding: 9px 18px; font-size: 13px; }

        .inp { border: 1.5px solid #e5e5e5; border-radius: 10px; padding: 13px 18px; font-size: 15px; font-family: inherit; color: #0f0f0f; outline: none; transition: border-color 0.2s; width: 260px; background: #fff; }
        .inp:focus { border-color: #0d9488; }
        .inp::placeholder { color: #999; }

        .label { color: #0d9488; font-size: 11px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; font-family: monospace; display: block; margin-bottom: 14px; }

        .vs { display: flex; align-items: flex-start; gap: 12px; padding: 11px 0; border-bottom: 1px solid #f0f0f0; }
        .vs:last-child { border-bottom: none; }

        .section-pad { padding-top: 90px; padding-bottom: 90px; }
        @media (max-width: 720px) {
          .hide-m { display: none !important; }
          .row-m { flex-direction: column !important; align-items: stretch !important; }
          .inp { width: 100% !important; }
          .grid-2 { grid-template-columns: 1fr !important; }
          .section-pad { padding-top: 60px !important; padding-bottom: 60px !important; }
        }
      `}</style>

      {/* Nav */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(255,255,255,0.94)" : "#fff",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: `1px solid ${scrolled ? "#f0f0f0" : "transparent"}`,
          transition: "all 0.25s",
          padding: `0 max(24px, calc((100vw - ${MAX_CONTENT_WIDTH}px) / 2))`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 60,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: TEAL,
              }}
            />
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                fontFamily:
                  '"Open Runde", "Open Runde Placeholder", sans-serif',
              }}
            >
              concier
            </span>
          </div>
          <div className="hide-m" style={{ display: "flex", gap: 32 }}>
            <a className="nav-a" href="#whyconcier">
              Why Concier
            </a>
          </div>
          <button
            type="button"
            className="cta cta-sm"
            onClick={() =>
              document
                .getElementById("wl")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get early access
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          padding: `${SECTION_PADDING_DESKTOP + 48}px max(24px, calc((100vw - 760px) / 2)) ${SECTION_PADDING_DESKTOP}px`,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(44px, 5vw, 52px)",
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            color: "#1a1615",
            marginBottom: 22,
            fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
          }}
        >
          Your website has a salesperson now.{" "}
          <span style={{ color: TEAL }}>One that pays for itself.</span>
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "#666",
            lineHeight: 1.75,
            maxWidth: 460,
            margin: "0 auto 44px",
            fontWeight: 400,
            fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
          }}
        >
          Concier turns browsers into paying customers — and pays for itself the
          moment one of them converts.
        </p>

        <div
          id="wl"
          className="row-m"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {!done ? (
            <>
              <input
                className="inp"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              <button type="button" className="cta" onClick={submit}>
                Get early access →
              </button>
            </>
          ) : (
            <div
              style={{
                background: "#f0fdfa",
                border: "1.5px solid #99f6e4",
                borderRadius: 12,
                padding: "14px 28px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: TEAL, fontSize: 18 }}>✓</span>
              <span
                style={{
                  color: TEAL,
                  fontWeight: 600,
                  fontSize: 15,
                  fontFamily:
                    '"Open Runde", "Open Runde Placeholder", sans-serif',
                }}
              >
                You&apos;re in. We&apos;ll be in touch.
              </span>
            </div>
          )}
        </div>
        <p
          style={{
            color: "#666",
            fontSize: 12,
            marginTop: 12,
            fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
          }}
        >
          One extra conversion per month covers the entire subscription.
        </p>
      </section>

      {/* Trust Strip */}
      <section
        className="section-pad"
        style={{
          paddingLeft: "max(24px, calc((100vw - 1080px) / 2))",
          paddingRight: "max(24px, calc((100vw - 1080px) / 2))",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
          background: "#fafafa",
        }}
      >
        <div
          style={{
            maxWidth: MAX_CONTENT_WIDTH,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "24px 32px",
          }}
        >
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#555",
            }}
          >
            One script tag · Any website
          </span>
          <div
            style={{
              width: 1,
              height: 16,
              background: "#e5e5e5",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#555",
            }}
          >
            Under 5KB · Zero PageSpeed impact
          </span>
          <div
            style={{
              width: 1,
              height: 16,
              background: "#e5e5e5",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              color: "#555",
            }}
          >
            Cookieless · No consent banner
          </span>
        </div>
      </section>

      {/* Social Proof Number */}
      <section
        id="howitworks"
        className="section-pad"
        style={{
          paddingLeft: "max(24px, calc((100vw - 1080px) / 2))",
          paddingRight: "max(24px, calc((100vw - 1080px) / 2))",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "clamp(44px, 5vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "#1a1615",
            lineHeight: 1.2,
            marginBottom: 12,
            fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
          }}
        >
          143 founders on the waitlist and counting.
        </p>
        <p
          style={{
            fontSize: 15,
            color: "#666",
            lineHeight: 1.6,
            maxWidth: 480,
            margin: "0 auto",
            fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
          }}
        >
          Solo founders and small SaaS teams who are done watching visitors
          leave silently.
        </p>
      </section>

      {/* Why Concier */}
      <section
        id="whyconcier"
        className="section-pad"
        style={{
          paddingLeft: "max(24px, calc((100vw - 1080px) / 2))",
          paddingRight: "max(24px, calc((100vw - 1080px) / 2))",
          background: "#fafafa",
          borderTop: "1px solid #f0f0f0",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div
          className="grid-2"
          style={{
            maxWidth: MAX_CONTENT_WIDTH,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 72,
            alignItems: "center",
          }}
        >
          <div>
            <span className="label">WHY CONCIER</span>
            <h2
              style={{
                fontSize: "clamp(44px, 4vw, 52px)",
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "#1a1615",
                lineHeight: 1.2,
                marginBottom: 8,
                fontFamily:
                  '"Open Runde", "Open Runde Placeholder", sans-serif',
              }}
            >
              Every other tool waits.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#888",
                lineHeight: 1.5,
                marginBottom: 18,
                fontFamily:
                  '"Open Runde", "Open Runde Placeholder", sans-serif',
              }}
            >
              Concier goes first.
            </p>
            <p
              style={{
                color: "#666",
                fontSize: 15,
                lineHeight: 1.8,
                marginBottom: 32,
                fontFamily:
                  '"Open Runde", "Open Runde Placeholder", sans-serif',
              }}
            >
              Chatbots sit in the corner waiting to be asked. Real salespeople
              watch the room, read the signals, and make a move. Concier does
              what every other website tool is too passive to do.
            </p>
            <button
              type="button"
              className="cta"
              onClick={() =>
                document
                  .getElementById("wl")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Join the waitlist →
            </button>
          </div>

          <div
            style={{
              background: "#fff",
              border: "1.5px solid #f0f0f0",
              borderRadius: 20,
              padding: "28px 24px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
            }}
          >
            {[
              ["Waits for visitors to type first", "Watches and speaks first"],
              [
                "Generic Hi there greeting",
                "Precise, contextual first message",
              ],
              [
                "No insight on why visitors left",
                "Session Brain tells you everything",
              ],
              ["Pesters after dismissal", "One attempt. Then it retreats."],
              [
                "$2,500+/mo or enterprise only",
                "$49–$199/mo, live in 10 minutes",
              ],
            ].map(([bad, good], i) => (
              <div key={i} className="vs">
                <span
                  style={{
                    color: "#999",
                    fontSize: 13,
                    flex: 1,
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    fontFamily:
                      '"Open Runde", "Open Runde Placeholder", sans-serif',
                  }}
                >
                  <span style={{ flexShrink: 0 }}>✗</span>
                  {bad}
                </span>
                <div
                  style={{
                    width: 1,
                    background: "#e5e5e5",
                    alignSelf: "stretch",
                    margin: "0 14px",
                  }}
                />
                <span
                  style={{
                    color: "#0f0f0f",
                    fontSize: 13,
                    fontWeight: 500,
                    flex: 1,
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    fontFamily:
                      '"Open Runde", "Open Runde Placeholder", sans-serif',
                  }}
                >
                  <span style={{ color: TEAL, flexShrink: 0 }}>✓</span>
                  {good}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="section-pad"
        style={{
          paddingLeft: "max(24px, calc((100vw - 640px) / 2))",
          paddingRight: "max(24px, calc((100vw - 640px) / 2))",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(44px, 5vw, 52px)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "#1a1615",
            lineHeight: 1.2,
            marginBottom: 18,
            fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
          }}
        >
          Your website is losing visitors right now.
        </h2>
        <p
          style={{
            color: "#666",
            fontSize: 16,
            lineHeight: 1.7,
            marginBottom: 40,
            fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
          }}
        >
          Every minute without Concier is a visitor who left without a
          conversation.
        </p>
        <div
          className="row-m"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {!done ? (
            <>
              <input
                className="inp"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              <button type="button" className="cta" onClick={submit}>
                Get early access →
              </button>
            </>
          ) : (
            <div
              style={{
                background: "#f0fdfa",
                border: "1.5px solid #99f6e4",
                borderRadius: 12,
                padding: "14px 28px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ color: TEAL, fontSize: 18 }}>✓</span>
              <span
                style={{
                  color: TEAL,
                  fontWeight: 600,
                  fontFamily:
                    '"Open Runde", "Open Runde Placeholder", sans-serif',
                }}
              >
                You&apos;re in. We&apos;ll be in touch.
              </span>
            </div>
          )}
        </div>
        <p
          style={{
            color: "#bbb",
            fontSize: 12,
            marginTop: 12,
            fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
          }}
        >
          Free during beta · No credit card · 143 spots claimed
        </p>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid #f0f0f0",
          padding: "28px max(24px, calc((100vw - 1080px) / 2))",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: TEAL,
              }}
            />
            <span
              style={{
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
                fontFamily:
                  '"Open Runde", "Open Runde Placeholder", sans-serif',
              }}
            >
              concier
            </span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy", "Terms", "Twitter"].map((l) => (
              <a key={l} href="#" className="nav-a" style={{ fontSize: 13 }}>
                {l}
              </a>
            ))}
          </div>
          <span
            style={{
              color: "#bbb",
              fontSize: 13,
              fontFamily: '"Open Runde", "Open Runde Placeholder", sans-serif',
            }}
          >
            © 2026 Concier · tryconcier.com
          </span>
        </div>
      </footer>
    </div>
  );
}
