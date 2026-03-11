export function WelcomeSection() {
  return (
    <section className="welcome">
      <div className="fi">
        <span className="sl">The Experience</span>
        <h2 className="st">
          Visitors feel
          <br />
          <em>welcomed.</em>
          <br />
          Not sold to.
        </h2>
        <p className="sb" style={{ marginBottom: 16 }}>
          Most visitors don&apos;t convert because they had a question they
          never asked. Concier makes sure they never have to wonder.
        </p>
        <p className="sb">
          No scripts. No decision trees. Just a knowledgeable presence that
          makes every visitor feel welcome enough to ask the thing that was
          stopping them.
        </p>
      </div>
      <div className="wqs fi d1">
        <div className="wq">
          <div className="wqt">
            &quot;Looks like you&apos;re evaluating a few options. Want me to
            tell you the one thing most people care about when they switch.&quot;
          </div>
          <div className="wqc">Visitor comparing alternatives</div>
        </div>
        <div className="wq">
          <div className="wqt">
            &quot;You&apos;ve read most of this page. What&apos;s the one thing
            that&apos;s still unclear?&quot;
          </div>
          <div className="wqc">Visitor in confusion</div>
        </div>
        <div className="wq">
          <div className="wqt">
            &quot;First time here? I can give you the 30-second version of what
            this actually does.&quot;
          </div>
          <div className="wqc">First-time visitor</div>
        </div>
      </div>
    </section>
  );
}
