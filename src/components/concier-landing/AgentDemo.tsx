"use client";

import { useEffect, useRef, useState } from "react";

const MESSAGES = [
  "Welcome back. Still thinking it over? I can help you work through whatever's holding you back.",
  "Most founders who land here have one specific question before they decide. What's yours?",
  "Take your time — I'm here if anything's unclear. No sales pitch, just answers.",
];

export function AgentDemo() {
  const [message, setMessage] = useState("");
  const msgIndexRef = useRef(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingRef = useRef(false);
  const displayedRef = useRef("");

  useEffect(() => {
    function clearAll() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    function type(msg: string, callback?: () => void) {
      if (!msg || typeof msg !== "string" || msg.length === 0) return;
      if (typingRef.current) return;
      typingRef.current = true;
      clearAll();

      displayedRef.current = "";
      setMessage("");
      let i = 0;
      const len = msg.length;

      intervalRef.current = setInterval(() => {
        if (i >= len) {
          clearAll();
          typingRef.current = false;
          if (callback) {
            timeoutRef.current = setTimeout(callback, 3000);
          }
          return;
        }
        const char = msg.charAt(i);
        i++;
        if (char !== "") {
          displayedRef.current += char;
          setMessage(displayedRef.current);
        }
      }, 18);
    }

    function cycle() {
      const idx = msgIndexRef.current % MESSAGES.length;
      const text = MESSAGES[idx];
      if (text) {
        type(text, () => {
          msgIndexRef.current += 1;
          cycle();
        });
      }
    }

    timeoutRef.current = setTimeout(cycle, 800);
    return () => clearAll();
  }, []);

  return (
    <section className="demo" id="how-it-works">
      <div className="fi">
        <span className="sl">The Agent</span>
        <h2 className="st">
          One message.
          <br />
          <em>Exactly right.</em>
        </h2>
        <p className="sb" style={{ marginBottom: 14 }}>
          Concier reads the room and delivers one precise, contextual message —
          at the right moment.
        </p>
        <p className="sb" style={{ marginBottom: 14 }}>
          If they ignore it, Concier steps back. No re-triggers, no pestering.
          One shot per visit.
        </p>
        <p className="sb">
          If they reply, it becomes a warm conversation — every answer straight
          from your product. Nothing invented, ever.
        </p>
      </div>
      <div className="aw fi d1">
        <div className="ab">
          <div className="bd" />
          <div className="bd" />
          <div className="bd" />
          <span className="bu">yourproduct.com/pricing</span>
        </div>
        <div className="asc">
          <div className="mh">Plans</div>
          <div className="ms">
            Choose the plan that fits your team. No hidden fees.
          </div>
          <div className="mp" style={{ justifyContent: "center", padding: "16px 0" }}>
            <div className="mpl" style={{ opacity: 0.7 }}>
              <div className="mpn">Starter · Pro · Enterprise</div>
            </div>
          </div>
          <div className="cf">
            <div className="cmc">
              <div className="cmcn">Concier</div>
              <div className="cmct">{message}</div>
              <div className="cmcir">
                <input
                  className="cmci"
                  placeholder="Ask anything..."
                  readOnly
                />
                <button type="button" className="cmcbtn">
                  ↑
                </button>
              </div>
            </div>
            <div className="cmcp">Powered by Concier</div>
          </div>
        </div>
      </div>
      <p className="demo-preview-note">
        Early preview — design and interactions will evolve.
      </p>
    </section>
  );
}
