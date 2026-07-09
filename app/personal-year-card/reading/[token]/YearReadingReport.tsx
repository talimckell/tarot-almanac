import Link from "next/link";
import { MAJORS } from "@/lib/almanac";
import { ELEMENT_LABEL } from "@/lib/yearCard";
import type { YearPackage } from "@/lib/yearReading";
import type { YearReadingSections } from "@/lib/yearReadingPrompt";
import "../../styles.css";

function paras(text: string) {
  return text.split(/\n\n+/).map((p, i) => <p key={i}>{p.trim()}</p>);
}

function idxOf(name: string): number {
  return MAJORS.indexOf(name as (typeof MAJORS)[number]);
}

// The paid year-ahead report. The woven AI sections (framing, bearingMeetsYear, stagesAndArc,
// elementWeather, reflections) wrap around the free structure: the wheel, the authored year
// reading, the authored month-by-month, and the year card's skills.
export default function YearReadingReport({
  pkg,
  sections,
}: {
  pkg: YearPackage;
  sections: YearReadingSections | null;
}) {
  const shortName = pkg.yearCard.name.replace(/^The /, "");
  const named = pkg.name && pkg.name !== "you";
  const wheelName = named ? pkg.name : "";
  const wheel = `/personal-year-card/wheel/image?bm=${pkg.birth.month}&bd=${pkg.birth.day}&y=${pkg.year}&n=${encodeURIComponent(wheelName)}`;

  return (
    <main className="pyc-wrap">
      <nav className="pyc-crumb">
        <Link href="/personal-year-card">Tarot Year Card</Link> · Your reading
      </nav>

      <p className="pyc-eyebrow">{named ? `${pkg.name}'s ${pkg.year}` : `Your ${pkg.year}`}</p>
      <h1 className="pyc-h1">The {shortName} Year</h1>
      <span className={`pyc-chip ${pkg.yearCard.element}`}>
        <span className="dot" />
        {ELEMENT_LABEL[pkg.yearCard.element]}
      </span>

      {sections && <div className="pyc-blurb">{paras(sections.framing)}</div>}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="pyc-report-wheel" src={wheel} alt={`The ${shortName} year wheel`} width={640} height={336} />

      <section className="pyc-section">
        <h2>Your year</h2>
        <div className="pyc-body">{paras(pkg.yearCard.personalYearReading)}</div>
      </section>

      {sections && (
        <section className="pyc-section">
          <h2>How your Bearing meets the year</h2>
          <div className="pyc-body">{paras(sections.bearingMeetsYear)}</div>
        </section>
      )}

      {sections && (
        <section className="pyc-section">
          <h2>The stages you move through</h2>
          <div className="pyc-body">{paras(sections.stagesAndArc)}</div>
        </section>
      )}

      {sections && (
        <section className="pyc-section">
          <h2>Element weather</h2>
          <div className="pyc-body">{paras(sections.elementWeather)}</div>
          <div className="pyc-weather" style={{ marginTop: 14 }}>
            {pkg.elementWeather.map((e) => (
              <span className={`bar ${e.element}`} key={e.element}>
                <span className="dot" />
                <b>{e.count}</b>
                <span className="el">
                  {ELEMENT_LABEL[e.element]}
                  {e.count === 1 ? " month" : " months"}
                </span>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="pyc-section">
        <h2>Month by month</h2>
        <div className="pyc-months">
          {pkg.months.map((m) => {
            const mi = idxOf(m.card);
            return (
              <div className="pyc-month" key={m.monthName}>
                <span className="pyc-glyph" style={{ color: `var(--${m.element})` }}>
                  <svg viewBox="0 0 46 46" aria-hidden="true">
                    <use href={`#ma-${mi}`} />
                  </svg>
                </span>
                <div>
                  <div className="pyc-month-head">
                    {m.monthName} · {m.card} <span className="stage">{m.stage}</span>
                  </div>
                  <p className="pyc-body">{m.reading}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pyc-section">
        <h2>Skills this year asks</h2>
        <ul className="pyc-list">
          {pkg.yearCard.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>

      {sections && (
        <section className="pyc-section">
          <h2>Reflection questions</h2>
          <ul className="pyc-list">
            {sections.reflections.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </section>
      )}

      <p className="pyc-links">
        Made with <Link href="/personal-year-card">the tarot year card calculator</Link> at The Tarot Almanac.
      </p>
    </main>
  );
}
