// app/month/[ym]/page.tsx — public collective-month pages (e.g. /month/2026-06).
// The COLLECTIVE month card is non-personal and deterministic, so it's public and
// indexable for the open window (past + current + one ahead, via isMonthOpen). The
// personal month card and the AI-woven monthly reading stay paid, behind /me. No
// authored "month reading" text exists, so this page wires what does: the month's
// Major, its essence line, the calculation, and a link to the full card.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { getCardBySlug } from "../../../lib/cards";
import {
  MAJORS,
  MAJOR_SLUGS,
  collectiveYear,
  collectiveMonth,
  phaseBand,
  mod22,
} from "../../../lib/almanac";
import { majorGlyphId } from "../../../lib/pips";
import { SITE_URL } from "../../../lib/site";
import {
  parseMonthSlug,
  formatMonthSlug,
  formatMonthLabel,
  isMonthOpen,
  addMonths,
  type YM,
} from "../../../lib/today";

// The gate depends on the request-time month, so this can never be statically cached.
export const dynamic = "force-dynamic";

function serverNowYM(): YM {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1 };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ym: string }>;
}): Promise<Metadata> {
  const { ym } = await params;
  const target = parseMonthSlug(ym);
  if (!target) return {};
  const label = formatMonthLabel(target);
  const title = `${label} Tarot Card | The Tarot Almanac`;

  // Months past the open window are gated and speculative, so they stay out of the
  // index. Open months are indexed with a self-canonical and a card-specific snippet.
  if (!isMonthOpen(target, serverNowYM())) {
    return { title, robots: { index: false } };
  }

  const name = MAJORS[collectiveMonth(target.y, target.m)];
  const description = `The collective tarot card for ${label} is ${name}. See the month's Major, how it is calculated, and the card it sets for the season.`;
  const url = `${SITE_URL}/month/${formatMonthSlug(target)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function MonthPage({
  params,
}: {
  params: Promise<{ ym: string }>;
}) {
  const { ym } = await params;
  const target = parseMonthSlug(ym);
  if (!target) notFound();

  const now = serverNowYM();
  const open = isMonthOpen(target, now);
  const label = formatMonthLabel(target);
  const prev = addMonths(target, -1);
  const next = addMonths(target, 1);

  // ===== Gated: no card is computed or sent for out-of-window future months. =====
  if (!open) {
    return (
      <>
        <SiteNav current="today" />
        <main className="wrap">
          <nav className="crumb">
            <Link href="/">Home</Link> · <Link href="/today">Today</Link> · {label}
          </nav>
          <header className="cardhead">
            <span className="num">Collective Month</span>
            <h1>{label}</h1>
            <p className="position">not open yet</p>
          </header>
          <section className="section">
            <p>
              The Almanac reaches one month ahead at a time. {label} opens when the calendar
              gets closer. Until then, see where the world stands this month.
            </p>
            <p className="dates">
              <Link href={`/month/${formatMonthSlug(now)}`}>This month&rsquo;s card &rarr;</Link>
            </p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const cyIdx = collectiveYear(target.y);
  const cmIdx = collectiveMonth(target.y, target.m);
  const card = getCardBySlug(MAJOR_SLUGS[cmIdx]);
  if (!card) notFound();
  const rawSum = cyIdx + target.m;
  const band = phaseBand(cmIdx);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${label} Tarot Card: ${MAJORS[cmIdx]}`,
    about: `${MAJORS[cmIdx]} (collective month card)`,
    author: { "@type": "Organization", name: "The Tarot Almanac" },
    publisher: { "@type": "Organization", name: "The Tarot Almanac" },
    mainEntityOfPage: `${SITE_URL}/month/${formatMonthSlug(target)}`,
  };

  return (
    <>
      <SiteNav current="today" />
      <main className="wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="crumb">
          <Link href="/">Home</Link> · <Link href="/today">Today</Link> · {label}
        </nav>

        <header className="cardhead">
          <span className="glyph" style={{ color: `var(--${card.element})` }}>
            <svg viewBox="0 0 46 46" width={96} height={96} aria-label={`${card.name} glyph`}>
              <use href={`#${majorGlyphId(cmIdx)}`} />
            </svg>
          </span>
          <span className="num">Collective Month · {card.numberLabel}</span>
          <h1>{label}</h1>
          <p className="position">the world&rsquo;s card for the month</p>
        </header>

        <section className="section">
          <p>
            The collective card for {label} is <strong>{card.name}</strong>. It&rsquo;s the same for
            everyone alive this month, set by the date alone, and it sits in the {band.toLowerCase()}{" "}
            third of the wheel.
          </p>
          <p>{card.essence}</p>
          <p className="dates">
            <Link href={`/tarot/${card.slug}`}>See {card.name} in full &rarr;</Link>
          </p>
        </section>

        <section className="section">
          <h2>How {label} becomes {card.name}</h2>
          <p>
            The collective year card for {target.y} is{" "}
            <Link href={`/tarot/${MAJOR_SLUGS[cyIdx]}`}>{MAJORS[cyIdx]}</Link> ({cyIdx}). Add the
            month number ({formatMonthLabel(target).split(" ")[0]} is month {target.m}): {cyIdx} + {target.m} ={" "}
            {rawSum}
            {rawSum !== cmIdx ? `, which wraps around the twenty-two to ${cmIdx}` : ""}. Card {cmIdx} is{" "}
            {card.name}.
          </p>
        </section>

        <aside className="almanac">
          <span className="eyebrow">Your month, not just the world&rsquo;s</span>
          <p>
            This is the collective card. Your own month card comes from your birthday meeting it,
            and the full month reading weaves every day of it together. Both live in your almanac.
          </p>
          <p className="dates">
            <Link href="/me">Open your almanac</Link> · <Link href="/today">See today</Link>
          </p>
        </aside>

        <section className="related">
          <h2>Nearby months</h2>
          <div className="rel-grid">
            {[prev, next].map((m) => {
              const i = collectiveMonth(m.y, m.m);
              return (
                <Link className="rel-card" href={`/month/${formatMonthSlug(m)}`} key={formatMonthSlug(m)}>
                  <span className="rel-glyph" style={{ color: `var(--${getCardBySlug(MAJOR_SLUGS[i])?.element})` }}>
                    <svg viewBox="0 0 46 46" width={28} height={28}>
                      <use href={`#${majorGlyphId(i)}`} />
                    </svg>
                  </span>
                  <span className="rel-num">{formatMonthLabel(m)}</span>
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
