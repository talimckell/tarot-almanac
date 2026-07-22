// app/personal-month-card/page.tsx — the calculator hub.
// Sister to /personal-year-card. The tool computes a month card and links to its
// evergreen page (the 22 SEO pages in [slug]/). The per-Major month meanings are
// read here (server-side) from the card JSONs via getPositionReading and handed to
// the client calculator as `bodies`, so the authored copy stays single-sourced in
// content/cards/*.json and never gets duplicated into the client bundle.
// This page also carries the FAQ/explainer, which doubles as the ranking body copy.
// See docs/ROADMAP.md "Personal month post".

import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { SITE_URL } from "../../lib/site";
import { MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "../../lib/almanac";
import { getPositionReading } from "../../lib/cards";
import { MONTH_CARD_FAQ } from "../../lib/monthCard";
import PersonalMonthCardCalculator from "./PersonalMonthCardCalculator";
import "../personal-year-card/styles.css";

const TITLE = "Personal Month Tarot Card Calculator: Your Card of the Month | The Tarot Almanac";
const DESCRIPTION =
  "Find your personal month tarot card, the Major Arcana card set for your month by your birthday through tarot numerology. A real card, not a number one to nine, and the same every time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/personal-month-card` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/personal-month-card`,
    type: "website",
  },
};

export default function PersonalMonthCardHub() {
  // Read the 22 authored month meanings server-side (one paragraph per Major),
  // index-aligned to MAJOR_SLUGS, and pass to the client calculator.
  const bodies = MAJOR_SLUGS.map(
    (slug) => getPositionReading(slug, "ongoingPersonalMonth")?.body ?? "",
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: MONTH_CARD_FAQ.map((f) => ({
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
          <Link href="/">Home</Link> · Personal Month Card
        </nav>

        <p className="pyc-eyebrow">Tarot Numerology · Month Card Calculator</p>
        <h1 className="pyc-h1">Your tarot card for the month</h1>
        <p className="pyc-lede">
          Every month sets one Major Arcana card for you, your tarot card of the month, found from
          your birthday through tarot numerology. It&rsquo;s given, not shuffled, so it&rsquo;s the
          same card every time you check. Think of it as the weather inside the month, one step along
          from your card of the year.
        </p>

        <PersonalMonthCardCalculator bodies={bodies} />

        <section className="pyc-section">
          <h2>Every month card</h2>
          <p className="pyc-subhead">All twenty-two, and what each one asks of a month.</p>
          <div className="pyc-grid">
            {MAJOR_SLUGS.map((slug, i) => (
              <Link href={`/personal-month-card/${slug}`} key={slug}>
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
          <h2>How the month card works</h2>
          <p className="pyc-subhead">The what, the why, and what to do with it.</p>
          {MONTH_CARD_FAQ.map((f) => (
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
          <span className="eyebrow">The living almanac</span>
          <h2>Every month, walked with you</h2>
          <p>
            The card above is one month. A subscription walks all twelve as they come, each a step
            forward through the cycle, alongside the rest of your almanac:
          </p>
          <ul>
            <li>Your month card the day the month turns, in the Almanac&rsquo;s voice</li>
            <li>The daily cards inside it, personal and collective, side by side</li>
            <li>Your Bearing, and how it meets each month as it arrives</li>
            <li>Time travel to any past month, and the month ahead</li>
          </ul>
          <p style={{ marginTop: 4 }}>
            <Link href="/me#subscribe" style={{ color: "var(--indigo)", fontFamily: "var(--serif-sc)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 13, textDecoration: "none" }}>
              See the living almanac &rarr;
            </Link>
          </p>
        </section>

        <p className="pyc-links">
          Related: <Link href="/month">the month&rsquo;s collective card</Link> ·{" "}
          <Link href="/personal-year-card">your year card</Link> ·{" "}
          <Link href="/bearing">your Bearing</Link> ·{" "}
          <Link href="/tarot-birth-card">your tarot birth card</Link> ·{" "}
          <Link href="/tarot">all seventy-eight cards</Link> ·{" "}
          <Link href="/how-it-works">how the almanac works</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
