export function StatesSection() {
  return (
    <section className="states">
      <div className="sh fi">
        <div>
          <span className="sl">How It Works</span>
          <h2 className="st">
            Three states.
            <br />
            <em>One seamless loop.</em>
          </h2>
        </div>
        <p
          style={{
            fontSize: 14,
            color: "var(--text-dim)",
            lineHeight: 1.8,
          }}
        >
          Every visitor moves through three states automatically. Concier
          manages all three — silently, intelligently, without any input from
          you.
        </p>
      </div>
      <div className="sg">
        <div className="sc fi">
          <span className="snum">01</span>
          <span className="slbl">State One</span>
          <h3 className="stitle">Concier reads the room.</h3>
          <p className="sbody">
            Completely silent. A small pill sits at the bottom of the screen
            while it gets the lay of the land. No cookies. No stored data. GDPR
            compliant. When the moment is right, it speaks.
          </p>
        </div>
        <div className="sc fi d1">
          <span className="snum">02</span>
          <span className="slbl">State Two</span>
          <h3 className="stitle">One message. Exactly right.</h3>
          <p className="sbody">
            One specific, contextual message — not a greeting, something that
            shows it&apos;s been paying attention. One attempt only. If
            dismissed, Concier retreats and never reappears that session. If they
            reply, it becomes a warm conversation. Every answer from your actual
            product. Nothing invented, ever.
          </p>
        </div>
        <div className="sc fi d2">
          <span className="snum">03</span>
          <span className="slbl">State Three</span>
          <h3 className="stitle">Walks them through visually.</h3>
          <p className="sbody">
            When a visitor is confused, Concier walks them through your product
            visually — like a human pointing at the screen. Your product
            explains itself. No other tool at any price does this.
          </p>
        </div>
      </div>
    </section>
  );
}
