import { MAJORS } from "@/lib/almanac";
import { ELEMENT_LABEL } from "@/lib/yearCard";
import type { YearPackage } from "@/lib/yearReading";
import type { YearReadingSections } from "@/lib/yearReadingPrompt";

function paras(text: string) {
  return text.split(/\n\n+/).map((p, i) => <p key={i}>{p.trim()}</p>);
}

function idxOf(name: string): number {
  return MAJORS.indexOf(name as (typeof MAJORS)[number]);
}

// The actual report content — hero, sections, wheel image, month-by-month — with no
// outer <main>/page chrome, so it can be embedded (e.g. inside a <details> on the
// checkout confirm page) as well as rendered as a full page. YearReadingReport wraps
// this with the page-level crumb + bottom CTA for /sample and /reading/[token]; this
// is the piece worth reusing anywhere the report itself needs to show up.
export default function ReportBody({
  pkg,
  sections,
  sample = false,
}: {
  pkg: YearPackage;
  sections: YearReadingSections | null;
  sample?: boolean;
}) {
  const shortName = pkg.yearCard.name.replace(/^The /, "");
  const named = pkg.name && pkg.name !== "you";
  const wheelName = named ? pkg.name : "";
  const wheel = `/personal-year-card/wheel/image?bm=${pkg.birth.month}&bd=${pkg.birth.day}&y=${pkg.year}&n=${encodeURIComponent(wheelName)}`;

  return (
    <>
      {sample && (
        <div className="pyc-sample-banner">
          <span className="lbl">A sample reading</span>
          This is {pkg.name}&rsquo;s {pkg.year}, written the same way yours will be. Your own reading
          is built from your birthday, so the cards, the months, and the whole weave are yours.
        </div>
      )}

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
    </>
  );
}
