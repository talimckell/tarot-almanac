// app/tarot-birth-chart/page.tsx — PUBLIC, indexable marketing landing for the
// commercial term "tarot birth chart / tarot natal chart". The generator at /chart is
// auth-gated + noindex (redirects logged-out visitors to sign-in), so nothing there can
// rank; this page is the public pitch. It renders the REAL chart diagram (ChartDiagram,
// unlocked) for a live example, then explains what each position means, and CTAs into
// /chart. Wires the real engine — no invented cards.
//
// COPY NOTE: the prose is a first draft in-voice for Tali to refine. It's marketing /
// positional copy, not card-reading interpretation (those stay authored / in the deck).
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import ChartDiagram from "../chart/ChartDiagram";
import { computeNatalChart } from "../../lib/natalChart";
import { SITE_URL } from "../../lib/site";

const URL = `${SITE_URL}/tarot-birth-chart`;
const TITLE = "Tarot Birth Chart & Natal Chart | The Tarot Almanac";
const DESCRIPTION =
  "A tarot birth chart, or tarot natal chart, is seven cards drawn from your birthday: the self you arrived as, the world that met you, and the Bearing between them. See an example and build your own.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "website" },
};

// FAQ content — kept in one place so the visible section and the schema stay in sync.
const FAQ = [
  {
    q: "What is a tarot birth chart?",
    a: "A tarot birth chart is seven tarot cards drawn from your birth date: three for you (your year, month, and day), three for the world you were born into, and the Bearing, the fixed distance between the two. It's the tarot counterpart to an astrology birth chart, built from arithmetic instead of the sky.",
  },
  {
    q: "How is a tarot birth chart calculated?",
    a: "Add the digits of your birth year, then fold in your birth month and day, and wrap the total around the twenty-two Major Arcana. Each of the seven positions is one of those sums; the two day positions resolve to Minor cards. It's tarot numerology, and every step is checkable by hand.",
  },
  {
    q: "Is a tarot birth chart the same as an astrology birth chart?",
    a: "It's a close cousin. Astrology reads the sky the minute you were born; a tarot birth chart reads your birth date through the cards. Your year card works like your sun, your month like your moon, and your day like your rising.",
  },
  {
    q: "What's the difference between a tarot birth chart and a tarot birth card?",
    a: "Your birth card, what the Almanac calls your Bearing, is a single card: the fixed angle between you and the world. The full chart is seven cards, the Bearing included, that together describe the whole picture, not just the one lens.",
  },
];

export default function TarotBirthChartPage() {
  // A live example chart (anonymous), matching blog-05's worked example.
  const chart = computeNatalChart(1984, 2, 16);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Tarot Birth Chart & Natal Chart",
    about: "Tarot natal chart (tarot numerology)",
    author: { "@type": "Organization", name: "The Tarot Almanac" },
    publisher: { "@type": "Organization", name: "The Tarot Almanac" },
    mainEntityOfPage: URL,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  const label = {
    fontFamily: "var(--serif-sc)",
    fontSize: 11,
    letterSpacing: "0.16em",
    textTransform: "uppercase" as const,
    color: "var(--label)",
    fontWeight: 400,
    margin: "24px 0 10px",
  };

  return (
    <>
      <SiteNav current="chart" />
      <main className="wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

        <nav className="crumb">
          <Link href="/">Home</Link> · Tarot Birth Chart
        </nav>

        <header className="cardhead">
          <span className="glyph" style={{ color: "var(--indigo)" }}>
            <svg viewBox="0 0 56 56" width={70} height={70} aria-hidden="true">
              <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" fill="currentColor" />
            </svg>
          </span>
          <span className="num">Tarot Numerology</span>
          <h1>Your Tarot Birth Chart</h1>
          <p className="position">a natal chart, built from your birthday</p>
        </header>

        <section className="section">
          <h2>What is a tarot birth chart?</h2>
          <p>
            Astrology reads the sky the minute you were born. A tarot birth chart reads the same
            moment through the cards, built from your birth date instead of the stars. No birth
            time, no software, no chart you have to pay someone to draw. Just your date, run
            through arithmetic you can check, turned into seven cards: the person you came in as,
            the world that was waiting, and the fixed distance between the two.
          </p>
        </section>

        {/* The real chart diagram, rendered unlocked for the example. */}
        <section className="section" aria-label="Example tarot birth chart">
          <ChartDiagram chart={chart} unlocked columnLabel="You" they={false} />
          <p className="dates" style={{ textAlign: "center", marginTop: 14 }}>
            An example tarot birth chart, for someone born February 16, 1984.
          </p>
        </section>

        <section className="section">
          <h2>What each position means</h2>

          <h3 style={label}>You, the person you arrived as</h3>
          <p>
            <strong>Your year is your core.</strong> The deepest, slowest layer, the part of you
            still true after everything on top has changed. Astrology would call it your sun.
          </p>
          <p>
            <strong>Your month is your inner life.</strong> The weather underneath what anyone
            sees, how you are when no one is watching. Your moon.
          </p>
          <p>
            <strong>Your day is how you meet a room.</strong> The surface, the first thing people
            get from you. It comes out as a Minor card, the lived, everyday you. Your rising.
          </p>

          <h3 style={label}>The world you were born into</h3>
          <p>
            <strong>The world&rsquo;s year is what you inherited.</strong> The signature of your
            whole birth year, shared by everyone who arrived when you did.
          </p>
          <p>
            <strong>The world&rsquo;s month is the season you formed in.</strong> The nearer
            weather, the mood in the air as you got here.
          </p>
          <p>
            <strong>The world&rsquo;s day is the day that caught you.</strong> The most specific of
            the three, shared only by people born your exact date.
          </p>

          <h3 style={label}>The card that ties it together</h3>
          <p>
            <strong>Your Bearing is the fixed angle to the world.</strong> The distance between
            your side of the chart and the world&rsquo;s, the one card that never changes, whatever
            the day. <Link href="/bearing">More on the Bearing</Link>.
          </p>
        </section>

        <section className="section">
          <h2>How a tarot birth chart is calculated</h2>
          <p>
            Every card comes from one move you repeat: add, and if you pass twenty-two, wrap back
            around the wheel. Only the year gets its digits added up; the month and day go in
            whole. It&rsquo;s the same tarot numerology behind every reading in the Almanac.
          </p>
          <p className="dates">
            <Link href="/blog/the-tarot-natal-chart">See a chart worked all the way through</Link> ·{" "}
            <Link href="/how-it-works">How it works</Link>
          </p>
        </section>

        <section className="section">
          <h2>Common questions</h2>
          {FAQ.map(({ q, a }) => (
            <div key={q} style={{ marginBottom: 18 }}>
              <h3 style={{ ...label, margin: "0 0 6px" }}>{q}</h3>
              <p style={{ marginTop: 0 }}>{a}</p>
            </div>
          ))}
        </section>

        <aside className="almanac">
          <span className="eyebrow">Build your own</span>
          <p>
            Your chart names all seven cards and reads each one, then weaves them into a single
            portrait: a core meeting a world, a deep self under the face you lead with. It&rsquo;s a
            fixed object you can keep or give. A chart is $12 on its own, or included with a
            subscription.
          </p>
          <p className="dates">
            <Link href="/chart">Build your natal chart &rarr;</Link> ·{" "}
            <Link href="/bearing">Find your Bearing first</Link> ·{" "}
            <Link href="/personal-year-card">See your year card</Link>
          </p>
        </aside>
      </main>
      <Footer />
    </>
  );
}
