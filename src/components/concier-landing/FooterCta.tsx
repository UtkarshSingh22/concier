"use client";

import { useState } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function FooterCta() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [inputError, setInputError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleWaitlist() {
    const trimmed = email.trim();
    setError(null);
    setInputError(false);

    if (!trimmed) {
      setInputError(true);
      setError("Please enter your email address.");
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setInputError(true);
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setSuccessMessage(
        data.alreadyOnList
          ? "You're already on the list. We'll be in touch."
          : "You're on the list. We'll be in touch."
      );
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="wl" id="waitlist">
      <div className="wl-bg">Concier</div>
      <h2 className="wl-title fi">
        Your website should
        <br />
        <em>make the first move.</em>
      </h2>
      <p className="wl-sub fi d1">
        Join the waitlist. First 50 founders get locked-in pricing forever.
      </p>
      <p className="wl-tagline fi d1">
        The waitlist isn&apos;t just a queue — it&apos;s where the product gets
        shaped.
      </p>
      {!submitted ? (
        <div className="wf-wrap fi d2">
          <div className="wf">
            <input
              type="email"
              className="wi"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setInputError(false);
                setError(null);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleWaitlist()}
              style={{
                borderColor: inputError ? "rgba(163,230,53,0.6)" : undefined,
              }}
              aria-invalid={inputError}
              aria-describedby={error ? "wl-error" : undefined}
            />
            <button
              type="button"
              className="wb"
              onClick={handleWaitlist}
              disabled={loading}
            >
              {loading ? "Joining…" : "Join waitlist"}
            </button>
          </div>
          {error && (
            <p
              id="wl-error"
              className="wl-err"
              role="alert"
              style={{
                marginTop: 10,
                marginBottom: 0,
                fontSize: 13,
                color: "var(--lime)",
                width: "100%",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}
        </div>
      ) : (
        <p
          className="wl-success"
          style={{
            fontFamily: "var(--fm)",
            fontSize: 14,
            letterSpacing: "0.12em",
            color: "var(--lime)",
            textTransform: "uppercase",
            padding: "24px 0",
            position: "relative",
            margin: 0,
          }}
        >
          ✦ &nbsp; {successMessage}
        </p>
      )}
      <p className="wn fi">
        No spam &nbsp;·&nbsp; No sales call &nbsp;·&nbsp; No credit card
      </p>
    </section>
  );
}
