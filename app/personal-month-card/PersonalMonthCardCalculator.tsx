"use client";

import { useState } from "react";
import Link from "next/link";
import {
  monthCardIndex,
  majorName,
  majorShortName,
  majorSlug,
  majorElement,
  MONTH_NAMES,
} from "../../lib/monthCard";
import { trackFormSubmit } from "@/lib/analytics";

// The month card depends on birth month + birth day, the calendar year, and the
// month being read (birth year is not used, same as the year card and Bearing).
// So we ask for the birthday (month + day) and which month to read (month + year).
// It's a lens tool: it computes the card and links to its evergreen page rather
// than minting a per-birthday URL. The 22 authored month meanings are passed in as
// `bodies` (index-aligned to the Majors), read server-side from the card JSONs so
// this client bundle never pulls the full card content.

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

export default function PersonalMonthCardCalculator({ bodies }: { bodies: string[] }) {
  const nowDate = new Date();
  const now = nowDate.getFullYear();
  const thisMonth = nowDate.getMonth() + 1;
  const YEARS = [now - 1, now, now + 1, now + 2, now + 3];

  const [bm, setBm] = useState("");
  const [bd, setBd] = useState("");
  const [rm, setRm] = useState(pad(thisMonth));
  const [ry, setRy] = useState(String(now));
  const [result, setResult] = useState<{ idx: number; ry: number; rm: string } | null>(null);

  const dayCount = bm ? maxDay(Number(bm)) : 31;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bm || !bd) return;
    const idx = monthCardIndex(Number(ry), Number(rm), Number(bm), Number(bd));
    setResult({ idx, ry: Number(ry), rm });
    trackFormSubmit("personal_month_card", { month_read: `${ry}-${rm}` });
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
              value={bm}
              style={selectStyle(bm)}
              onChange={(e) => {
                setBm(e.target.value);
                if (bd && Number(bd) > maxDay(Number(e.target.value))) setBd("");
              }}
            >
              <option value="">Month</option>
              {MONTHS.map((label, i) => (
                <option key={label} value={pad(i + 1)}>{label}</option>
              ))}
            </select>
          </div>
          <div className="pyc-field">
            <select aria-label="Birth day" value={bd} style={selectStyle(bd)} onChange={(e) => setBd(e.target.value)}>
              <option value="">Day</option>
              {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
                <option key={day} value={pad(day)}>{day}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="hint" style={{ marginTop: 8 }}>Month and day only. Your birth year isn&rsquo;t needed.</p>

        <span className="flabel" style={{ marginTop: 20 }}>Which month do you want to read?</span>
        <p className="hint" style={{ marginTop: 4, marginBottom: 10 }}>
          The calendar month you want the card for, usually this one.
        </p>
        <div className="pyc-calc-row">
          <div className="pyc-field">
            <select aria-label="Month to read" value={rm} style={selectStyle(rm)} onChange={(e) => setRm(e.target.value)}>
              {MONTHS.map((label, i) => (
                <option key={label} value={pad(i + 1)}>{label}</option>
              ))}
            </select>
          </div>
          <div className="pyc-field">
            <select aria-label="Year to read" value={ry} onChange={(e) => setRy(e.target.value)}>
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
            <p className="rlead">
              Your {MONTH_NAMES[Number(result.rm) - 1]} {result.ry} card is
            </p>
            <p className="rname">{majorName(result.idx)}</p>
            {bodies[result.idx] && <p className="rblurb">{bodies[result.idx]}</p>}
            <Link className="cta" href={`/personal-month-card/${majorSlug(result.idx)}`}>
              {`Read a ${majorShortName(result.idx)} month in full `}&rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
