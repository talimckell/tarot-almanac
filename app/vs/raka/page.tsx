// app/vs/raka/page.tsx — comparison landing page targeting "Raka alternative" /
// "tarot app like Raka" search traffic. See docs/ROADMAP.md. Static marketing
// copy (not reading content), so it's written here rather than pulled from
// content/cards — matches the voice doc's "marketing copy" register (§6).
//
// Pricing facts checked 2026-09-03: Raka's Mastery tier is $9.99/mo or
// $79.99/yr, with a free tier. Re-verify before any future edit; competitor
// pricing drifts and this page's credibility depends on it staying accurate.

import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { SITE_URL } from "../../../lib/site";
import "../styles.css";

const TITLE = "The Tarot Almanac vs. Raka: A Tarot App Comparison | The Tarot Almanac";
const DESCRIPTION =
  "Raka reads your cards with AI, generated fresh each time you ask. The Tarot Almanac fixes them with arithmetic, the same card every time, and every reading is written by hand. Here's the actual difference, side by side.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/vs/raka` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/vs/raka`,
    type: "website",
  },
};

const FAQ: { q: string; a: string }[] = [
  {
    q: "Is The Tarot Almanac an alternative to Raka?",
    a: "Yes, if what you want out of Raka is a daily card and a birth chart reading. The two apps get there differently: Raka's readings come from an AI model, generated when you ask. The Tarot Almanac's come from a fixed formula run on your birthday and the date, the same card every time, with every meaning written by a person rather than generated per request.",
  },
  {
    q: "What's the actual difference between The Tarot Almanac and Raka?",
    a: "Raka is AI-native: ask it for a reading and a language model produces the interpretation in the moment. The Tarot Almanac doesn't ask an AI anything. Your card is worked out by arithmetic, the same rule for every date, and you can do that arithmetic by hand and land on the same card the site shows.",
  },
  {
    q: "Does The Tarot Almanac use AI to write your reading?",
    a: "No. Which card you get is decided by a fixed formula, not a model, and the text explaining that card was written once, by a person, and reads the same for everyone who lands on it. Nothing on the page was generated for you specifically.",
  },
  {
    q: "Which is cheaper, The Tarot Almanac or Raka?",
    a: "The Tarot Almanac is $7 a month. Raka's paid Mastery tier is $9.99 a month, or $79.99 billed yearly. Both apps also offer a free tier before you pay anything.",
  },
];

export default function VsRakaPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SiteNav />
      <main className="vs-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

        <nav className="vs-crumb">
          <Link href="/">Home</Link> · The Tarot Almanac vs. Raka
        </nav>

        <p className="vs-eyebrow">Comparison · Tarot Apps</p>
        <h1 className="vs-h1">The Tarot Almanac vs. Raka</h1>
        <p className="vs-lede">
          Raka and The Tarot Almanac both open with a card for today and a chart for your birth date.
          If you&rsquo;re choosing between them, here&rsquo;s the actual difference, not the marketing
          version of it.
        </p>

        <section className="vs-section">
          <h2>Where they agree</h2>
          <p className="vs-subhead">Start with what&rsquo;s actually shared.</p>
          <ul className="vs-agree">
            <li>A card for today, tied to your birth date</li>
            <li>A fuller reading built from your birth date, not just one card</li>
            <li>A free way in before you pay anything</li>
            <li>A monthly subscription for the full version</li>
          </ul>
        </section>

        <section className="vs-section">
          <h2>Where they differ</h2>
          <p className="vs-subhead">This is the part worth reading slowly.</p>

          <h3>How the card gets picked</h3>
          <p>
            Raka is built AI-native. Ask it for a reading and a language model produces one,
            card and interpretation together, in the moment you ask. The Tarot Almanac doesn&rsquo;t
            ask an AI anything to pick your card. Your birthday and the date go through a fixed
            formula, the same one every time, and{" "}
            <Link href="/how-it-works" style={{ color: "var(--indigo)" }}>
              you can run that formula by hand
            </Link>{" "}
            and land on the same card the site shows.
          </p>

          <h3>Who wrote what you&rsquo;re reading</h3>
          <p>
            The Tarot Almanac&rsquo;s card meanings, Bearings, and month and year readings are each
            written once, by a person, and read the same by everyone who lands on that card. Nothing
            you read was assembled for you in the last second. It was written, and it stays.
          </p>

          <h3>Price</h3>
          <div className="vs-table-wrap">
            <table className="vs-table">
              <caption>Monthly cost, side by side</caption>
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">The Tarot Almanac</th>
                  <th scope="col">Raka</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Free</th>
                  <td>Today&rsquo;s cards, your Bearing, chart preview</td>
                  <td>Limited daily readings</td>
                </tr>
                <tr>
                  <th scope="row">Subscription</th>
                  <td className="vs-yes">$7 / month</td>
                  <td>$9.99 / month ($79.99 billed yearly)</td>
                </tr>
                <tr>
                  <th scope="row">One-off chart</th>
                  <td className="vs-yes">$12, no subscription needed</td>
                  <td>&mdash;</td>
                </tr>
                <tr>
                  <th scope="row">How the card is chosen</th>
                  <td className="vs-yes">Fixed arithmetic, checkable by hand</td>
                  <td>Generated by an AI model</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="vs-section vs-faq">
          <h2>Common questions</h2>
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p className="ans">{f.a}</p>
            </details>
          ))}
        </section>

        <section className="vs-teaser">
          <span className="eyebrow">The living almanac</span>
          <h2>See where today places you, no AI involved</h2>
          <p>
            Your Bearing, your day and month and year cards, and the collective card everyone shares
            today, all worked from arithmetic you can check yourself.
          </p>
          <Link href="/today" className="vs-cta-btn">
            Find your cards
          </Link>
        </section>

        <p className="vs-links">
          Related: <Link href="/how-it-works">how the math works</Link> ·{" "}
          <Link href="/tarot-birth-chart">your tarot birth chart</Link> ·{" "}
          <Link href="/bearing">your Bearing</Link> ·{" "}
          <Link href="/tarot">all seventy-eight cards</Link> ·{" "}
          <Link href="/vs/labyrinthos">The Tarot Almanac vs. Labyrinthos</Link> ·{" "}
          <Link href="/me#subscribe">subscribe for $7/month</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
