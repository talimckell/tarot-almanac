// app/personal-year-card/page.tsx — the calculator hub.
// The tool computes a year card and links to its evergreen page (the 22 SEO pages
// in [slug]/). This page also carries the FAQ/explainer, which doubles as the
// body copy the tool page needs to rank. See docs/ROADMAP.md.

import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { SITE_URL } from "../../lib/site";
import { MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "../../lib/almanac";
import { YEAR_CARD_FAQ } from "../../lib/yearCard";
import YearCardCalculator from "./YearCardCalculator";
import "./styles.css";

const TITLE = "Tarot Year Card Calculator: Your Card of the Year | The Tarot Almanac";
const DESCRIPTION =
  "Find your tarot year card, the Major Arcana card of the year set by your birthday through tarot numerology. Get your card and what it means, the same every time, no shuffle.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/personal-year-card` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/personal-year-card`,
    type: "website",
  },
};

export default function PersonalYearCardHub() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: YEAR_CARD_FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.link ? `${f.a} ${f.link.text}.` : f.a },
    })),
  };

  return (
    <>
      <SiteNav />
      <main className="pyc-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <nav className="pyc-crumb">
          <Link href="/">Home</Link> · Personal Year Card
        </nav>

        <p className="pyc-eyebrow">Tarot Numerology · Year Card Calculator</p>
        <h1 className="pyc-h1">Your tarot year card</h1>
        <p className="pyc-lede">
          Every calendar year sets one Major Arcana card for you, your tarot card of the year, found
          from your birthday through tarot numerology. It&rsquo;s given, not shuffled, so it&rsquo;s
          the same card every time you check. Think of it as the theme the year is working on with you.
        </p>

        <YearCardCalculator />

        <section className="pyc-section">
          <h2>Every year card</h2>
          <p className="pyc-subhead">All twenty-two, and what each one asks of a year.</p>
          <div className="pyc-grid">
            {MAJOR_SLUGS.map((slug, i) => (
              <Link href={`/personal-year-card/${slug}`} key={slug}>
                <span className="pyc-glyph" style={{ color: `var(--${ELEMENT_BY_MAJOR[i]})` }}>
                  <svg viewBox="0 0 46 46" aria-hidden="true">
                    <use href={`#ma-${i}`} />
                  </svg>
                </span>
                <span>
                  <span className="nm">{MAJORS[i]}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="pyc-section pyc-faq">
          <h2>How the year card works</h2>
          <p className="pyc-subhead">The what, the why, and what to do with it.</p>
          {YEAR_CARD_FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="ans">
                {f.a}
                {f.link && (
                  <>
                    {" "}
                    <Link href={f.link.href} style={{ color: "var(--indigo)" }}>
                      {f.link.text}
                    </Link>
                    .
                  </>
                )}
              </p>
            </details>
          ))}
        </section>

        <section className="pyc-teaser">
          <span className="eyebrow">The full year-ahead reading</span>
          <h2>Your whole year, woven</h2>
          <p>
            The free card above is your year&rsquo;s theme. The full reading walks the twelve months
            that follow from it, each a step forward through the cycle, and ties the year together:
          </p>
          <ul>
            <li>Your year wheel, the twelve months laid out around the card that sets them</li>
            <li>The element weather of the year, and what the balance asks of you</li>
            <li>A woven reading, month by month, in the Almanac&rsquo;s voice</li>
            <li>How your Bearing meets the year, and the skills and reflection questions it calls for</li>
          </ul>
          <p style={{ marginTop: 4 }}>
            <Link href="/personal-year-card/sample" style={{ color: "var(--indigo)", fontFamily: "var(--serif-sc)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 13, textDecoration: "none" }}>
              See a sample reading &rarr;
            </Link>
          </p>
        </section>

        <p className="pyc-links">
          Related: <Link href="/personal-month-card">your month card</Link> ·{" "}
          <Link href="/bearing">your Bearing</Link> ·{" "}
          <Link href="/tarot-birth-card">your tarot birth card</Link> ·{" "}
          <Link href="/tarot-birth-chart">your birth chart</Link> ·{" "}
          <Link href="/tarot">all seventy-eight cards</Link> ·{" "}
          <Link href="/how-it-works">how the almanac works</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
