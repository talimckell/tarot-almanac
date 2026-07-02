// app/bearing/[slug]/page.tsx — The Tarot Almanac Bearing pages
// One template -> 22 static pages, built from /data/bearings.json.
// bearings.json is exported from the Bearing readings source; never hand-edit it.
// (Its slugs here are normalized to drop the "the-" prefix, matching the MAJOR_SLUGS
// convention already used by /bearing's index + finder — the source file is untouched.)
// Glyphs come from the sprite (public/major-arcana-icons.svg): #ma-0..#ma-21.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import bearings from "@/data/bearings.json";

type Bearing = (typeof bearings)[number];

const SITE = "https://tarotalmanac.com";

export function generateStaticParams() {
  return bearings.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const b = bearings.find((x) => x.slug === slug);
  if (!b) return {};
  const title = `${b.name} Bearing: The Card You Carry`;
  const description = `If your Bearing is ${b.name}, here is how you meet the world. The Bearing is the birth-fixed card of the Tarot Almanac, the one card you carry your whole life.`.slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: `${SITE}/bearing/${b.slug}` },
    openGraph: { title, description, url: `${SITE}/bearing/${b.slug}`, type: "article" },
  };
}

export default async function BearingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const b = bearings.find((x) => x.slug === slug);
  if (!b) notFound();

  // adjacent Bearings on the wheel (wrap 0..21)
  const prev = bearings.find((x) => x.number === (b.number + 21) % 22);
  const next = bearings.find((x) => x.number === (b.number + 1) % 22);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${b.name} Bearing`,
    about: `${b.name} (tarot)`,
    author: { "@type": "Organization", name: "The Tarot Almanac" },
    publisher: { "@type": "Organization", name: "The Tarot Almanac" },
    mainEntityOfPage: `${SITE}/bearing/${b.slug}`,
  };

  return (
    <>
      <SiteNav current="bearing" />
      <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="crumb">
        <Link href="/">Home</Link> · <Link href="/bearing">Bearing</Link> · {b.name}
      </nav>

      <header className="cardhead">
        <span className="glyph" style={{ color: `var(--${b.element})` }}>
          <svg viewBox="0 0 46 46" width={96} height={96} aria-label={`${b.name} glyph`}>
            <use href={`#${b.glyphId}`} />
          </svg>
        </span>
        <span className="num">Bearing · {b.roman}</span>
        <h1>{b.name}</h1>
        <p className="position">how you greet the world</p>
      </header>

      <section className="section">
        <h2>What a Bearing is</h2>
        <p>
          Your Bearing is the one card you carry your whole life. Where the day card turns over
          every day and the month card sets the season, the Bearing never changes. It is computed
          from your birth month and birth day, fixed the moment you arrived, and it describes not a
          mood or a forecast but a standing orientation: the angle you meet the world from.
        </p>
      </section>

      <section className="face gift">
        <div className="face-head"><h2>Your Bearing is {b.name}</h2><span className="tag">{b.roman}</span></div>
        <p>{b.reading}</p>
      </section>

      <aside className="almanac">
        <span className="eyebrow">Your Bearing in the almanac</span>
        <p>
          The Bearing is the lens the rest of your almanac is read through. The same day meets a
          {` ${b.name}`} Bearing differently than it meets any other. It is where you begin.
        </p>
        <p className="dates">
          <Link href="/today">See today&rsquo;s card</Link> · <Link href="/bearing">Find your Bearing</Link>
        </p>
      </aside>

      <section className="related">
        <h2>Nearby on the Wheel</h2>
        <div className="rel-grid">
          {[prev, next].filter(Boolean).map((r) => (
            <Link className="rel-card" href={`/bearing/${(r as Bearing).slug}`} key={(r as Bearing).slug}>
              <span className="rel-glyph" style={{ color: `var(--${(r as Bearing).element})` }}>
                <svg viewBox="0 0 46 46" width={28} height={28}>
                  <use href={`#${(r as Bearing).glyphId}`} />
                </svg>
              </span>
              <span className="rel-num">{(r as Bearing).roman}</span>
              <span className="rel-name">{(r as Bearing).name}</span>
            </Link>
          ))}
          <Link className="rel-card" href={`/tarot/${b.slug}`}>
            <span className="rel-glyph" style={{ color: `var(--${b.element})` }}>
              <svg viewBox="0 0 46 46" width={28} height={28}><use href={`#${b.glyphId}`} /></svg>
            </span>
            <span className="rel-num">CARD</span>
            <span className="rel-name">{b.name} card</span>
          </Link>
        </div>
      </section>
      </main>
      <SiteFooter />
    </>
  );
}
