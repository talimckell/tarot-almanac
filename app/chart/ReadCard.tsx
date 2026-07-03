import Link from "next/link";
import type { ChartReadingItem } from "@/lib/chartReadings";
import { majorGlyphId, suitGlyphId, pipRows } from "@/lib/pips";
import styles from "./page.module.css";

// One position's full reading — used for every unlocked position on /chart and
// /chart/[id], and for the always-free Bearing card everywhere. `linkToFullCard`
// controls whether a "read the full X" link is shown (the Bearing's own page gets
// one; the other Major/Minor positions already link via their name in the diagram
// above, so it isn't repeated here to avoid a wall of "read more" links).
export default function ReadCard({
  item,
  featured,
  linkText,
}: {
  item: ChartReadingItem;
  featured?: boolean;
  linkText?: string;
}) {
  return (
    <div className={`${styles.readcard} ${featured ? styles.bearingcard : ""}`}>
      <div className={styles.rcIcon}>
        {item.minorCard ? (
          <div className={styles.rcPips}>
            {(item.minorCard.rank >= 11 ? [1] : pipRows(item.minorCard.rank)).map((count, i) => (
              <div key={i} className={styles.rcPiprow}>
                {Array.from({ length: count }).map((_, j) => (
                  <svg key={j} width="16" height="16" aria-hidden="true">
                    <use href={`#${suitGlyphId(item.minorCard!.suit)}`} />
                  </svg>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <svg width="40" height="40" aria-hidden="true">
            <use href={`#${majorGlyphId(item.major!)}`} />
          </svg>
        )}
      </div>
      <div className={styles.rcBody}>
        <div className={styles.rcHead}>
          <span className={styles.rcSide}>{item.label}</span>
        </div>
        <div className={styles.rcName}>{item.name}</div>
        {item.text && <p className={styles.rcText}>{item.text}</p>}
        {linkText && (
          <Link className={styles.rcMore} href={item.href}>
            {linkText}
          </Link>
        )}
      </div>
    </div>
  );
}
