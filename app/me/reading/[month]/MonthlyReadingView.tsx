import Link from "next/link";
import type { MonthlyPackage } from "@/lib/monthlyReading";
import type { MonthlyReadingSections } from "@/lib/monthlyReadingPrompt";
import { majorGlyphId, suitGlyphId } from "@/lib/pips";
import ShareImageButton from "../../../components/ShareImageButton";
import styles from "./MonthlyReadingView.module.css";

// Ships verbatim per MONTHLY_READING_BUILD_BRIEF.md hard rule #4 ("Disclosed").
const AI_DISCLOSURE =
  "The cards above are fixed by the math, and you can check them yourself. The writing that ties them together was composed by AI from the Tarot Almanac's framework. If anything reads wrong, tell us at support@tarotalmanac.com.";

const SUPPORT_NOTE =
  "We couldn't put this month's story together. We've already flagged it. If it's still missing tomorrow, tell us at support@tarotalmanac.com.";

export default function MonthlyReadingView({
  name,
  monthSlug,
  bm,
  bd,
  pkg,
  status,
  sections,
}: {
  name: string | null;
  monthSlug: string;
  bm: number;
  bd: number;
  pkg: MonthlyPackage;
  status: "ready" | "failed";
  sections: MonthlyReadingSections | null;
}) {
  const { monthCard, weeks, circledDates } = pkg;
  const wovenParagraphs = sections?.woven.split(/\n\s*\n/).filter(Boolean) ?? [];

  const shareQ = new URLSearchParams({ bm: String(bm), bd: String(bd) });
  if (name) shareQ.set("n", name);
  const shareImg = `/me/reading/${monthSlug}/share/image?${shareQ}`;
  const sharePage = `/me/reading/${monthSlug}/share?${shareQ}`;

  return (
    <div className={styles.wrap}>
      <div className={styles.crumb}>
        <Link href="/me">My Almanac</Link> / This month
      </div>

      <div className={styles.head}>
        <span className={styles.eyebrow}>Your Month</span>
        <h1>{pkg.monthLabel}</h1>
        {name && <p className={styles.who}>for {name}</p>}
        <div style={{ marginTop: 16 }}>
          <ShareImageButton
            imagePath={shareImg}
            pagePath={sharePage}
            linkPath="/me"
            title={`${name ? `${name}'s` : "My"} card for ${pkg.monthLabel}`}
            text={`${monthCard.name} · The Tarot Almanac`}
            label="Share this month's card"
          />
        </div>
      </div>

      {sections ? (
        <p className={styles.framing}>{sections.framing}</p>
      ) : (
        <p className={styles.framing}>
          {monthCard.name} governs {pkg.monthLabel}, {monthCard.element}.
        </p>
      )}

      <div className={styles.monthcard}>
        <div className={styles.mcGlyph} style={{ color: `var(--${monthCard.element})` }}>
          <svg width="52" height="52" aria-hidden="true">
            <use href={`#${majorGlyphId(monthCard.major)}`} />
          </svg>
        </div>
        <div className={styles.mcBody}>
          <div className={styles.mcLabel}>Your month card</div>
          <div className={styles.mcName}>{monthCard.name}</div>
          <div className={styles.mcMeta}>
            {monthCard.numberLabel ? `Major Arcana ${monthCard.numberLabel} · ` : ""}
            {cap(monthCard.element)} · {monthCard.tagline}
          </div>
          {sections && <p className={styles.mcCycle}>{sections.cycleLine}</p>}
          <p className={styles.mcAuthored}>{monthCard.thisMonthReading}</p>
        </div>
      </div>

      <div className={styles.secH}>Week by week</div>
      <div className={styles.secRule} />
      {weeks.map((week, i) => (
        <div className={styles.week} key={week.n}>
          <div className={styles.weekHead}>
            <span className={styles.wkN}>Week {week.n}</span>
            <span className={styles.wkSpan}>{week.span}</span>
          </div>
          <div className={styles.weekGrid}>
            {week.days.map(({ d, card }) => (
              <div className={styles.dc} key={d}>
                <span className={styles.dcD}>{d}</span>
                <span className={styles.dcG} style={{ color: `var(--${card.element})` }}>
                  <svg width="15" height="15" aria-hidden="true">
                    <use href={`#${suitGlyphId(card.suit)}`} />
                  </svg>
                </span>
                <span className={styles.dcC}>{card.minorName}</span>
              </div>
            ))}
          </div>
          {sections && <p className={styles.wkText}>{sections.weekTextures[i]}</p>}
        </div>
      ))}

      <div className={styles.secH}>Dates to circle</div>
      <div className={styles.secRule} />
      {circledDates.length === 0 ? (
        <p className={styles.wkText}>
          {sections?.evenMonthNote || "Nothing repeats this month. An even stretch, and that's its own kind of reading."}
        </p>
      ) : (
        circledDates.map((c, i) => (
          <div className={styles.circ} key={c.card}>
            <div className={styles.circCard}>{c.card}</div>
            <div className={styles.circDates}>{c.dates}</div>
            {sections && <p className={styles.circNote}>{sections.circledNotes[i]}</p>}
          </div>
        ))
      )}

      <div className={styles.secH}>The month, woven</div>
      <div className={styles.secRule} />
      {sections ? (
        <div className={styles.woven}>
          {wovenParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : (
        <p className={styles.supportNote}>{SUPPORT_NOTE}</p>
      )}

      <div className={styles.secH}>Skills &amp; reflections</div>
      <div className={styles.secRule} />
      <div className={sections ? styles.twocol : `${styles.twocol} ${styles.twocolSingle}`}>
        <div>
          <div className={styles.colH}>Skills this month asks for</div>
          <ul>
            {monthCard.skills.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        {sections && (
          <div className={styles.refl}>
            <div className={styles.colH}>To sit with</div>
            <ul>
              {sections.reflections.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {status === "ready" && <p className={styles.aiNote}>{AI_DISCLOSURE}</p>}
    </div>
  );
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
