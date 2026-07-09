"use client";

import { useState } from "react";
import Link from "next/link";
import {
  yearCardIndex,
  yearCardContent,
  majorName,
  majorShortName,
  majorSlug,
  majorElement,
} from "../../lib/yearCard";
import { YEAR_READING_PRICE_DISPLAY } from "../../lib/yearReadingPricing";
import { startYearReadingCheckout } from "./checkoutActions";
import { trackFormSubmit } from "@/lib/analytics";

// The year card depends only on birth month + birth day and the calendar year
// being read (birth year is not used, same as the Bearing). So we ask for month
// and day only, and a year to read. This is a lens tool: it computes the card and
// links to its full evergreen page rather than minting a per-birthday URL.

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// Days per month for a birthday. Feb allows 29 (leap-year births), since the birth
// year isn't collected.
function maxDay(month: number): number {
  if (month === 2) return 29;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

export default function YearCardCalculator() {
  const now = new Date().getFullYear();
  const YEARS = [now - 1, now, now + 1, now + 2, now + 3];

  const [m, setM] = useState("");
  const [d, setD] = useState("");
  const [y, setY] = useState(String(now));
  const [result, setResult] = useState<{ idx: number; year: number; m: string; d: string } | null>(null);

  const dayCount = m ? maxDay(Number(m)) : 31;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!m || !d) return;
    const idx = yearCardIndex(Number(y), Number(m), Number(d));
    setResult({ idx, year: Number(y), m, d });
    trackFormSubmit("personal_year_card", { year_read: Number(y) });
  }

  const selectStyle = (v: string) => (v ? undefined : { color: "var(--warm-stone)" });

  return (
    <div className="pyc-calc">
      <form onSubmit={onSubmit}>
        <span className="flabel">Your birthday</span>
        <div className="pyc-calc-row">
          <div className="pyc-field">
            <select
              aria-label="Birth month"
              value={m}
              style={selectStyle(m)}
              onChange={(e) => {
                setM(e.target.value);
                if (d && Number(d) > maxDay(Number(e.target.value))) setD("");
              }}
            >
              <option value="">Month</option>
              {MONTHS.map((label, i) => (
                <option key={label} value={pad(i + 1)}>{label}</option>
              ))}
            </select>
          </div>
          <div className="pyc-field">
            <select aria-label="Birth day" value={d} style={selectStyle(d)} onChange={(e) => setD(e.target.value)}>
              <option value="">Day</option>
              {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
                <option key={day} value={pad(day)}>{day}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="hint" style={{ marginTop: 8 }}>Month and day only. Your birth year isn&rsquo;t needed.</p>

        <span className="flabel" style={{ marginTop: 20 }}>Which year do you want to read?</span>
        <p className="hint" style={{ marginTop: 4, marginBottom: 10 }}>
          Not your birth year. The calendar year you want the reading for, usually this one.
        </p>
        <div className="pyc-calc-row">
          <div className="pyc-field">
            <select aria-label="Year to read" value={y} onChange={(e) => setY(e.target.value)}>
              {YEARS.map((yr) => (
                <option key={yr} value={String(yr)}>{yr}</option>
              ))}
            </select>
          </div>
          <button type="submit">Find my card</button>
        </div>
      </form>

      {result && (
        <div className="pyc-result">
          <span className="pyc-glyph" style={{ color: `var(--${majorElement(result.idx)})` }}>
            <svg viewBox="0 0 46 46" aria-label={`${majorName(result.idx)} glyph`}>
              <use href={`#ma-${result.idx}`} />
            </svg>
          </span>
          <div>
            <p className="rlead">Your {result.year} year card is</p>
            <p className="rname">{majorName(result.idx)}</p>
            <p className="rblurb">{yearCardContent(result.idx).blurb}</p>
            <Link className="cta" href={`/personal-year-card/${majorSlug(result.idx)}`}>
              Read the full {`${majorShortName(result.idx)} year`} &rarr;
            </Link>

            <form action={startYearReadingCheckout} className="pyc-buy">
              <input type="hidden" name="bm" value={result.m} />
              <input type="hidden" name="bd" value={result.d} />
              <input type="hidden" name="year" value={String(result.year)} />
              <input name="name" className="pyc-buy-name" placeholder="Name for the reading (yours, or a gift)" maxLength={40} />
              <button type="submit" className="pyc-cta-btn">
                Get the full woven reading · {YEAR_READING_PRICE_DISPLAY}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
