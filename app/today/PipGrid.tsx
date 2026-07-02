import { pipRows, suitGlyphId } from "@/lib/pips";
import styles from "./TodayView.module.css";

// Balanced-row pip layout for a Minor's rank, per lib/pips.ts (the fixed design-system
// asset — court cards get a single icon, Ace-Ten get row-balanced grids of the suit glyph).
export default function PipGrid({ suit, rank, color }: { suit: string; rank: number; color: string }) {
  const glyphId = suitGlyphId(suit);
  const rows = rank >= 11 ? [1] : pipRows(rank);

  return (
    <div className={styles.pips} style={{ color }}>
      {rows.map((count, i) => (
        <div className={styles.prow} key={i}>
          {Array.from({ length: count }).map((_, j) => (
            <svg key={j} aria-hidden="true">
              <use href={`#${glyphId}`} />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}
