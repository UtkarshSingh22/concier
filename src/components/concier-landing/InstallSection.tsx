export function InstallSection() {
  return (
    <section className="install" id="install">
      <div className="fi">
        <span className="sl">Setup</span>
        <h2 className="st">
          One afternoon.
          <br />
          <em>One script tag.</em>
        </h2>
        <p className="sb" style={{ marginBottom: 28 }}>
          Works on any website — Webflow, Framer, WordPress, custom React. Zero
          PageSpeed impact. Under 5KB. Sub-200ms globally.
        </p>
        <div className="isteps">
          <div className="is">
            <span className="isn">01</span>
            <div className="ist">
              Paste <strong>one script tag</strong> before{" "}
              <code
                style={{
                  fontFamily: "var(--fm)",
                  color: "var(--lime)",
                  fontSize: 12,
                }}
              >
                &lt;/body&gt;
              </code>{" "}
              on every page.
            </div>
          </div>
          <div className="is">
            <span className="isn">02</span>
            <div className="ist">
              Concier <strong>learns your product</strong> and matches your
              brand. Automatically.
            </div>
          </div>
          <div className="is">
            <span className="isn">03</span>
            <div className="ist">
              <strong>Preview</strong> the full experience on your own site
              before going live.
            </div>
          </div>
          <div className="is">
            <span className="isn">04</span>
            <div className="ist">
              Toggle <strong>Live</strong>. Every visitor now has a personal
              guide.
            </div>
          </div>
        </div>
      </div>
      <div className="cb fi d1">
        <span className="cc">
          {"<!-- Paste before </body> on every page -->"}
        </span>
        <br />
        <br />
        <span className="ct">{"<script"}</span>
        <br />
        {"  "}
        <span className="ca">src</span>=<span className="cv">"https://cdn.concier.ai/agent.js"</span>
        <br />
        {"  "}
        <span className="ca">data-site-id</span>=<span className="cv">"your-site-id"</span>
        <br />
        {"  "}
        <span className="ca">async</span>
        <br />
        {"  "}
        <span className="ca">defer</span>
        <br />
        <span className="ct">{"</script>"}</span>
        <br />
        <br />
        <span className="cc">
          {"<!-- That's it. Concier handles the rest. -->"}
        </span>
      </div>
    </section>
  );
}
