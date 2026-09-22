import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import SiteNav from "./components/SiteNav";
import Footer from "./components/Footer";
import TodayEntry from "./today-entry";
import { parseBirthday, BIRTHDAY_COOKIE, type Birthday } from "@/lib/today";
import { getSignedInBirthday } from "@/lib/accountBirthday";
import { viewerNow } from "@/lib/viewerNow";
import { SITE_URL } from "@/lib/site";
import { organizationLd, serviceLd } from "@/lib/organizationSchema";
import PrivacyNote from "./components/PrivacyNote";

// Kept identical to the root layout's title/description (app/layout.tsx) — this file
// exists to add the openGraph/twitter block the homepage was missing, not to change
// what's already showing in the browser tab or in search results.
const TITLE = "The Tarot Almanac · Find your angle on the day";
const DESCRIPTION =
  "A perpetual tarot almanac. Every date has cards, set by tarot numerology: the collective card of the day, and the card set by your birth day.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// The eight-pointed star mark, reused in a few places.
function StarMark({ size = 20, fill = "var(--warm-stone)", style }: { size?: number; fill?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill={fill} style={style}>
      <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
    </svg>
  );
}

// Homepage FAQ — the top 4 objections a first-time visitor arrives with
// (audience.md), not a duplicate of /tarot-birth-chart's 14-question FAQ
// (that one is about the chart specifically; this one is about the site).
// `answer` is plain text for the schema; `render` is the same copy with the
// /about link wired in for Q3. Kept in one place so the visible section and
// the JSON-LD stay in sync.
const HOME_FAQ: { q: string; answer: string; render: React.ReactNode }[] = [
  {
    q: "Is this just another random card app?",
    answer: "No. Your cards are set by tarot numerology, the same every time you look. Nobody shuffles.",
    render: "No. Your cards are set by tarot numerology, the same every time you look. Nobody shuffles.",
  },
  {
    q: "Why $7/month when free apps exist?",
    answer:
      "Free apps give you a random draw. The Almanac gives you a fixed system you can check yourself: every day behind you, a month ahead, your natal chart, and charts for people you love.",
    render:
      "Free apps give you a random draw. The Almanac gives you a fixed system you can check yourself: every day behind you, a month ahead, your natal chart, and charts for people you love.",
  },
  {
    q: "Who is behind this?",
    answer:
      "Tali Beesley, a US-based founder. Her family handed down her first tarot deck when she was 11, and the Almanac grew out of that. More about her at tarotalmanac.com/about.",
    render: (
      <>
        Tali Beesley, a US-based founder. Her family handed down her first tarot deck when
        she was 11, and the Almanac grew out of that.{" "}
        <Link href="/about">More about her &rarr;</Link>
      </>
    ),
  },
  {
    q: "Can I give a chart as a gift?",
    answer:
      "Yes. A $12 natal chart is a fixed object you can give someone, built from their birthday, no subscription needed.",
    render: (
      <>
        Yes. A $12 natal chart is a fixed object you can give someone, built from their
        birthday, no subscription needed.{" "}
        <Link href="/me?subscribe=1#subscribe">Make one &rarr;</Link>
      </>
    ),
  },
];

const homeFaqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HOME_FAQ.map(({ q, answer }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const subscriptionLd = serviceLd({
  name: "The Tarot Almanac subscription",
  description:
    "Full access to the living tarot almanac: every day behind you, a month ahead, your natal chart, and charts for the people you love.",
  url: `${SITE_URL}/me`,
  price: 7,
  billingIncrement: "P1M",
});

export default async function Home() {
  // Same resolution as /today: a signed-in account's own birthday always wins; only a
  // signed-out visitor falls back to the anonymous `bday` cookie (set by /today). When
  // we know the birthday, the hero widget shows your card of the day instead of the form.
  // Reading auth/cookies makes this page render per-request (like /today) — no CDN
  // full-page cache — which is the cost of personalizing the hero.
  const account = await getSignedInBirthday();
  let birthday: Birthday | null = account?.birthday ?? null;
  const name = account?.name ?? undefined;
  if (!account) {
    const cookieStore = await cookies();
    birthday = parseBirthday(cookieStore.get(BIRTHDAY_COOKIE)?.value, await viewerNow());
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />
      <SiteNav ctaLabel="Make your almanac" />

      <main>
      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow">A PERPETUAL TAROT ALMANAC</p>
          <h1 className="hero-headline">Find your<br />angle on<br /><em>the day.</em></h1>
          <p className="hero-sub">
            Every day already has its cards, set by tarot numerology. One is the collective card,
            the one we all share. The other is your personal card, set by your birthday. Check
            them in the morning, and you&rsquo;ll know whether to bring an umbrella.
          </p>
          <div className="cta-group">
            <Link href="/today" className="btn-primary">SEE TODAY&rsquo;S CARDS</Link>
            <Link href="/how-it-works" className="btn-ghost">How it works &rarr;</Link>
          </div>
          {/* Product Hunt launch badge (Sept 2026). */}
          <a
            href="https://www.producthunt.com/products/tarot-almanac?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-tarot-almanac"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-block", marginTop: 20 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Tarot Almanac - The astro.com of tarot: every date maps to its own cards. | Product Hunt"
              width={250}
              height={54}
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1258332&theme=neutral&t=1790090596736"
            />
          </a>
        </div>

        <TodayEntry birthday={birthday} name={name} signedIn={!!account} />
      </section>

      {/* WHAT IS TAROT NUMEROLOGY — the core idea, for a first-time visitor */}
      <section className="numerology-band">
        <div className="nb-inner">
          <span className="nb-eyebrow">What is tarot numerology</span>
          <h2 className="nb-head">The day already has its cards.<br />So do <em>you.</em></h2>
          <div className="nb-body">
            <p>
              Think of an astrology birth chart. Nobody shuffles the sky. The planets were
              where they were the minute you were born, and an astrologer reads those fixed
              points. Tarot can work the same way. Instead of a card you draw randomly, your
              cards are set by your birthday and the date on the calendar. We call it tarot
              numerology, and it has a long lineage.
            </p>
            <p>
              So every day arrives already carrying a couple of cards. One of them is the
              collective card, the one we all share. And then there&rsquo;s your personal card,
              which is set by your birthday. It&rsquo;s the angle you bring to whatever the day
              is holding. The same Tuesday can be a hard day for me and an easy one for you.
            </p>
            <p>
              Knowing your cards ahead of time means you can see what a day, a month, or a
              whole year tends to be working on, and get ready for it instead of being caught
              off guard. The day hands you a card. But don&rsquo;t forget that how you choose
              to play your hand is still up to you.
            </p>
            <p>
              So that&rsquo;s how we make the Almanac. Like the old farmers&rsquo; almanacs that
              could name the season before it turned, your birthday lays out a lifetime of
              cards — every day you&rsquo;ve lived and every day coming already has its
              cards.
            </p>
          </div>
          <div className="nb-foot">
            <Link href="/how-it-works" className="nb-more">Curious how a date becomes a card? See the math &rarr;</Link>
          </div>
        </div>
      </section>

      {/* PULL QUOTE */}
      <div className="pullquote-band">
        <div className="pq-rule" />
        <p className="pq-text">The card is fixed.<br /><em>What you do with it is not.</em></p>
        <div className="pq-rule" />
      </div>

      {/* TOOLS — the things you can do with your birthday, ordered as a funnel */}
      <section className="tools-band">
        <div className="tools-intro">
          <span className="ti-eyebrow">Everything from one birthday</span>
          <h2>Enter your birthday once, and it opens all of these.</h2>
          <p>
            Every card below comes from your birthday and tarot numerology. Start with
            today, or explore other parts of the Almanac.
          </p>
        </div>

        <div className="tools">
          <Link className="tool" href="/today">
            <span className="prop-eyebrow" style={{ color: "var(--indigo)" }}>TODAY</span>
            <span className="prop-glyph">
              <svg viewBox="0 0 46 46" fill="none" stroke="var(--indigo)" strokeWidth="1.5">
                <circle cx="23" cy="23" r="8.5" />
                <g strokeWidth="1.4" strokeLinecap="round">
                  <line x1="23" y1="6" x2="23" y2="11" /><line x1="23" y1="35" x2="23" y2="40" />
                  <line x1="6" y1="23" x2="11" y2="23" /><line x1="35" y1="23" x2="40" y2="23" />
                  <line x1="11" y1="11" x2="14.5" y2="14.5" /><line x1="35" y1="35" x2="31.5" y2="31.5" />
                  <line x1="11" y1="35" x2="14.5" y2="31.5" /><line x1="35" y1="11" x2="31.5" y2="14.5" />
                </g>
              </svg>
            </span>
            <h3 className="prop-head">The cards of the day, ours and yours</h3>
            <p className="prop-body">
              The collective card is the one we all share today. Your personal card sits
              next to it, set by your birthday. Some days they line up and some days they
              pull against each other. Free, every day.
            </p>
            <span className="prop-go">See today &rarr;</span>
          </Link>

          <Link className="tool" href="/bearing">
            <span className="prop-eyebrow" style={{ color: "var(--air)" }}>YOUR BIRTH CARD</span>
            <span className="prop-glyph">
              <svg viewBox="0 0 46 46">
                <path d="M28 8 A15 15 0 1 0 28 38 A11 15 0 0 1 28 8 Z" fill="var(--air)" />
              </svg>
            </span>
            <h3 className="prop-head">Your Tarot birth card</h3>
            <p className="prop-body">
              The card you were born under, which we call your Bearing. One Major Arcana
              card fixed by your birthday, which shows you the angle you carry on the world.
            </p>
            <span className="prop-go">Find your Bearing &rarr;</span>
          </Link>

          <Link className="tool" href="/personal-year-card">
            <span className="prop-eyebrow" style={{ color: "var(--fire)" }}>YOUR YEAR</span>
            <span className="prop-glyph">
              <svg viewBox="0 0 46 46" fill="none" stroke="var(--fire)" strokeWidth="1.5">
                <circle cx="23" cy="23" r="13" />
                <circle cx="23" cy="10" r="2.4" fill="var(--fire)" stroke="none" />
              </svg>
            </span>
            <h3 className="prop-head">The card your year is working on</h3>
            <p className="prop-body">
              Every calendar year sets one Major Arcana card for you, drawn from your
              birthday. Think of it as the theme the year keeps handing you.
            </p>
            <span className="prop-go">Find your year card &rarr;</span>
          </Link>

          <Link className="tool" href="/tarot-birth-chart">
            <span className="prop-eyebrow" style={{ color: "var(--water)" }}>YOUR BIRTH CHART</span>
            <span className="prop-glyph">
              <svg viewBox="0 0 46 46" fill="none" stroke="var(--water)" strokeWidth="1.5" strokeLinecap="round">
                <line x1="14" y1="11" x2="14" y2="35" />
                <line x1="32" y1="11" x2="32" y2="35" />
                <circle cx="23" cy="23" r="4.5" fill="var(--water)" stroke="none" />
              </svg>
            </span>
            <h3 className="prop-head">Seven cards from your birthday</h3>
            <p className="prop-body">
              Like an astrology birth chart, in tarot. Three cards for you, three for the
              world you were born into, and your Bearing in the middle.
            </p>
            <span className="prop-go">See your birth chart &rarr;</span>
          </Link>

          <Link className="tool" href="/me">
            <span className="prop-eyebrow" style={{ color: "var(--earth)" }}>THE ALMANAC</span>
            <span className="prop-glyph">
              <svg viewBox="0 0 56 56" fill="var(--earth)">
                <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
              </svg>
            </span>
            <h3 className="prop-head">Your whole Almanac, kept for you</h3>
            <p className="prop-body">
              This is the subscription. Every day you&rsquo;ve lived, the month ahead, your
              birth chart, and charts for the people you love. We keep it all in one place
              so you can come back to it whenever you like.
            </p>
            <span className="prop-go">Start your Almanac &rarr;</span>
          </Link>
        </div>
      </section>

      {/* FEATURE BAND — BEARING */}
      <section className="feature-band fb-vellum">
        <div className="fb-text">
          <span className="fb-eyebrow">Your Bearing</span>
          <h2 className="fb-head">The card you<br />came in under<br />is still <em>with you.</em></h2>
          <p className="fb-body">
            Your Bearing is your tarot birth card, the one Major Arcana card set by your
            birthday. It&rsquo;s the angle you bring to every day: how you tend to meet the
            world, and what you keep coming back to. The card stays with you for life, and
            you get to keep deepening your understanding of it.
          </p>
          <Link href="/bearing" className="fb-cta">Find your Bearing &rarr;</Link>
        </div>
        <div className="fb-visual">
          <div className="fb-card">
            <span className="fb-card-label">Example Bearing</span>
            <div className="fb-card-name">
              <svg width="22" height="22" viewBox="0 0 46 46" style={{ verticalAlign: "-3px", marginRight: "7px" }}>
                <path d="M28 8 A15 15 0 1 0 28 38 A11 15 0 0 1 28 8 Z" fill="var(--indigo)" />
              </svg>
              The Moon
            </div>
            <div className="fb-card-desc">
              You read the world by feel. A Moon Bearing gives you a gift for sensing what
              other people walk past, and a lifelong practice of learning to trust it.
            </div>
          </div>
          <div className="fb-card" style={{ borderLeftColor: "var(--label)" }}>
            <span className="fb-card-label">Example Bearing</span>
            <div className="fb-card-name">
              <svg width="22" height="22" viewBox="0 0 46 46" style={{ verticalAlign: "-3px", marginRight: "7px" }} fill="none" stroke="var(--indigo)" strokeWidth="1.6">
                <path d="M23 38 C14 30 14 18 23 10 C32 18 32 30 23 38 Z" />
                <line x1="23" y1="20" x2="23" y2="34" strokeWidth="1.3" />
              </svg>
              The Empress
            </div>
            <div className="fb-card-desc">
              You make things grow. An Empress Bearing means abundance comes naturally to
              you. The hard part is choosing where to put it.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BAND — PERSONAL YEAR CARD (flipped: text right, specimen left) */}
      <section className="feature-band fb-flip fb-fire">
        <div className="fb-text">
          <span className="fb-eyebrow">Your year card</span>
          <h2 className="fb-head">Every year is<br />working on<br /><em>something.</em></h2>
          <p className="fb-body">
            Every calendar year sets one Major Arcana card for you, drawn from your birthday.
            It&rsquo;s the theme running under the whole year, the thing it keeps coming back
            to. Read it early so you can work with it
            intentionally.
          </p>
          <Link href="/personal-year-card" className="fb-cta">Find your year card &rarr;</Link>
        </div>
        <div className="fb-visual">
          <div className="fb-specimen">
            <span className="fb-specimen-glyph">
              <svg viewBox="0 0 46 46" fill="none" stroke="var(--fire)" strokeWidth="1.5">
                <circle cx="23" cy="23" r="15" />
                <circle cx="23" cy="8" r="2.6" fill="var(--fire)" stroke="none" />
              </svg>
            </span>
            <div className="fb-specimen-year">2026</div>
            <div className="fb-specimen-cap">
              One card, set by your birthday, for all twelve months.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BAND — TAROT BIRTH CHART */}
      <section className="feature-band fb-vellum fb-water">
        <div className="fb-text">
          <span className="fb-eyebrow">Your tarot birth chart</span>
          <h2 className="fb-head">Seven cards,<br />set the day<br /><em>you arrived.</em></h2>
          <p className="fb-body">
            Your Bearing is one card. Your birth chart is the whole picture. Three cards for
            you, three for the world you were born into, and your Bearing in the middle, the
            angle between them. It&rsquo;s the reason you&rsquo;re the way you are, laid out
            on one page. And you can make one for anyone you want to understand better.
          </p>
          <Link href="/tarot-birth-chart" className="fb-cta">See your birth chart &rarr;</Link>
        </div>
        <div className="fb-visual">
          <div className="fb-chart">
            <div className="fb-chart-col">
              <span className="fb-chart-colhead">You</span>
              <div className="fb-chart-cell">Year</div>
              <div className="fb-chart-cell">Month</div>
              <div className="fb-chart-cell">Day</div>
            </div>
            <div className="fb-chart-mid">
              <div className="fb-medallion">
                <svg viewBox="0 0 46 46">
                  <path d="M28 8 A15 15 0 1 0 28 38 A11 15 0 0 1 28 8 Z" fill="var(--stone)" />
                </svg>
              </div>
              <span className="fb-medallion-label">Bearing</span>
            </div>
            <div className="fb-chart-col">
              <span className="fb-chart-colhead">The World</span>
              <div className="fb-chart-cell">Year</div>
              <div className="fb-chart-cell">Month</div>
              <div className="fb-chart-cell">Day</div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — real reader quotes, each keyed to a different part of
          the product (day / Bearing / year / chart) so it reads as proof
          across the whole system rather than one feature. Placed right
          before the account pitch so the ask has something to stand on. */}
      <section className="trust-band">
        <div className="trust-intro">
          <span className="tb-eyebrow">What readers say</span>
          <h2>In their own words.</h2>
        </div>
        <div className="trust-grid">
          <div className="trust-card">
            <span className="trust-card-label">On the daily card</span>
            <p className="trust-quote">
              &ldquo;What I like is that it gives me something to sit with rather than
              telling me what&rsquo;s going to happen. Some days it immediately clicks,
              but other days I only get it in retrospect.&rdquo;
            </p>
            <span className="trust-name">Alina</span>
          </div>
          <div className="trust-card">
            <span className="trust-card-label">On the Bearing</span>
            <p className="trust-quote">
              &ldquo;Finding my Bearing gave me a much better entry point into tarot.
              Instead of some label I had to live up to, it was more like the
              perspective I view the world from. It resonated immediately.&rdquo;
            </p>
            <span className="trust-name">Mara</span>
          </div>
          <div className="trust-card">
            <span className="trust-card-label">On the year card</span>
            <p className="trust-quote">
              &ldquo;I like having one card that frames the year without reducing the
              whole year to one idea.&rdquo;
            </p>
            <span className="trust-name">Valerie</span>
          </div>
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
      </section>

      {/* ACCOUNT PROPOSITION */}
      <section className="acct-band">
        <span className="acct-eyebrow">YOUR ALMANAC</span>
        <StarMark size={20} style={{ display: "block", margin: "10px auto 0" }} />
        <h2 className="acct-head">Today is free.<br /><em>A subscription opens the rest.</em></h2>
        <p className="acct-sub">
          Your daily cards are always free, and you don&rsquo;t need an account. Subscribe and
          your Almanac fills in: every day you&rsquo;ve lived, the month ahead, your birth chart,
          and charts for the people you love.
        </p>
        <div className="acct-cols">
          <div className="acct-col">
            <div className="acct-col-h">Your whole Almanac</div>
            <div className="acct-col-b">Every day you&rsquo;ve lived, open to walk back through. And the month ahead, unfolding as you go.</div>
          </div>
          <div className="acct-col">
            <div className="acct-col-h">Your birth chart</div>
            <div className="acct-col-b">All seven cards from the day you arrived, read together.</div>
          </div>
          <div className="acct-col">
            <div className="acct-col-h">The people you love</div>
            <div className="acct-col-b">Make a chart for anyone who matters to you, and see the cards they came in under. Yours to keep.</div>
          </div>
        </div>
        <p className="acct-price">Your whole Almanac, $7/month. Cancel anytime.</p>
        <Link href="/me" className="acct-cta">Start your Almanac</Link>
        <p className="acct-trust">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="11" width="16" height="10" rx="1.5" />
            <path d="M7.5 11V7a4.5 4.5 0 0 1 9 0v4" />
          </svg>
          Secured by Stripe
        </p>
        <p className="acct-guarantee">
          $7 charged today, then monthly. Not for you? <Link href="/contact">Email us</Link>{" "}
          within 14 days and we&rsquo;ll refund it, no questions asked.
        </p>
        <PrivacyNote style={{ textAlign: "center" }} />
      </section>

      {/* COMPARE — moved below the primary funnel (tools grid, feature bands,
          account pitch) so it no longer competes with first-look conversion;
          still useful for high-intent visitors who scroll this far unconverted. */}
      <section className="tools-band">
        <div className="tools-compare">
          <span className="tc-label">How does this compare?</span>
          <div className="tc-links">
            <Link href="/vs/raka" className="tc-link">
              Vs. Raka <span className="tc-desc">a fixed reading vs. an AI reading</span>
            </Link>
            <Link href="/vs/labyrinthos" className="tc-link">
              Vs. Labyrinthos <span className="tc-desc">a daily almanac vs. lessons and decks</span>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ — the top 4 objections a first-time visitor arrives with, not
          the full 14-question chart FAQ that lives on /tarot-birth-chart. */}
      <section className="faq-band" aria-labelledby="faq-heading">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(subscriptionLd) }} />
        <div className="faq-intro">
          <span className="faq-eyebrow">Common questions</span>
          <h2 id="faq-heading">Before you go</h2>
        </div>
        <div className="faq-grid">
          {HOME_FAQ.map(({ q, render }) => (
            <div className="faq-item" key={q}>
              <h3 className="faq-q">{q}</h3>
              <p className="faq-a">{render}</p>
            </div>
          ))}
        </div>
      </section>
      </main>

      <Footer />
    </>
  );
}
