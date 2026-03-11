import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Concier — Your website's AI salesperson";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0c0a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Subtle radial gradient like hero */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(163, 230, 53, 0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <p
          style={{
            margin: 0,
            fontSize: 20,
            color: "rgba(122, 122, 118, 0.9)",
            letterSpacing: "0.02em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Proactive AI Sales Agent
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: 56,
            fontWeight: 800,
            color: "#f0f0ee",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: "90%",
          }}
        >
          Your website closes deals.
        </h1>
        <h1
          style={{
            margin: 0,
            marginTop: 8,
            fontSize: 56,
            fontWeight: 800,
            color: "#a3e635",
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
          }}
        >
          While you sleep.
        </h1>
        <p
          style={{
            margin: 0,
            marginTop: 24,
            fontSize: 22,
            color: "rgba(122, 122, 118, 0.85)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.5,
          }}
        >
          Concier speaks first — at the right moment, with the right message.
        </p>
        <div
          style={{
            marginTop: 40,
            padding: "14px 28px",
            background: "#a3e635",
            color: "#0a0c0a",
            fontSize: 18,
            fontWeight: 700,
            borderRadius: 8,
          }}
        >
          Join waitlist
        </div>
        <p
          style={{
            margin: 0,
            marginTop: 24,
            fontSize: 16,
            color: "rgba(122, 122, 118, 0.6)",
          }}
        >
          Concier
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
