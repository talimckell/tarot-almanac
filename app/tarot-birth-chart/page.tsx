// app/tarot-birth-chart/page.tsx — PUBLIC, indexable marketing landing for the
// commercial term "tarot birth chart / tarot natal chart". The generator at /chart is
// auth-gated + noindex (redirects logged-out visitors to sign-in), so nothing there can
// rank; this page is the public pitch. It renders the REAL chart diagram (ChartDiagram,
// unlocked) for a live example, then explains what each position means, and CTAs into
// /chart. Wires the real engine — no invented cards.
//
// COPY NOTE: revised 2026-09-22 in Tali's voice, led by the value props people get an
// astrology birth chart for. Marketing / positional copy, not card-reading
// interpretation (those stay authored / in the deck).
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import ChartDiagram from "../chart/ChartDiagram";
import { computeNatalChart } from "../../lib/natalChart";
import { SITE_URL } from "../../lib/site";
import { organizationRef, serviceLd } from "../../lib/organizationSchema";

const URL = `${SITE_URL}/tarot-birth-chart`;
const TITLE = "Tarot Birth Chart & Natal Chart | The Tarot Almanac";
const DESCRIPTION =
  "A tarot birth chart, or tarot natal chart, is seven cards from your birthday: three for you, three for the world you were born into, and your Bearing between them. See an example and build your own.";

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
    a: "A tarot birth chart is seven tarot cards set by your birth date: three for you (your year, month, and day), three for the world you were born into, and your Bearing, the fixed distance between the two. It's the tarot version of an astrology birth chart, and all it needs is your birth date.",
  },
  {
    q: "How is a tarot birth chart calculated?",
    a: "Add the digits of your birth year, then add in your birth month and day, and wrap the total around the twenty-two Major Arcana. Each of the seven positions is one of those sums, and the two day positions come out as Minor cards. It's tarot numerology, and you can work out every step by hand.",
  },
  {
    q: "Is a tarot birth chart the same as an astrology birth chart?",
    a: "It's a close cousin. Astrology reads the sky the minute you were born, and a tarot birth chart reads your birth date through the cards. Both help you understand why you're the way you are. Your year card works like your sun, your month like your moon, and your day like your rising.",
  },
  {
    q: "What's the difference between a tarot birth chart and a tarot birth card?",
    a: "Your birth card, which we call your Bearing, is a single card: the fixed angle between you and the world. Your birth chart is seven cards with your Bearing in the middle. If your Bearing is like your sun sign, the chart is your full chart.",
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
    author: organizationRef,
    publisher: organizationRef,
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
  const chartServiceLd = serviceLd({
    name: "Tarot birth chart",
    description:
      "A seven-card tarot natal chart built from your birthday: three cards for you, three for the world you were born into, and your Bearing between them. Yours to keep, or to give.",
    url: `${SITE_URL}/chart`,
    price: 12,
  });

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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(chartServiceLd) }} />

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

        <div style={{ textAlign: "center", margin: "4px 0 8px" }}>
          <Link
            href="/chart"
            style={{
              display: "inline-block",
              fontFamily: "var(--serif-sc)",
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              background: "var(--indigo)",
              color: "var(--stone)",
              padding: "14px 32px",
              textDecoration: "none",
            }}
          >
            Build your birth chart · $12 &rarr;
          </Link>
          <p
            className="dates"
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              fontSize: 11,
              letterSpacing: "0.03em",
              color: "var(--warm-stone)",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="4" y="11" width="16" height="10" rx="1.5" />
              <path d="M7.5 11V7a4.5 4.5 0 0 1 9 0v4" />
            </svg>
            Secured by Stripe &middot; Pay once, yours to keep
          </p>
          <p className="dates" style={{ marginTop: 8 }}>
            <Link href="/tarot-birth-chart/sample">Or see a full sample first</Link> · included with a subscription
          </p>
        </div>

        <section className="section">
          <h2>What is a tarot birth chart?</h2>
          <p>
            People get their astrology birth chart because it explains them. It takes the one
            thing they already know, their sun sign, and fills in the rest. A tarot birth chart
            does the same thing with the cards. It&rsquo;s set by your birth date, so you
            don&rsquo;t need a birth time. You get seven cards: three for you, three for the
            world you were born into, and your Bearing in the middle, the angle between them.
          </p>
        </section>

        {/* The real chart diagram, rendered unlocked for the example. */}
        <section className="section" aria-label="Example tarot birth chart">
          <ChartDiagram chart={chart} unlocked columnLabel="You" they={false} />
          <p className="dates" style={{ textAlign: "center", marginTop: 14 }}>
            An example tarot birth chart, for someone born February 16, 1984.{" "}
            <Link href="/tarot-birth-chart/sample">See a chart read all the way through &rarr;</Link>
          </p>
        </section>

        <section className="section">
          <h2>What your birth chart gives you</h2>
          <p>
            <strong>It explains you.</strong>{" "}Your chart puts words to things you already know
            about yourself: what comes easily, what you keep working on, how you meet people.
            It&rsquo;s the reason you&rsquo;re the way you are, laid out on one page.
          </p>
          <p>
            <strong>It&rsquo;s the fuller version of your Bearing.</strong>{" "}If you know your
            Bearing, you know one card. Your chart shows the six around it, the way a full
            astrology chart goes deeper than your sun sign.
          </p>
          <p>
            <strong>It makes sense of your contradictions.</strong>{" "}Some of your cards will pull
            against each other. That&rsquo;s normal, and the chart shows you where the pull is
            coming from.
          </p>
          <p>
            <strong>It gives you a language for the people you love.</strong>{" "}You can make a
            chart for a partner, a parent, or a friend and see the cards they came in under. It
            makes a good gift, too.
          </p>
          <p>
            <strong>It&rsquo;s yours for life.</strong>{" "}Your chart never changes. You can come
            back to it for years and read it differently as you grow. And your Bearing, at the
            center of it, is the same card that sets your angle on every day in the Almanac.
          </p>
          <p>
            <strong>It&rsquo;s a snapshot of the day you arrived.</strong>{" "}You, and the world
            you showed up in, on one page.
          </p>
        </section>

        <section className="section">
          <h2>What each position means</h2>

          <h3 style={label}>You, the person you arrived as</h3>
          <p>
            <strong>Your year is your core.</strong>{" "}It&rsquo;s the deepest, slowest layer of
            you, the part that stays true after everything else has changed. In astrology,
            that&rsquo;s your sun.
          </p>
          <p>
            <strong>Your month is your inner life.</strong>{" "}It&rsquo;s how you are when no one
            is watching. That&rsquo;s your moon.
          </p>
          <p>
            <strong>Your day is how you meet a room.</strong>{" "}It&rsquo;s the first thing people
            get from you, and it comes out as a Minor card, the everyday you. That&rsquo;s your
            rising.
          </p>

          <h3 style={label}>The world you were born into</h3>
          <p>
            <strong>The world&rsquo;s year is what you inherited.</strong>{" "}It&rsquo;s the card
            for your whole birth year, shared by everyone born that year.
          </p>
          <p>
            <strong>The world&rsquo;s month is the season you arrived in.</strong>{" "}It&rsquo;s the
            mood in the air as you got here.
          </p>
          <p>
            <strong>The world&rsquo;s day is your exact day.</strong>{" "}It&rsquo;s the most specific
            of the three, shared only with people born on the same date.
          </p>

          <h3 style={label}>The card that ties it together</h3>
          <p>
            <strong>Your Bearing is your angle on the world.</strong>{" "}It&rsquo;s the distance
            between your side of the chart and the world&rsquo;s, and it&rsquo;s the one card that
            never changes, whatever the day. <Link href="/bearing">More on the Bearing</Link>.
          </p>
        </section>

        <section className="section">
          <h2>How a tarot birth chart is calculated</h2>
          <p>
            Every card comes from one simple move: add, and if you pass twenty-two, wrap back
            around the wheel. Only the year gets its digits added up. The month and day go in
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

        {/* READER QUOTE — real proof right before the closing CTA below. */}
        <div className="trust-solo" style={{ margin: "48px auto" }}>
          <div className="trust-card">
            <span className="trust-card-label">On the birth chart</span>
            <p className="trust-quote">
              &ldquo;I have read a lot of astrology and tarot content, and this felt
              more focused and less overwhelming. The chart gave me a clear place
              to start, then let me explore the details at my own pace. Thank
              you!&rdquo;
            </p>
            <span className="trust-name">Tay</span>
          </div>
        </div>

        <aside className="almanac">
          <span className="eyebrow">Build your own</span>
          <p>
            Your chart names all seven cards, reads each one, and then puts them together into
            one reading of you. It&rsquo;s yours to keep, and you can make one for anyone you want
            to understand better. A chart is $12 on its own, or included with a subscription.
          </p>
          <p className="dates">
            <Link href="/chart">Build your natal chart &rarr;</Link> ·{" "}
            <Link href="/tarot-birth-chart/sample">See a full sample chart</Link> ·{" "}
            <Link href="/bearing">Find your Bearing first</Link> ·{" "}
            <Link href="/personal-year-card">See your year card</Link>
          </p>
        </aside>
      </main>
      <Footer />
    </>
  );
}
