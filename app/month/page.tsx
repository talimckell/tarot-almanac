// app/month/page.tsx — the month index (hub for the /month/[ym] collective-month
// pages). Lists the open window (trailing two years + this month + next), newest
// first, so each month page is reachable from one indexable hub rather than only
// through the prev/next stepper chain. Mirrors the [ym] page's open window.
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { MAJORS, MAJOR_SLUGS, collectiveMonth } from "../../lib/almanac";
import { getCardBySlug } from "../../lib/cards";
import { majorGlyphId } from "../../lib/pips";
import { SITE_URL } from "../../lib/site";
import { formatMonthSlug, formatMonthLabel, addMonths, type YM } from "../../lib/today";
import { viewerNowYM } from "../../lib/viewerNow";

// The window depends on the request-time month, so this can't be statically cached.
export const dynamic = "force-dynamic";

// Trailing months to list, matching the sitemap's month window (past 24 + one ahead).
const MONTHS_BACK = 24;

export const metadata: Metadata = {
  title: "Tarot Card of the Month: Every Month's Collective Card | The Tarot Almanac",
  description:
    "The collective tarot card for every month, set by the date and shared by everyone alive that month. Browse the months and see each one's Major.",
  alternates: { canonical: `${SITE_URL}/month` },
  openGraph: {
    title: "Tarot Card of the Month: Every Month's Collective Card",
    description:
      "The collective tarot card for every month, set by the date and shared by everyone alive that month.",
    url: `${SITE_URL}/month`,
    type: "website",
  },
};

export default async function MonthIndexPage() {
  const now = await viewerNowYM();
  // Newest first: next month down through the trailing window.
  const months: YM[] = [];
  for (let i = 1; i >= -MONTHS_BACK; i--) months.push(addMonths(now, i));

  return (
    <>
      <SiteNav current="today" />
      <main className="wrap">
        <nav className="crumb">
          <Link href="/">Home</Link> · <Link href="/today">Today</Link> · Months
        </nav>

        <header className="cardhead">
          <span className="num">By Month</span>
          <h1>The Tarot Card of Each Month</h1>
          <p className="position">the world&rsquo;s card, month by month</p>
        </header>

        <section className="section">
          <p>
            Each month has one collective Major Arcana card, the same for everyone alive that month
            and set by the date alone. Pick a month to see its card and how it&rsquo;s calculated, or
            see <Link href="/today">today&rsquo;s card</Link>.
          </p>
        </section>

        <section className="related">
          <h2>Every month</h2>
          <div className="rel-grid">
            {months.map((mo) => {
              const i = collectiveMonth(mo.y, mo.m);
              return (
                <Link className="rel-card" href={`/month/${formatMonthSlug(mo)}`} key={formatMonthSlug(mo)}>
                  <span className="rel-glyph" style={{ color: `var(--${getCardBySlug(MAJOR_SLUGS[i])?.element})` }}>
                    <svg viewBox="0 0 46 46" width={28} height={28}>
                      <use href={`#${majorGlyphId(i)}`} />
                    </svg>
                  </span>
                  <span className="rel-num">{formatMonthLabel(mo)}</span>
                  <span className="rel-name">{MAJORS[i]}</span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
