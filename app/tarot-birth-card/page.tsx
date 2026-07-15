// app/tarot-birth-card/page.tsx — PUBLIC, indexable conversion landing for the
// commercial searches "tarot birth card / birth card calculator / what is my tarot card".
// The free finder (BirthCardCalculator) gives the visitor their card up front, then the
// page explains, upsells the $12 chart, and answers objections. The positioning question
// (why this card differs from other calculators) is handled by linking Tali's blog post.
//
// COPY NOTE: prose is a first draft in-voice for Tali to refine. Marketing / positional
// copy, not card-reading interpretation (readings stay authored, on /bearing/[slug]).
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "../../lib/almanac";
import { SITE_URL } from "../../lib/site";
import BirthCardCalculator from "./BirthCardCalculator";
import "./styles.css";

const URL = `${SITE_URL}/tarot-birth-card`;
const TITLE = "Tarot Birth Card Calculator: Find Yours by Birthday | The Tarot Almanac";
const DESCRIPTION =
  "Find your tarot birth card, the single Major Arcana card set by your birthday through tarot numerology. Free calculator, no sign-up, the same card every time. See what it means.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "website" },
};

const BLOG = "/blog/tarot-birth-card";

// FAQ content — one source for both the visible accordion and the FAQPage schema.
const FAQ: { q: string; a: string; link?: { href: string; text: string } }[] = [
  {
    q: "What is a tarot birth card?",
    a: "Your tarot birth card is the single Major Arcana card set by the day you were born. It doesn't get shuffled and it doesn't change, so it's the same card every time you check. The Almanac calls it your Bearing, the angle you carry into a room before you've decided anything.",
  },
  {
    q: "How do I find my tarot birth card?",
    a: "Enter your birth month and day in the calculator above and it appears at once, free and with no sign-up. By hand, you add your birth month and birth day and wrap the total around the twenty-two Major Arcana.",
  },
  {
    q: "Do I need my birth year?",
    a: "Not for your birth card. It's set by your month and day alone, which is why it holds the same your whole life. Your birth year only comes in for the fuller seven-card chart, where it marks the world you were born into.",
  },
  {
    q: "Why is my card different from other birth-card calculators?",
    a: "Because the Almanac calculates it differently, on purpose. Most calculators add up your whole birth date, year included, and reduce it to a small number that can only land on a handful of cards. The Almanac uses your month and day around the full wheel of twenty-two, so every card is in play.",
    link: { href: BLOG, text: "Here's the full explanation, with both methods side by side" },
  },
  {
    q: "Is a tarot birth card the same as an astrology sign?",
    a: "It's a close cousin. Astrology reads the sky the minute you were born; your tarot birth card reads your birthday through the cards. Both hand you a fixed lens set by when you arrived, one from the stars and one from arithmetic you can follow.",
  },
  {
    q: "What's the difference between a tarot birth card and a tarot birth chart?",
    a: "Your birth card is one card, the still point. Your tarot birth chart is seven cards, that one included, that set it among the cards of your birth year, month, and day and read the whole shape together.",
    link: { href: "/tarot-birth-chart", text: "See what a full tarot birth chart holds" },
  },
  {
    q: "Does my tarot birth card ever change?",
    a: "No. It's the one card that holds still. The daily cards turn and your year card changes with the calendar, but your birth card is fixed by a birthday that never moves.",
  },
  {
    q: "Is it really free?",
    a: "Yes. Finding your birth card and reading what it means costs nothing and needs no account. The paid part is optional: the full seven-card natal chart, and the living almanac that reads your cards day by day.",
  },
  {
    q: "Can I find someone else's tarot birth card?",
    a: "Yes, just enter their birth month and day. A birth card, and the full chart built from it, makes a good gift, since it's a fixed object you can give someone.",
  },
  {
    q: "What if my birth card doesn't feel like me?",
    a: "Give it a minute, and read its full meaning. A birth card isn't a personality label, it's the stance you meet the world from, underneath the day to day. It also sits inside a chart of seven cards that fills in the rest of the picture.",
  },
  {
    q: "What are the Major Arcana?",
    a: "The twenty-two named cards of the tarot, from the Fool at zero to the World at twenty-one. Your birth card is always one of these twenty-two, and you can read all of them above.",
  },
];

export default function TarotBirthCardPage() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tarot Birth Card Calculator",
    about: "Tarot birth card (tarot numerology)",
    author: { "@type": "Organization", name: "The Tarot Almanac" },
    publisher: { "@type": "Organization", name: "The Tarot Almanac" },
    mainEntityOfPage: URL,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a, link }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: link ? `${a} ${link.text}.` : a },
    })),
  };

  return (
    <>
      <SiteNav current="chart" />
      <main className="tbc-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

        <nav className="tbc-crumb">
          <Link href="/">Home</Link> · Tarot Birth Card
        </nav>

        <header className="tbc-hero">
          <p className="tbc-eyebrow">Tarot Numerology · Birth Card Calculator</p>
          <h1 className="tbc-h1">Your Tarot Birth Card</h1>
          <p className="tbc-lede">
            The one Major Arcana card set by the day you were born. It isn&rsquo;t shuffled and it
            doesn&rsquo;t change, so it&rsquo;s the same card every time you look. Find yours below in a
            few seconds, free, then read what it means.
          </p>
        </header>

        <BirthCardCalculator />

        <div className="tbc-trust">
          <span>Given, not shuffled</span>
          <span>The same card, always</span>
          <span>No sign-up</span>
          <span>Free to find and read</span>
        </div>

        <section className="tbc-section">
          <h2>What a tarot birth card is</h2>
          <div className="tbc-prose">
            <p>
              Most of tarot moves. Cards get shuffled, spreads change, the reading is different every
              time. Your birth card is the exception. It&rsquo;s the single card fixed by your birthday,
              the same for your whole life, and it names the angle you bring to a room before you&rsquo;ve
              decided anything about it.
            </p>
            <p>
              The Almanac calls it your <Link href="/bearing">Bearing</Link>, the still point the rest of
              your cards turn around. It&rsquo;s set by tarot numerology: your birth month and day carried
              around the wheel of the twenty-two Major Arcana, so the card is given rather than drawn.
            </p>
          </div>
        </section>

        <section className="tbc-section">
          <h2>Why your card might differ from other calculators</h2>
          <div className="tbc-prose">
            <p>
              If you&rsquo;ve used another tarot birth card calculator, you may have gotten a different
              card. That&rsquo;s expected, and it&rsquo;s on purpose. Most calculators add up your whole
              birth date, year included, and reduce it to a single small number, which can only ever land
              on a handful of cards.
            </p>
            <p>
              The Almanac does it differently. It uses your birth month and day and wraps the total around
              the full wheel of twenty-two, so every card in the Major Arcana is in play, not just the low
              numbers. Same birthday, same card, every time.
            </p>
            <p>
              <Link className="tbc-morelink" href={BLOG}>The full explanation, both methods side by side &rarr;</Link>
            </p>
          </div>
        </section>

        <aside className="tbc-teaser">
          <span className="eyebrow">Your birth card is one position of seven</span>
          <h2>See your whole tarot birth chart</h2>
          <p>
            Your birth card is the anchor. Your full natal chart sets it among six more cards drawn from
            your birth year, month, and day: the self you arrived as, and the world that was waiting for
            you, read together as a single portrait.
          </p>
          <ul>
            <li>All seven cards, named and read in full</li>
            <li>The self you came in as: your core, your inner life, and the face you lead with</li>
            <li>The world you were born into: what you inherited, and the season that shaped you</li>
            <li>One woven reading that ties the whole chart together</li>
          </ul>
          <p className="price">A chart is $12 on its own, or included with a subscription to the living almanac.</p>
          <Link className="tbc-btn" href="/tarot-birth-chart">See what your chart holds &rarr;</Link>
        </aside>

        <aside className="tbc-capture">
          <span className="eyebrow">Not ready for the full chart?</span>
          <p>Follow along for free. The Almanac&rsquo;s newsletter brings readings and the cards straight to your inbox, no account needed.</p>
          <a
            className="tbc-btn-outline"
            href="https://tarotalmanac.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get the free newsletter &rarr;
          </a>
        </aside>

        <section className="tbc-section">
          <h2>Every tarot birth card</h2>
          <p className="tbc-subhead">All twenty-two of the Major Arcana. Find yours above, or read any of them.</p>
          <div className="tbc-grid">
            {MAJORS.map((name, i) => (
              <Link key={name} href={`/bearing/${MAJOR_SLUGS[i]}`}>
                <span className="tbc-glyph" style={{ color: `var(--${ELEMENT_BY_MAJOR[i]})` }}>
                  <svg viewBox="0 0 46 46" aria-hidden="true">
                    <use href={`#ma-${i}`} />
                  </svg>
                </span>
                <span className="ix">{i}</span>
                <span className="nm">{name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="tbc-section tbc-faq">
          <h2>Common questions</h2>
          {FAQ.map(({ q, a, link }) => (
            <details key={q}>
              <summary>{q}</summary>
              <p className="ans">
                {a}
                {link && (
                  <>
                    {" "}
                    <Link href={link.href}>{link.text}</Link>.
                  </>
                )}
              </p>
            </details>
          ))}
        </section>

        <aside className="tbc-final">
          <span className="eyebrow">Ready when you are</span>
          <h2>Your card is one click away</h2>
          <p>
            Find your tarot birth card free above and read what it means. When you want the whole picture,
            your seven-card chart is waiting.
          </p>
          <div className="tbc-final-actions">
            <Link className="tbc-btn" href="#calculator">Find my birth card</Link>
            <Link className="tbc-btn-ghost" href="/tarot-birth-chart">See the full chart &rarr;</Link>
          </div>
        </aside>

        <p className="tbc-links">
          Related: <Link href="/bearing">your Bearing</Link> ·{" "}
          <Link href="/tarot-birth-chart">your tarot birth chart</Link> ·{" "}
          <Link href="/personal-year-card">your year card</Link> ·{" "}
          <Link href="/birthday">your card by birthday</Link> ·{" "}
          <Link href="/tarot">all seventy-eight cards</Link> ·{" "}
          <Link href="/how-it-works">how the almanac works</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
