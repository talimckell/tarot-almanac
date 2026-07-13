"use client";

import { useState } from "react";
import Link from "next/link";
import { bearingIndex, MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "@/lib/almanac";
import { trackFormSubmit } from "@/lib/analytics";
import ShareImageButton from "../components/ShareImageButton";

// The tarot birth card is the Bearing: mod22(birth month + birth day), birth year
// excluded, so it holds for a whole life. Same math as /bearing's finder, wired for
// this landing page with a card-first result and the chart upsell threaded in.
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function maxDay(month: number): number {
  if (month === 2) return 29; // birth year unknown, so allow leap-day births
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

const ELEMENT_LABEL: Record<string, string> = {
  fire: "Fire", water: "Water", air: "Air", earth: "Earth",
};

export default function BirthCardCalculator() {
  const [m, setM] = useState("");
  const [d, setD] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const dayCount = m ? maxDay(Number(m)) : 31;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!m || !d) return;
    setResult(bearingIndex(Number(m), Number(d)));
    trackFormSubmit("birth_card_finder");
  }

  const selectStyle = (v: string) => (v ? undefined : { color: "var(--warm-stone)" });
  const element = result !== null ? ELEMENT_BY_MAJOR[result] : null;

  return (
    <div className="tbc-calc" id="calculator">
      <form onSubmit={onSubmit}>
        <span className="tbc-flabel">Your birthday</span>
        <div className="tbc-calc-row">
          <div className="tbc-field">
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
                <option key={label} value={String(i + 1)}>{label}</option>
              ))}
            </select>
          </div>
          <div className="tbc-field">
            <select aria-label="Birth day" value={d} style={selectStyle(d)} onChange={(e) => setD(e.target.value)}>
              <option value="">Day</option>
              {Array.from({ length: dayCount }, (_, i) => i + 1).map((day) => (
                <option key={day} value={String(day)}>{day}</option>
              ))}
            </select>
          </div>
          <button type="submit">Reveal my card</button>
        </div>
        <p className="tbc-hint">No sign-up, no email. Your birth year isn&rsquo;t needed, only the month and day.</p>
      </form>

      {result !== null && element && (
        <div className="tbc-result">
          <span className="tbc-glyph" style={{ color: `var(--${element})` }}>
            <svg viewBox="0 0 46 46" aria-label={`${MAJORS[result]} glyph`}>
              <use href={`#ma-${result}`} />
            </svg>
          </span>
          <div className="tbc-result-body">
            <p className="tbc-rlead">Your tarot birth card is</p>
            <p className="tbc-rname">{MAJORS[result]}</p>
            <span className={`tbc-chip ${element}`}>
              <span className="dot" />
              {ELEMENT_LABEL[element]}
            </span>
            <div className="tbc-result-actions">
              <Link className="tbc-cta-link" href={`/bearing/${MAJOR_SLUGS[result]}`}>
                {`Read what ${MAJORS[result]} means`}{" "}&rarr;
              </Link>
              <ShareImageButton
                imagePath={`/bearing/${MAJOR_SLUGS[result]}/share/image`}
                pagePath={`/bearing/${MAJOR_SLUGS[result]}/share`}
                linkPath="/tarot-birth-card"
                title={`My tarot birth card is ${MAJORS[result]}`}
                text={`My tarot birth card is ${MAJORS[result]} · The Tarot Almanac`}
                label="Share my card"
              />
            </div>
            <p className="tbc-upnudge">
              This is one of the seven cards in your{" "}
              <Link href="/tarot-birth-chart">full tarot birth chart</Link>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
