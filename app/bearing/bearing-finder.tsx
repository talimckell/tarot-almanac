"use client";

import { useState } from "react";
import Link from "next/link";
import { mod22, MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "@/lib/almanac";
import styles from "./page.module.css";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export default function BearingFinder() {
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);
  const [result, setResult] = useState<number | null>(null);

  const reveal = () => setResult(mod22(month + day));

  return (
    <div className={styles.finder}>
      <span className={styles.flabel}>Find your Bearing</span>
      <div className={styles.row}>
        <select
          aria-label="Birth month"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {MONTHS.map((name, i) => (
            <option key={name} value={i + 1}>{name}</option>
          ))}
        </select>
        <select
          aria-label="Birth day"
          value={day}
          onChange={(e) => setDay(Number(e.target.value))}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        <button type="button" onClick={reveal}>Reveal</button>
      </div>

      {result !== null && (
        <div className={styles.result}>
          <span className={styles.rglyph} style={{ color: `var(--${ELEMENT_BY_MAJOR[result]})` }}>
            <svg aria-hidden="true">
              <use href={`#ma-${result}`} />
            </svg>
          </span>
          <div className={styles.rname}>{MAJORS[result]}</div>
          <Link className={styles.rlink} href={`/bearing/${MAJOR_SLUGS[result]}`}>
            Read your Bearing &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
