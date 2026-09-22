"use client";

import { useState } from "react";
import Link from "next/link";
import {
  yearCardIndex,
  yearCardContent,
  yearMonths,
  majorName,
  majorShortName,
  majorSlug,
  majorElement,
  maxDay,
  parseYearCardResumeParams,
} from "../../lib/yearCard";
import { YEAR_READING_PRICE_DISPLAY } from "../../lib/yearReadingPricing";
import { startYearReadingCheckout } from "./checkoutActions";
import InAppBrowserNotice from "../components/InAppBrowserNotice";
import { trackFormSubmit } from "@/lib/analytics";
import PrivacyNote from "../components/PrivacyNote";

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

export default function YearCardCalculator({
  resume,
}: {
  // Set only when landing back here from the sign-in redirect in checkoutActions.ts —
  // lets the result reappear immediately instead of making them redo the calculator.
  // The main post-sign-in path now goes through /personal-year-card/continue instead
  // (a focused confirm step, not the full calculator), so this is a fallback for
  // anyone who lands on this bare page with the params some other way.
  resume?: { bm: string; bd: string; year: string };
}) {
  const now = new Date().getFullYear();
  const YEARS = [now - 1, now, now + 1, now + 2, now + 3];
  const parsed = resume && parseYearCardResumeParams(resume.bm, resume.bd, resume.year);
  const initial = parsed
    ? { bm: String(parsed.bm).padStart(2, "0"), bd: String(parsed.bd).padStart(2, "0"), year: String(parsed.year) }
    : undefined;

  const [m, setM] = useState(initial?.bm ?? "");
  const [d, setD] = useState(initial?.bd ?? "");
  const [y, setY] = useState(initial?.year ?? String(now));
  // Not re-tracked as a form_submit: the original submit already fired client-side
  // before the sign-in redirect, so restoring it here isn't a new submission.
  const [result, setResult] = useState<{ idx: number; year: number; m: string; d: string } | null>(() =>
    initial
      ? {
          idx: yearCardIndex(Number(initial.year), Number(initial.bm), Number(initial.bd)),
          year: Number(initial.year),
          m: initial.bm,
          d: initial.bd,
        }
      : null,
  );

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
        <PrivacyNote style={{ marginTop: 4 }} />

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
        <>
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
            </div>
          </div>

          {/* Free preview of the actual paid product's structure: the same twelve-month
              wheel the $15 report walks month by month, computed the same way
              (buildYearPackage), but glyph + card name only, no reading text. Mirrors the
              chart preview's leak-proofing pattern (structure free, prose paid) — this is
              personalized to the birthday just entered, not a generic sample. */}
          <div className="pyc-result-wheel">
            <span className="pyc-eyebrow" style={{ marginBottom: 10 }}>
              Your {result.year} year wheel
            </span>
            <p className="hint" style={{ marginTop: 0, marginBottom: 14 }}>
              The twelve months that follow from your year card, one Major each. The full
              reading goes through every month. This is the shape of it.
            </p>
            <div className="pyc-arc">
              {yearMonths(result.idx).map((mi, i) => (
                <div className="pyc-arc-item" key={i}>
                  <span className="pyc-glyph" style={{ color: `var(--${majorElement(mi)})` }}>
                    <svg viewBox="0 0 46 46" aria-hidden="true">
                      <use href={`#ma-${mi}`} />
                    </svg>
                  </span>
                  <span>
                    <span className="mon">{MONTHS[i]}</span>
                    <br />
                    <span className="cardname">{majorName(mi)}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <InAppBrowserNotice />

          <form action={startYearReadingCheckout} className="pyc-buy">
            <input type="hidden" name="bm" value={result.m} />
            <input type="hidden" name="bd" value={result.d} />
            <input type="hidden" name="year" value={String(result.year)} />
            <input name="name" className="pyc-buy-name" placeholder="Name for the reading (yours, or a gift)" maxLength={40} />
            <button type="submit" className="pyc-cta-btn">
              Get your full year reading · {YEAR_READING_PRICE_DISPLAY}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
