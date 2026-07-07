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
  const [result, setResult] = useState<{ idx: number; year: number } | null>(null);

  const dayCount = m ? maxDay(Number(m)) : 31;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!m || !d) return;
    const idx = yearCardIndex(Number(y), Number(m), Number(d));
    setResult({ idx, year: Number(y) });
  }

  const selectStyle = (v: string) => (v ? undefined : { color: "var(--warm-stone)" });

  return (
    <div className="pyc-calc">
      <form onSubmit={onSubmit}>
        <span className="flabel">Your birthday and the year to read</span>
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
          <div className="pyc-field">
            <select aria-label="Year to read" value={y} onChange={(e) => setY(e.target.value)}>
              {YEARS.map((yr) => (
                <option key={yr} value={String(yr)}>{yr}</option>
              ))}
            </select>
          </div>
          <button type="submit">Find my card</button>
        </div>
        <p className="hint">Your birth year isn&rsquo;t needed. The year card is set by your month, your day, and the year you&rsquo;re reading.</p>
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
              Read the full {majorShortName(result.idx)} year &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
