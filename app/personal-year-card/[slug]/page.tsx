// app/personal-year-card/[slug]/page.tsx — one template -> 22 static pages.
// "[Major] as your personal year card." The SEO core of the feature: evergreen,
// indexable, cross-linked. Shows the free tier (year-card meaning, what to do, the
// deterministic 12-month arc, element weather); the woven reading is the paid layer
// (phase 2). Slugs match MAJOR_SLUGS / the /tarot/[slug] hub pages.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { SITE_URL } from "../../../lib/site";
import { MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "../../../lib/almanac";
import { getCardBySlug } from "../../../lib/cards";
import {
  yearCardContent,
  yearMonths,
  restOfCycle,
  elementTally,
  majorShortName,
  indefiniteArticle,
  MONTH_NAMES,
  ELEMENT_LABEL,
} from "../../../lib/yearCard";
import "../styles.css";

export function generateStaticParams() {
  return MAJOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const idx = MAJOR_SLUGS.indexOf(slug as (typeof MAJOR_SLUGS)[number]);
  if (idx < 0) return {};
  const name = MAJORS[idx];
  const title = `${name} as Your Personal Year Card | The Tarot Almanac`;
  const description = `${name} as a personal year card: ${yearCardContent(idx).blurb}`.slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/personal-year-card/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/personal-year-card/${slug}`, type: "article" },
  };
}

export default async function YearCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = MAJOR_SLUGS.indexOf(slug as (typeof MAJOR_SLUGS)[number]);
  if (idx < 0) notFound();

  const name = MAJORS[idx];
  const shortName = majorShortName(idx);
  const aShort = `${indefiniteArticle(shortName)} ${shortName}`;
  const element = ELEMENT_BY_MAJOR[idx];
  const card = getCardBySlug(slug);
  const numberLabel = card?.numberLabel ?? String(idx);
  const content = yearCardContent(idx);
  const months = yearMonths(idx);
  const tally = elementTally(months);
  const rest = restOfCycle(idx);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${name} as Your Personal Year Card`,
    about: `${name} personal year`,
    author: { "@type": "Organization", name: "The Tarot Almanac" },
    publisher: { "@type": "Organization", name: "The Tarot Almanac" },
    mainEntityOfPage: `${SITE_URL}/personal-year-card/${slug}`,
  };

  return (
    <>
      <SiteNav />
      <main className="pyc-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="pyc-crumb">
          <Link href="/">Home</Link> · <Link href="/personal-year-card">Personal Year Card</Link> · {name}
        </nav>

        <header className="pyc-hero">
          <span className="pyc-glyph" style={{ color: `var(--${element})` }}>
            <svg viewBox="0 0 46 46" width={96} height={96} aria-label={`${name} glyph`}>
              <use href={`#ma-${idx}`} />
            </svg>
          </span>
          <span className="num">Major Arcana · {numberLabel}</span>
          <h1>The {shortName} Year</h1>
          <span className={`pyc-chip ${element}`}>
            <span className="dot" />
            {ELEMENT_LABEL[element]}
          </span>
        </header>

        <p className="pyc-blurb">{content.blurb}</p>

        <div className="pyc-whattodo">
          <span className="lbl">What to do with {aShort} year</span>
          {content.whatToDo}
        </div>

        <section className="pyc-section">
          <h2>Your twelve months</h2>
          <p className="pyc-subhead">
            Each month steps one place forward through the cycle. The same twelve, in the same order,
            for any {shortName} year.
          </p>
          <div className="pyc-arc">
            {months.map((mIdx, i) => (
              <Link className="pyc-arc-item" href={`/tarot/${MAJOR_SLUGS[mIdx]}`} key={i}>
                <span className="pyc-glyph" style={{ color: `var(--${ELEMENT_BY_MAJOR[mIdx]})` }}>
                  <svg viewBox="0 0 46 46" aria-hidden="true">
                    <use href={`#ma-${mIdx}`} />
                  </svg>
                </span>
                <span>
                  <span className="mon">{MONTH_NAMES[i]}</span>
                  <br />
                  <span className="cardname">{MAJORS[mIdx]}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="pyc-section">
          <h2>Element weather</h2>
          <p className="pyc-subhead">How the twelve months balance across the elements.</p>
          <div className="pyc-weather">
            {tally.map(({ element: el, count }) => (
              <span className={`bar ${el}`} key={el}>
                <span className="dot" />
                <b>{count}</b>
                <span className="el">
                  {ELEMENT_LABEL[el]}
                  {count === 1 ? " month" : " months"}
                </span>
              </span>
            ))}
          </div>
        </section>

        <section className="pyc-section">
          <h2>The rest of the cycle</h2>
          <p className="pyc-subhead">The nine Majors {aShort} year doesn&rsquo;t touch.</p>
          <div className="pyc-rest">
            {rest.map((rIdx) => (
              <Link className="item" href={`/tarot/${MAJOR_SLUGS[rIdx]}`} key={rIdx}>
                <span className="pyc-glyph" style={{ color: `var(--${ELEMENT_BY_MAJOR[rIdx]})` }}>
                  <svg viewBox="0 0 46 46" aria-hidden="true">
                    <use href={`#ma-${rIdx}`} />
                  </svg>
                </span>
                <span className="nm">{MAJORS[rIdx]}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="pyc-teaser">
          <span className="eyebrow">The full year-ahead reading</span>
          <h2>The whole {shortName} year, woven</h2>
          <p>
            This page is the theme. The full reading walks all twelve months in the Almanac&rsquo;s
            voice, reads the element weather, brings in how your Bearing meets the year, and closes
            with the skills and reflection questions {aShort} year calls for.
          </p>
          <p className="soon">Coming soon</p>
        </section>

        <p className="pyc-links">
          <Link href="/personal-year-card">Find your own year card &rarr;</Link>
          <br />
          More on this card: <Link href={`/tarot/${slug}`}>{name}, the full meaning</Link> ·{" "}
          <Link href={`/bearing/${slug}`}>{name} as a Bearing</Link> ·{" "}
          <Link href="/tarot">all seventy-eight cards</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
