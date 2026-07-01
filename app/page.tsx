import Link from "next/link";
import TodayEntry from "./today-entry";

// The eight-pointed star mark, reused in a few places.
function StarMark({ size = 20, fill = "var(--warm-stone)", style }: { size?: number; fill?: string; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill={fill} style={style}>
      <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <Link className="nav-brand" href="/">The Tarot Almanac</Link>
        <ul className="nav-links">
          <li><Link href="/today">Today</Link></li>
          <li><Link href="/tarot">The Cards</Link></li>
          <li><Link href="/bearing">Bearings</Link></li>
          <li><Link href="/year/2026">The Year</Link></li>
          <li><Link href="/how-it-works">How It Works</Link></li>
          <li><Link href="/me" className="nav-cta">Make your almanac</Link></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <p className="eyebrow">A PERPETUAL TAROT ALMANAC</p>
          <h1 className="hero-headline">Find your<br />angle on<br /><em>the day.</em></h1>
          <p className="hero-sub">
            Every date has cards, set by tarot numerology. The collective card of the
            day, and the card set by your birth day. Understand where you sit in the
            cycle, and what that has to show you.
          </p>
          <div className="cta-group">
            <Link href="/today" className="btn-primary">SEE TODAY&rsquo;S CARDS</Link>
            <Link href="/how-it-works" className="btn-ghost">How it works &rarr;</Link>
          </div>
        </div>

        <TodayEntry />
      </section>

      {/* PULL QUOTE */}
      <div className="pullquote-band">
        <div className="pq-rule" />
        <p className="pq-text">The card is fixed.<br /><em>What you do with it is not.</em></p>
        <div className="pq-rule" />
      </div>

      {/* VALUE PROPS */}
      <section className="props">
        <Link className="prop" href="/today">
          <span className="prop-eyebrow">TODAY</span>
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
          <h3 className="prop-head">The collective card, and yours</h3>
          <p className="prop-body">
            The card the day hands everyone, and the one your birthdate draws from it.
            See where they meet and where they pull apart.
          </p>
          <span className="prop-go">See today &rarr;</span>
        </Link>

        <Link className="prop" href="/tarot">
          <span className="prop-eyebrow">THE CARDS</span>
          <span className="prop-glyph">
            <svg viewBox="0 0 46 46" fill="none" stroke="var(--water)" strokeWidth="1.4">
              <circle cx="23" cy="23" r="13" />
              <line x1="23" y1="10" x2="23" y2="36" strokeWidth="1.1" />
              <line x1="10" y1="23" x2="36" y2="23" strokeWidth="1.1" />
              <line x1="14" y1="14" x2="32" y2="32" strokeWidth="1.1" />
              <line x1="32" y1="14" x2="14" y2="32" strokeWidth="1.1" />
            </svg>
          </span>
          <h3 className="prop-head">All 78, read in full</h3>
          <p className="prop-body">
            Every card in the deck, upright and reversed, written to meet you as a whole
            adult. The meanings behind every day.
          </p>
          <span className="prop-go">Browse the cards &rarr;</span>
        </Link>

        <Link className="prop" href="/bearing">
          <span className="prop-eyebrow">YOUR BEARING</span>
          <span className="prop-glyph">
            <svg viewBox="0 0 46 46">
              <path d="M28 8 A15 15 0 1 0 28 38 A11 15 0 0 1 28 8 Z" fill="var(--air)" />
            </svg>
          </span>
          <h3 className="prop-head">The card you were born under</h3>
          <p className="prop-body">
            Fixed the day you arrived, never changing. The angle you bring to every day
            after. Enter your birthdate to find yours.
          </p>
          <span className="prop-go">Find your Bearing &rarr;</span>
        </Link>

        <Link className="prop" href="/me">
          <span className="prop-eyebrow">YOUR ALMANAC</span>
          <span className="prop-glyph">
            <svg viewBox="0 0 56 56" fill="var(--earth)">
              <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
            </svg>
          </span>
          <h3 className="prop-head">Every date, and the people you love</h3>
          <p className="prop-body">
            Keep your own days, go back and forward through any date, read your natal
            chart, and follow the days of the people you love.
          </p>
          <span className="prop-go">Make your almanac &rarr;</span>
        </Link>
      </section>

      {/* BEARING BAND */}
      <section className="bearing-band">
        <div className="bb-left">
          <span className="bb-eyebrow">YOUR BEARING</span>
          <h2 className="bb-head">The card you<br />came in under<br />is still <em>with you.</em></h2>
          <p className="bb-body">
            Your Bearing is the Major Arcana card fixed by your birthdate. It shapes the
            angle you bring to every day: how you tend to meet the world, what you keep
            working with and working through. It doesn&rsquo;t change. You do.
          </p>
          <Link href="/bearing" className="bb-cta">Find your Bearing &rarr;</Link>
        </div>
        <div className="bb-right">
          <div className="bb-card">
            <span className="bb-card-label">EXAMPLE BEARING</span>
            <div className="bb-card-name">
              <svg width="22" height="22" viewBox="0 0 46 46" style={{ verticalAlign: "-3px", marginRight: "7px" }}>
                <path d="M28 8 A15 15 0 1 0 28 38 A11 15 0 0 1 28 8 Z" fill="var(--indigo)" />
              </svg>
              The Moon
            </div>
            <div className="bb-card-desc">
              Born to navigate by feeling rather than logic. A Moon Bearing gives you a
              gift for sensing what others miss, and a lifelong practice of learning to
              trust it.
            </div>
          </div>
          <div className="bb-card" style={{ borderLeftColor: "var(--label)" }}>
            <span className="bb-card-label">EXAMPLE BEARING</span>
            <div className="bb-card-name">
              <svg width="22" height="22" viewBox="0 0 46 46" style={{ verticalAlign: "-3px", marginRight: "7px" }} fill="none" stroke="var(--indigo)" strokeWidth="1.6">
                <path d="M23 38 C14 30 14 18 23 10 C32 18 32 30 23 38 Z" />
                <line x1="23" y1="20" x2="23" y2="34" strokeWidth="1.3" />
              </svg>
              The Empress
            </div>
            <div className="bb-card-desc">
              The world comes alive in your hands. An Empress Bearing means abundance is
              your native register, and learning where to pour all of it is the work.
            </div>
          </div>
        </div>
      </section>

      {/* ACCOUNT PROPOSITION */}
      <section className="acct-band">
        <span className="acct-eyebrow">YOUR ALMANAC</span>
        <StarMark size={20} style={{ display: "block", margin: "10px auto 0" }} />
        <h2 className="acct-head">Today is free.<br />Keep it, and <em>follow the people you love.</em></h2>
        <p className="acct-sub">
          Make an account and the whole of time opens: every day behind you and ahead of
          you, your natal chart, and the people whose days you want to keep beside your
          own.
        </p>
        <div className="acct-cols">
          <div className="acct-col">
            <div className="acct-col-h">Every date</div>
            <div className="acct-col-b">The day you were born. The day that mattered. Any day you want to walk toward with a question.</div>
          </div>
          <div className="acct-col">
            <div className="acct-col-h">Your natal chart</div>
            <div className="acct-col-b">The full set of cards fixed the day you arrived, read together.</div>
          </div>
          <div className="acct-col">
            <div className="acct-col-h">The people you love</div>
            <div className="acct-col-b">Follow the people who matter to you, and see the day each of them is walking through.</div>
          </div>
        </div>
        <Link href="/me" className="acct-cta">Make your almanac</Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <Link className="foot-brand" href="/">The Tarot Almanac · tarotalmanac.com</Link>
        <span className="foot-tagline">Find your angle on the day.</span>
        <span className="foot-line">
          <StarMark size={13} style={{ marginRight: "8px" }} />
          The card doesn&rsquo;t change. You do.
        </span>
      </footer>
    </>
  );
}
