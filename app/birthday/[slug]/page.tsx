// app/birthday/[slug]/page.tsx — one static page per birthday (366 total).
// Each birthday resolves to its Tarot Bearing (birth-fixed, year-independent) and
// funnels into the full /bearing/[slug] essay and /chart. Structural/navigational
// copy only here; the interpretive content lives in the authored Bearing essay.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { getCardBySlug } from "../../../lib/cards";
import { MAJORS, MAJOR_SLUGS, bearingIndex } from "../../../lib/almanac";
import { majorGlyphId } from "../../../lib/pips";
import { SITE_URL } from "../../../lib/site";
import {
  allBirthdays,
  birthdaySlug,
  formatBirthdayLabel,
  parseBirthdaySlug,
} from "../../../lib/birthday";

export function generateStaticParams() {
  return allBirthdays().map(({ m, d }) => ({ slug: birthdaySlug(m, d) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const md = parseBirthdaySlug(slug);
  if (!md) return {};
  const idx = bearingIndex(md.m, md.d);
  const bearingName = MAJORS[idx];
  const label = formatBirthdayLabel(md.m, md.d);
  const title = `${label} Tarot Card: ${bearingName} | The Tarot Almanac`;
  const description =
    `Born on ${label}? Your tarot Bearing is ${bearingName}, the lifelong card set by your birth month and day. See what ${bearingName} means and how you meet the world.`.slice(0, 158);
  const url = `${SITE_URL}/birthday/${birthdaySlug(md.m, md.d)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function BirthdayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const md = parseBirthdaySlug(slug);
  if (!md) notFound();

  const idx = bearingIndex(md.m, md.d);
  const bearingSlug = MAJOR_SLUGS[idx];
  const card = getCardBySlug(bearingSlug);
  if (!card) notFound();
  const bearingName = MAJORS[idx];
  const label = formatBirthdayLabel(md.m, md.d);

  // Prev/next birthday, wrapping the 366-day cycle, for internal linking and crawl depth.
  const all = allBirthdays();
  const pos = all.findIndex((x) => x.m === md.m && x.d === md.d);
  const prev = all[(pos - 1 + all.length) % all.length];
  const next = all[(pos + 1) % all.length];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${label} Tarot Card: ${bearingName}`,
    about: `${bearingName} (tarot Bearing)`,
    author: { "@type": "Organization", name: "The Tarot Almanac" },
    publisher: { "@type": "Organization", name: "The Tarot Almanac" },
    mainEntityOfPage: `${SITE_URL}/birthday/${birthdaySlug(md.m, md.d)}`,
  };

  return (
    <>
      <SiteNav current="bearing" />
      <main className="wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="crumb">
          <Link href="/">Home</Link> · <Link href="/bearing">Bearing</Link> ·{" "}
          <Link href="/birthday">Birthdays</Link> · {label}
        </nav>

        <header className="cardhead">
          <span className="glyph" style={{ color: `var(--${card.element})` }}>
            <svg viewBox="0 0 46 46" width={96} height={96} aria-label={`${bearingName} glyph`}>
              <use href={`#${majorGlyphId(idx)}`} />
            </svg>
          </span>
          <span className="num">Birthday Bearing</span>
          <h1>{label}</h1>
          <p className="position">your birthday&rsquo;s tarot card</p>
        </header>

        <section className="section">
          <p>
            Everyone born on {label} shares one Tarot Bearing: <strong>{bearingName}</strong>. It is
            set by tarot numerology from the month and day alone, so the year of birth never changes
            it. Two people born on this date in different decades still steer by the same card.
          </p>
        </section>

        <section className="section">
          <h2>What a Bearing is</h2>
          <p>
            Your Bearing is the one tarot card you carry for life. The day card turns over every day
            and the month card sets the season. The Bearing holds still. It comes from your birth
            month and birth day, and it names the angle you meet the world from.
          </p>
        </section>

        <section className="section">
          <h2>Your Bearing is {bearingName}</h2>
          <p>{card.essence}</p>
          <p className="dates">
            <Link href={`/bearing/${bearingSlug}`}>Read the full {bearingName} Bearing &rarr;</Link>
            {" · "}
            <Link href={`/tarot/${bearingSlug}`}>See the card</Link>
          </p>
        </section>

        <aside className="almanac">
          <span className="eyebrow">Go deeper</span>
          <p>
            Your Bearing is where your natal chart begins. The full chart fixes seven cards to your
            birth date, read through this Bearing.
          </p>
          <p className="dates">
            <Link href="/chart">Build your natal chart</Link> · <Link href="/bearing">All 22 Bearings</Link>
          </p>
        </aside>

        <section className="related">
          <h2>Nearby birthdays</h2>
          <p className="dates" style={{ textAlign: "center", marginBottom: 20 }}>
            <Link href="/birthday">See every birthday&rsquo;s card &rarr;</Link>
          </p>
          <div className="rel-grid">
            {[prev, next].map((x) => {
              const bi = bearingIndex(x.m, x.d);
              return (
                <Link className="rel-card" href={`/birthday/${birthdaySlug(x.m, x.d)}`} key={birthdaySlug(x.m, x.d)}>
                  <span className="rel-glyph" style={{ color: `var(--${getCardBySlug(MAJOR_SLUGS[bi])?.element})` }}>
                    <svg viewBox="0 0 46 46" width={28} height={28}>
                      <use href={`#${majorGlyphId(bi)}`} />
                    </svg>
                  </span>
                  <span className="rel-num">{formatBirthdayLabel(x.m, x.d)}</span>
                  <span className="rel-name">{MAJORS[bi]}</span>
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
