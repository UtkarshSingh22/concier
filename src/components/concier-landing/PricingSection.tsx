"use client";

import Link from "next/link";
import { useCallback, useState } from "react";

const PRICES = [
  { max: 1000, p: 19 },
  { max: 3000, p: 29 },
  { max: 7000, p: 49 },
  { max: 15000, p: 79 },
  { max: 25000, p: 119 },
  { max: 35000, p: 159 },
  { max: 50000, p: 199 },
];

function getPrice(v: number): number {
  for (const x of PRICES) if (v <= x.max) return x.p;
  return 199;
}

function conversionsLabel(price: number): string {
  const n = Math.ceil(price / 79);
  return n === 1 ? "1 conversion" : `${n} conversions`;
}

export function PricingSection() {
  const [visitors, setVisitors] = useState(5000);
  const price = getPrice(visitors);
  const convLabel = conversionsLabel(price);

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVisitors(parseInt(e.target.value, 10));
  }, []);

  return (
    <section className="pricing" id="pricing">
      <div className="pi">
        <div className="fi">
          <span className="sl">Pricing</span>
          <h2 className="st">
            Pays for itself.
            <br />
            <em>Every month.</em>
          </h2>
          <p className="sb" style={{ marginBottom: 16 }}>
            Priced by monthly visitors. Not seats, not conversations, not
            messages sent.
          </p>
          <p className="sb" style={{ marginBottom: 16 }}>
            One extra conversion a month — one visitor who would have left, who
            didn&apos;t — covers the entire subscription. Everything after that
            is pure upside.
          </p>
          <p className="sb">
            97–99% margin on every plan. The math works at every scale.
          </p>
        </div>
        <div className="pc fi d1">
          <span className="cl">Monthly visitors</span>
          <div className="cvd">{visitors.toLocaleString()}</div>
          <span className="cvu">visitors / month</span>
          <input
            type="range"
            className="cslider"
            min={100}
            max={50000}
            value={visitors}
            step={100}
            onChange={handleSlider}
            aria-label="Monthly visitors"
          />
          <div className="csl">
            <span>100</span>
            <span>10K</span>
            <span>25K</span>
            <span>50K</span>
          </div>
          <div className="cdiv" />
          <div className="crr">
            <div>
              <div className="cprice">
                <span className="cprice-c">$</span>
                {price}
              </div>
              <span className="cpmo">per month</span>
            </div>
            <div className="cpi">
              <span className="cpin">{convLabel}</span>
              <span className="cpil">
                pays for the
                <br />
                whole month
              </span>
            </div>
          </div>
          <Link href="#waitlist" className="btncalc">
            Join waitlist at this price
          </Link>
        </div>
      </div>
    </section>
  );
}
