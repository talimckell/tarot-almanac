// app/tarot-birth-card/page.tsx — PUBLIC, indexable conversion landing for the
// commercial searches "tarot birth card / birth card calculator / what is my tarot card".
// The free finder (BirthCardCalculator) gives the visitor their card up front, then the
// page explains, upsells the $12 chart, and answers objections. The positioning question
// (why this card differs from other calculators) is handled by linking Tali's blog post.
//
// COPY NOTE: revised 2026-09-22 in Tali's voice. Marketing / positional copy, not
// card-reading interpretation (readings stay authored, on /bearing/[slug]).
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "../../lib/almanac";
import { SITE_URL } from "../../lib/site";
import { organizationRef, serviceLd } from "../../lib/organizationSchema";
import BirthCardCalculator from "./BirthCardCalculator";
import "./styles.css";

const URL = `${SITE_URL}/tarot-birth-card`;
const TITLE = "Tarot Birth Card Calculator: Find Yours by Birthday | The Tarot Almanac";
const DESCRIPTION =
  "Find your tarot birth card, the one Major Arcana card set by your birthday through tarot numerology. It's free, there's no sign-up, and it's yours for life. See what it means.";

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
    a: "Your tarot birth card is the one Major Arcana card set by the day you were born. It's the same card every time you check, and it's yours for life. We call it your Bearing, the angle you bring to the world.",
  },
  {
    q: "What is my tarot card?",
    a: "If you mean the one card that's yours for life, that's your tarot birth card, and the calculator above finds it. Enter your birth month and day and it names the Major Arcana card your birthday points to.",
  },
  {
    q: "What is my arcana, or my major arcana card?",
    a: "It's the same thing as your tarot birth card: the one Major Arcana card set by your birthday, the card you carry your whole life. Enter your month and day in the calculator above and it'll name yours right away.",
  },
  {
    q: "How do I find my tarot birth card?",
    a: "Enter your birth month and day in the calculator above and it'll show up right away, free and with no sign-up. To work it out by hand, add your birth month and birth day, then wrap the total around the twenty-two Major Arcana.",
  },
  {
    q: "Do I need my birth year?",
    a: "Not for your birth card. It's set by your month and day alone, which is why it stays the same your whole life. Your birth year only comes in for the full seven-card birth chart.",
  },
  {
    q: "Why is my card different from other birth-card calculators?",
    a: "Because we work it out differently. Most calculators add up your whole birth date, year included, and reduce it to a small number, so some cards can never come up. We use your month and day around the full wheel of twenty-two, so every card is in play.",
    link: { href: BLOG, text: "Here's the full explanation, with both methods side by side" },
  },
  {
    q: "Is this the same as the Mary Greer or Tarot School birth card method?",
    a: "No. The popular Mary Greer and Tarot School method adds up your whole birth date, year included, and reduces it to a Personality card and a Soul card. We use only your month and day, wrapped around the wheel of twenty-two, so you get one card, and every card in the Major Arcana is in play.",
    link: { href: BLOG, text: "See both methods side by side" },
  },
  {
    q: "Is a tarot birth card the same as an astrology sign?",
    a: "It's a close cousin. Astrology reads the sky the minute you were born, and your tarot birth card reads your birthday through the cards. Both give you a fixed lens, set by when you arrived. If your birth card is like your sun sign, your tarot birth chart is like your full astrology chart.",
  },
  {
    q: "What's the difference between a tarot birth card and a tarot birth chart?",
    a: "Your birth card is one card. Your tarot birth chart is seven cards, with your birth card in the middle, three cards for you, and three for the world you were born into. Together they give you the whole picture.",
    link: { href: "/tarot-birth-chart", text: "See what a full tarot birth chart holds" },
  },
  {
    q: "Does my tarot birth card ever change?",
    a: "No. Your daily cards change, and your year card changes with the calendar. Your birth card is set by a birthday that never moves, so it stays with you for life.",
  },
  {
    q: "Is it really free?",
    a: "Yes. Finding your birth card and reading what it means costs nothing and needs no account. The paid parts are optional: the full seven-card birth chart, and the Almanac subscription that gives you your cards day by day.",
  },
  {
    q: "Can I find someone else's tarot birth card?",
    a: "Yes, just enter their birth month and day. It's a fun one to look up for the people you love, and a full birth chart makes a good gift.",
  },
  {
    q: "What if my birth card doesn't feel like me?",
    a: "Give it a minute, and read its full meaning. Your birth card is the angle you meet the world from, underneath the day to day, so it can take a while to recognize. It also sits inside a chart of seven cards that fills in the rest of the picture.",
  },
  {
    q: "What are the Major Arcana?",
    a: "They're the twenty-two named cards of the tarot, from the Fool at zero to the World at twenty-one. Your birth card is always one of them, and you can read all twenty-two above.",
  },
];

export default function TarotBirthCardPage() {
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tarot Birth Card Calculator",
    about: "Tarot birth card (tarot numerology)",
    author: organizationRef,
    publisher: organizationRef,
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
  // Same $12 chart product as /tarot-birth-chart — this page's own upsell aside links
  // there, so the Service node's url points at /chart (the checkout), not this page.
  const chartServiceLd = serviceLd({
    name: "Tarot birth chart",
    description:
      "A seven-card tarot natal chart built from your birthday: three cards for you, three for the world you were born into, and your Bearing between them. Yours to keep, or to give.",
    url: `${SITE_URL}/chart`,
    price: 12,
  });

  return (
    <>
      <SiteNav current="chart" />
      <main className="tbc-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(chartServiceLd) }} />

        <nav className="tbc-crumb">
          <Link href="/">Home</Link> · Tarot Birth Card
        </nav>

        <header className="tbc-hero">
          <p className="tbc-eyebrow">Tarot Numerology · Birth Card Calculator</p>
          <h1 className="tbc-h1">Your Tarot Birth Card</h1>
          <p className="tbc-lede">
            The one Major Arcana card set by the day you were born. It&rsquo;s the same card every
            time you look, and it&rsquo;s yours for life. Find yours below in a few seconds, for free,
            then read what it means.
          </p>
        </header>

        <BirthCardCalculator />

        <div className="tbc-trust">
          <span>Set by your birthday</span>
          <span>The same card, always</span>
          <span>No sign-up</span>
          <span>Free to find and read</span>
        </div>

        <section className="tbc-section">
          <h2>What a tarot birth card is</h2>
          <div className="tbc-prose">
            <p>
              Most of tarot moves. You shuffle, the spread changes, and the reading is different every
              time. Your birth card is the one that stays put. It&rsquo;s set by your birthday,
              it&rsquo;s yours for life, and it&rsquo;s the angle you bring to the world.
            </p>
            <p>
              It works a lot like your sun sign. It&rsquo;s the first thing about yourself you can name
              in tarot, and once you know it, you start to see it everywhere. It&rsquo;s an easy way into
              tarot, and it&rsquo;s fun to look up for the people you love.
            </p>
            <p>
              You might also see it called your arcana, or your major arcana card. It&rsquo;s all the
              same thing: the one Major Arcana card your birthday points to. We call it your{" "}
              <Link href="/bearing">Bearing</Link>. It&rsquo;s set by tarot numerology: your birth month
              and day, wrapped around the wheel of the twenty-two Major Arcana.
            </p>
          </div>
        </section>

        <section className="tbc-section">
          <h2>Why your card might differ from other calculators</h2>
          <div className="tbc-prose">
            <p>
              If you&rsquo;ve used another tarot birth card calculator, you may have gotten a different
              card. That&rsquo;s expected. Most calculators add up your whole birth date, year included,
              and reduce it to a small number, which means some cards can never come up.
            </p>
            <p>
              We do it differently. We use your birth month and day and wrap the total around the full
              wheel of twenty-two, so every card in the Major Arcana is in play. Same birthday, same card,
              every time.
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
            Your birth card is one card. Your birth chart is the whole picture: three cards for you,
            three for the world you were born into, and your birth card, your Bearing, in the middle.
            It&rsquo;s the reason you&rsquo;re the way you are, laid out on one page.
          </p>
          <ul>
            <li>All seven cards, named and read in full</li>
            <li>Your cards: your core, your inner life, and how you meet a room</li>
            <li>The world&rsquo;s cards: what you inherited, the season you arrived in, and your exact day</li>
            <li>One reading that pulls the whole chart together</li>
          </ul>
          <p className="price">A chart is $12 on its own, or included with a subscription to the Almanac.</p>
          <Link className="tbc-btn" href="/tarot-birth-chart">See what your chart holds &rarr;</Link>
        </aside>

        <p className="tbc-capture">
          Not ready for the full chart?{" "}
          <a
            className="tbc-btn-ghost"
            href="https://tarotalmanac.substack.com/subscribe"
            target="_blank"
            rel="noopener noreferrer"
          >
            Get the free newsletter instead &rarr;
          </a>
        </p>

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
            Find your tarot birth card above for free and read what it means. When you want the whole
            picture, your seven-card chart is waiting.
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
