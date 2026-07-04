"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { bearingIndex, MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "@/lib/almanac";
import ShareImageButton from "../components/ShareImageButton";
import BearingFinder from "./bearing-finder";
import styles from "./page.module.css";

interface ViewerBirthday {
  known: boolean;
  bm?: number;
  bd?: number;
  name?: string | null;
}

// Replaces the manual finder with "Your Bearing is X" when the visitor's birthday is
// already known (signed in, or the bday cookie /today's reveal form sets) — checked via
// a client-side fetch (see app/api/viewer-birthday) so /bearing itself stays statically
// generated. Falls back to the finder while that check is in flight or comes back empty,
// so a first-time/anonymous visitor sees exactly what they saw before this existed.
export default function BearingHero() {
  const [viewer, setViewer] = useState<ViewerBirthday | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/viewer-birthday")
      .then((r) => r.json())
      .then((data: ViewerBirthday) => {
        if (!cancelled) setViewer(data);
      })
      .catch(() => {
        if (!cancelled) setViewer({ known: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!viewer?.known || viewer.bm === undefined || viewer.bd === undefined) {
    return <BearingFinder />;
  }

  const result = bearingIndex(viewer.bm, viewer.bd);
  const slug = MAJOR_SLUGS[result];
  const name = viewer.name ?? undefined;

  return (
    <div className={styles.finder}>
      <span className={styles.flabel}>{name ? `${name}'s Bearing` : "Your Bearing"}</span>
      <div className={styles.result}>
        <span className={styles.rglyph} style={{ color: `var(--${ELEMENT_BY_MAJOR[result]})` }}>
          <svg aria-hidden="true">
            <use href={`#ma-${result}`} />
          </svg>
        </span>
        <div className={styles.rname}>{MAJORS[result]}</div>
        <Link className={styles.rlink} href={`/bearing/${slug}`}>
          Read your Bearing &rarr;
        </Link>
        <div style={{ marginTop: 14 }}>
          <ShareImageButton
            imagePath={`/bearing/${slug}/share/image${name ? `?n=${encodeURIComponent(name)}` : ""}`}
            pagePath={`/bearing/${slug}/share${name ? `?n=${encodeURIComponent(name)}` : ""}`}
            linkPath="/bearing"
            title={`${name ? `${name}'s` : "My"} Bearing is ${MAJORS[result]}`}
            text={`${name ? `${name}'s` : "My"} Bearing is ${MAJORS[result]} · The Tarot Almanac`}
            label="Share my Bearing"
          />
        </div>
      </div>
    </div>
  );
}
