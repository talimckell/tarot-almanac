import Link from "next/link";
import type { ReactNode } from "react";
import type { NatalChart, MajorPosition } from "@/lib/natalChart";
import type { DayCard } from "@/lib/almanac";
import { pipRows, suitGlyphId, majorGlyphId } from "@/lib/pips";
import styles from "./ChartDiagram.module.css";

function MajorGlyph({ major, size = 46 }: { major: number; size?: number }) {
  return (
    <svg width={size} height={size} aria-hidden="true">
      <use href={`#${majorGlyphId(major)}`} />
    </svg>
  );
}

function MinorPips({ card, size = 14 }: { card: DayCard; size?: number }) {
  const glyphId = suitGlyphId(card.suit);
  const rows = card.rank >= 11 ? [1] : pipRows(card.rank);
  return (
    <div className={styles.pips}>
      {rows.map((count, i) => (
        <div className={styles.piprow} key={i}>
          {Array.from({ length: count }).map((_, j) => (
            <svg key={j} width={size} height={size} aria-hidden="true">
              <use href={`#${glyphId}`} />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}

// A Year/Month cell (always a Major): shows the real glyph + element color even
// when locked (matches the mockup precisely — glyphs render identically in both
// its full and locked states). What's withheld when locked is just the name and
// its link.
function MajorCell({ pos, poslabel, unlocked }: { pos: MajorPosition; poslabel: string; unlocked: boolean }) {
  return (
    <div className={styles.cardcell}>
      <div className={styles.cardglyph} style={{ color: `var(--${pos.element})` }}>
        <MajorGlyph major={pos.major} />
      </div>
      {unlocked ? (
        <div className={styles.poslabel}>
          <Link href={`/tarot/${pos.slug}`}>{pos.name}</Link>
        </div>
      ) : (
        <div className={styles.poslabel}>{poslabel}</div>
      )}
    </div>
  );
}

function minorSlug(card: DayCard): string {
  return `${card.rankName.toLowerCase()}-of-${card.suit.toLowerCase()}`;
}

function MinorCell({ card, poslabel, unlocked }: { card: DayCard; poslabel: string; unlocked: boolean }) {
  return (
    <div className={styles.cardcell}>
      <div className={styles.cardglyph} style={{ color: `var(--${card.element})` }}>
        <MinorPips card={card} />
      </div>
      {unlocked ? (
        <div className={styles.poslabel}>
          <Link href={`/tarot/${minorSlug(card)}`}>{card.minorName}</Link>
        </div>
      ) : (
        <div className={styles.poslabel}>{poslabel}</div>
      )}
    </div>
  );
}

export default function ChartDiagram({
  chart,
  unlocked,
  columnLabel,
  they,
}: {
  chart: NatalChart;
  unlocked: boolean;
  columnLabel: string; // "You" or the saved person's name
  they: boolean; // false for the account holder's own chart (uses "you"/"your")
}) {
  const subj = they ? "they" : "you";
  const obj = they ? "them" : "you";

  return (
    <div className={styles.chart}>
      <div className={styles.colheads}>
        <div />
        <div className={styles.colhead}>{columnLabel}</div>
        <div />
        <div className={styles.colhead}>The World</div>
      </div>
      <div className={styles.chartframe}>
        <div className={styles.channelLine} />

        <div className={styles.depthrow}>
          <div className={styles.rowlabel}>Year</div>
          <MajorCell pos={chart.personalYear} poslabel="sun · core self" unlocked={unlocked} />
          <div />
          <MajorCell pos={chart.collectiveYear} poslabel={`what ${subj} inherited`} unlocked={unlocked} />
        </div>

        <div className={styles.depthrow}>
          <div className={styles.rowlabel}>Month</div>
          <MajorCell pos={chart.personalMonth} poslabel="moon · inner life" unlocked={unlocked} />
          <div />
          <MajorCell pos={chart.collectiveMonth} poslabel={`the climate ${subj} formed in`} unlocked={unlocked} />
        </div>

        <div className={styles.depthrow}>
          <div className={styles.rowlabel}>Day</div>
          <MinorCell card={chart.personalDayMinor} poslabel={`rising · how ${subj} meet a room`} unlocked={unlocked} />
          <div />
          <MinorCell card={chart.collectiveDayMinor} poslabel={`the day that caught ${obj}`} unlocked={unlocked} />
        </div>

        <div className={styles.bearing}>
          <span className={styles.blabel}>Bearing</span>
          <MajorGlyph major={chart.bearing.major} size={40} />
          <span className={styles.bname}>{chart.bearing.name}</span>
        </div>
      </div>
    </div>
  );
}

function LockedTile({
  element,
  glyph,
  poslabel,
}: {
  element: string;
  glyph: ReactNode;
  poslabel: string;
}) {
  return (
    <div className={styles.lockedcard}>
      <div className={styles.lcIcon} style={{ color: `var(--${element})` }}>
        {glyph}
      </div>
      <div>
        <div className={styles.lcPos}>{poslabel}</div>
        <div className={styles.lcLockline}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <rect x="5" y="11" width="14" height="9" rx="1" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          Unlock to read
        </div>
      </div>
    </div>
  );
}

// The "other six positions" teaser grid — same six positions as the diagram above,
// shown again as a locked summary. Used by /chart's paywall and /gift/[token]'s
// preview; /chart/[person] never renders this since a saved chart is always unlocked.
export function LockedPositionsGrid({ chart, they, heading }: { chart: NatalChart; they: boolean; heading: string }) {
  const subj = they ? "they" : "you";
  const obj = they ? "them" : "you";

  return (
    <>
      <div className={styles.lockedHead}>{heading}</div>
      <div className={styles.lockgrid}>
        <LockedTile
          element={chart.personalYear.element}
          glyph={<MajorGlyph major={chart.personalYear.major} size={34} />}
          poslabel="Sun · core self"
        />
        <LockedTile
          element={chart.collectiveYear.element}
          glyph={<MajorGlyph major={chart.collectiveYear.major} size={34} />}
          poslabel={`What ${subj} inherited`}
        />
        <LockedTile
          element={chart.personalMonth.element}
          glyph={<MajorGlyph major={chart.personalMonth.major} size={34} />}
          poslabel="Moon · inner life"
        />
        <LockedTile
          element={chart.collectiveMonth.element}
          glyph={<MajorGlyph major={chart.collectiveMonth.major} size={34} />}
          poslabel={`The climate ${subj} formed in`}
        />
        <LockedTile
          element={chart.personalDayMinor.element}
          glyph={<MinorPips card={chart.personalDayMinor} size={13} />}
          poslabel={`How ${subj} meet a room`}
        />
        <LockedTile
          element={chart.collectiveDayMinor.element}
          glyph={<MinorPips card={chart.collectiveDayMinor} size={13} />}
          poslabel={`The day that caught ${obj}`}
        />
      </div>
    </>
  );
}
