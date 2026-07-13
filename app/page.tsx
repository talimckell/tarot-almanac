import Link from "next/link";
import { cookies } from "next/headers";
import SiteNav from "./components/SiteNav";
import Footer from "./components/Footer";
import TodayEntry from "./today-entry";
import { parseBirthday, BIRTHDAY_COOKIE, type Birthday } from "@/lib/today";
import { getSignedInBirthday } from "@/lib/accountBirthday";
import { viewerNow } from "@/lib/viewerNow";

// The eight-pointed star mark, reused in a few places.
function StarMark({ size = 20, fill = "var(--warm-stone)", style }: { size?: number; fill?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill={fill} style={style}>
      <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
    </svg>
  );
}

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
      <SiteNav ctaLabel="Make your almanac" />

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow">A PERPETUAL TAROT ALMANAC</p>
          <h1 className="hero-headline">Find your<br />angle on<br /><em>the day.</em></h1>
          <p className="hero-sub">
            Every day has its cards, set by tarot numerology, the same every time you look.
            One the whole world shares, and one that&rsquo;s yours alone. See where you stand
            today, and what it has to show you.
          </p>
          <div className="cta-group">
            <Link href="/today" className="btn-primary">SEE TODAY&rsquo;S CARDS</Link>
            <Link href="/how-it-works" className="btn-ghost">How it works &rarr;</Link>
          </div>
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
              where they were the minute you were born, and an astrologer reads what was
              already there. Tarot can work the same way. Instead of a card you draw at
              random, your cards are set by your birthday and the date on the calendar, the
              same ones every time you look. That&rsquo;s tarot numerology, and it has a long lineage.
            </p>
            <p>
              So every day arrives already carrying a card, the same one for everyone alive
              that day. And you meet it from somewhere. Your birthday sets your own cards, the
              angle you bring to whatever the day is holding. Two people live through the same
              Tuesday and can stand in very different places on it.
            </p>
            <p>
              Knowing your cards ahead of time is a quiet kind of preparation. You can see
              what a day, a month, a whole year tends to be working on, and get ready to meet
              it instead of being caught off guard. And there&rsquo;s room in it for you. The
              day hands you a card. How you play it is the part that stays in your hands.
            </p>
            <p>
              That&rsquo;s what makes it an almanac. Like the old farmers&rsquo; almanacs that
              could name the season before it turned, your birthday lays out a lifetime of
              cards, every day behind you and ahead of you already spoken for. None of it is
              something you have to take on faith. It was sitting in the cards the whole time,
              waiting to be read.
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
            Every card below comes from the same arithmetic. Start with today, or go
            straight to the reading you came for.
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
            <h3 className="prop-head">The card of the day, and yours</h3>
            <p className="prop-body">
              The card today hands everyone, next to the one your birthday draws from it.
              See where they line up and where they pull apart. Free, every day.
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
            <h3 className="prop-head">The one card you were born under</h3>
            <p className="prop-body">
              Your tarot birth card, what we call your Bearing. One Major Arcana card fixed
              by your birthday, the angle you carry into every day after.
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
            <h3 className="prop-head">The card this year is working on</h3>
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
              The tarot answer to an astrology birth chart. Three cards for you, three for
              the world you were born into, and your Bearing seated between them.
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
            <h3 className="prop-head">Your whole almanac, kept for you</h3>
            <p className="prop-body">
              The subscription. Every day behind you, a month ahead, your natal chart, and a
              chart for anyone you love, all in one place you can return to.
            </p>
            <span className="prop-go">Make your almanac &rarr;</span>
          </Link>
        </div>
      </section>

      {/* FEATURE BAND — BEARING */}
      <section className="feature-band fb-vellum">
        <div className="fb-text">
          <span className="fb-eyebrow">Your Bearing</span>
          <h2 className="fb-head">The card you<br />came in under<br />is still <em>with you.</em></h2>
          <p className="fb-body">
            Your Bearing is the one Major Arcana card fixed by your birthday, your tarot
            birth card. It shapes the angle you bring to every day: how you tend to meet the
            world, what you keep working with and working through. It doesn&rsquo;t change.
            You do.
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
              Born to navigate by feeling rather than logic. A Moon Bearing gives you a
              gift for sensing what others miss, and a lifelong practice of learning to
              trust it.
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
              The world comes alive in your hands. An Empress Bearing means abundance is
              your native register, and learning where to pour all of it is the work.
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
            Each calendar year sets one Major Arcana card for you, drawn from your birthday.
            Think of it as the theme running under the year, the thing it keeps circling back
            to. Read it early and you can meet the year on purpose, rather than spotting the
            pattern only once it&rsquo;s behind you.
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
              One card, set by your birthday, holding all twelve months of the year.
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE BAND — TAROT BIRTH CHART */}
      <section className="feature-band fb-vellum fb-water">
        <div className="fb-text">
          <span className="fb-eyebrow">Your tarot birth chart</span>
          <h2 className="fb-head">Seven cards, the<br />whole shape of<br /><em>your arrival.</em></h2>
          <p className="fb-body">
            Your birth chart is the tarot answer to an astrology chart. Three cards for the
            person you arrived as, three for the world that met you, and your Bearing seated
            in the middle, drawing the distance between the two. One page that holds the whole
            picture at once.
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

      {/* ACCOUNT PROPOSITION */}
      <section className="acct-band">
        <span className="acct-eyebrow">YOUR ALMANAC</span>
        <StarMark size={20} style={{ display: "block", margin: "10px auto 0" }} />
        <h2 className="acct-head">Today is free.<br /><em>An account opens the rest.</em></h2>
        <p className="acct-sub">
          Your daily card is always yours, no account needed. Make one and your almanac
          fills in: every day behind you, a month ahead, your natal chart, and the charts
          of the people you love.
        </p>
        <div className="acct-cols">
          <div className="acct-col">
            <div className="acct-col-h">Your whole almanac</div>
            <div className="acct-col-b">Every day you&rsquo;ve already lived, open to walk back through. And always a month ahead, unfolding as you go.</div>
          </div>
          <div className="acct-col">
            <div className="acct-col-h">Your natal chart</div>
            <div className="acct-col-b">The full set of cards fixed the day you arrived, read together.</div>
          </div>
          <div className="acct-col">
            <div className="acct-col-h">The people you love</div>
            <div className="acct-col-b">Make a chart for anyone who matters to you, and see the cards they came in under. Yours to keep.</div>
          </div>
        </div>
        <Link href="/me" className="acct-cta">Make your almanac</Link>
      </section>

      <Footer />
    </>
  );
}
