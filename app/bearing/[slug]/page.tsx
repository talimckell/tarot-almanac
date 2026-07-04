// app/bearing/[slug]/page.tsx — The Tarot Almanac Bearing pages
// One template -> 22 static pages. Sourced from each Major's own card data
// (content/cards/*.json), not data/bearings.json — that file's own `reading`
// field is a much shorter placeholder; the real, full essay is each card's own
// top-level `bearing.body` (lib/cards.ts exposes it as `bearingReading`).
// Glyphs come from the sprite (public/major-arcana-icons.svg): #ma-0..#ma-21.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import ShareImageButton from "../../components/ShareImageButton";
import { getCardBySlug } from "@/lib/cards";
import { MAJORS, MAJOR_SLUGS } from "@/lib/almanac";
import { majorGlyphId } from "@/lib/pips";
import { renderMarkdown } from "@/lib/markdown";
import TarotCycleGap from "./TarotCycleGap";

// Every Bearing essay uses this exact heading (verified across all 22 Majors) —
// split the raw markdown here so the wheel diagram can sit inside the essay,
// directly under it, rather than only before/after the whole block.
const MEETS_WORLD_HEADING = "**Your Bearing meets the world**";

const SITE = "https://tarotalmanac.com";

export function generateStaticParams() {
  return MAJOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card || card.majorIndex === undefined) return {};
  const title = `${card.name} Bearing: The Card You Carry`;
  const description = `If your Bearing is ${card.name}, here is how you meet the world. The Bearing is the birth-fixed card of the Tarot Almanac, the one card you carry your whole life.`.slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: `${SITE}/bearing/${card.slug}` },
    openGraph: { title, description, url: `${SITE}/bearing/${card.slug}`, type: "article" },
  };
}

export default async function BearingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card || card.majorIndex === undefined || !card.bearingReading) notFound();

  const majorIndex = card.majorIndex;
  const prevIndex = (majorIndex + 21) % 22;
  const nextIndex = (majorIndex + 1) % 22;

  const splitAt = card.bearingReading.indexOf(MEETS_WORLD_HEADING);
  const hasSplit = splitAt !== -1;
  const beforeGap = hasSplit ? card.bearingReading.slice(0, splitAt + MEETS_WORLD_HEADING.length) : card.bearingReading;
  const afterGap = hasSplit ? card.bearingReading.slice(splitAt + MEETS_WORLD_HEADING.length) : "";
  const [htmlBefore, htmlAfter] = await Promise.all([
    renderMarkdown(beforeGap, card.bearingLinkMap),
    renderMarkdown(afterGap, card.bearingLinkMap),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${card.name} Bearing`,
    about: `${card.name} (tarot)`,
    author: { "@type": "Organization", name: "The Tarot Almanac" },
    publisher: { "@type": "Organization", name: "The Tarot Almanac" },
    mainEntityOfPage: `${SITE}/bearing/${card.slug}`,
  };

  return (
    <>
      <SiteNav current="bearing" />
      <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="crumb">
        <Link href="/">Home</Link> · <Link href="/bearing">Bearing</Link> · {card.name}
      </nav>

      <header className="cardhead">
        <span className="glyph" style={{ color: `var(--${card.element})` }}>
          <svg viewBox="0 0 46 46" width={96} height={96} aria-label={`${card.name} glyph`}>
            <use href={`#${majorGlyphId(majorIndex)}`} />
          </svg>
        </span>
        <span className="num">Bearing · {card.numberLabel}</span>
        <h1>{card.name}</h1>
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
        <div className="face-head"><h2>Your Bearing is {card.name}</h2><span className="tag">{card.numberLabel}</span></div>
        <div dangerouslySetInnerHTML={{ __html: htmlBefore }} />
        {hasSplit && (
          <div className="cycle-gap">
            <TarotCycleGap bearingIndex={majorIndex} />
          </div>
        )}
        <div dangerouslySetInnerHTML={{ __html: htmlAfter }} />
      </section>

      <aside className="almanac">
        <span className="eyebrow">Your Bearing in the almanac</span>
        <p>
          The Bearing is the lens the rest of your almanac is read through. The same day meets a
          {` ${card.name}`} Bearing differently than it meets any other. It is where you begin.
        </p>
        <p className="dates">
          <Link href={`/tarot/${card.slug}`}>See the full card for {card.name}</Link> · <Link href="/chart">See your natal chart</Link>
        </p>
        <div style={{ marginTop: 20 }}>
          <ShareImageButton
            imagePath={`/bearing/${card.slug}/share/image`}
            pagePath={`/bearing/${card.slug}/share`}
            linkPath="/bearing"
            title={`The Bearing of ${card.name}`}
            text={`The Bearing of ${card.name} · The Tarot Almanac`}
            label="Share this Bearing"
          />
        </div>
      </aside>

      <section className="related">
        <h2>Nearby on the Wheel</h2>
        <div className="rel-grid">
          {[prevIndex, nextIndex].map((i) => (
            <Link className="rel-card" href={`/bearing/${MAJOR_SLUGS[i]}`} key={MAJOR_SLUGS[i]}>
              <span className="rel-glyph" style={{ color: `var(--${getCardBySlug(MAJOR_SLUGS[i])?.element})` }}>
                <svg viewBox="0 0 46 46" width={28} height={28}>
                  <use href={`#${majorGlyphId(i)}`} />
                </svg>
              </span>
              <span className="rel-num">{getCardBySlug(MAJOR_SLUGS[i])?.numberLabel}</span>
              <span className="rel-name">{MAJORS[i]}</span>
            </Link>
          ))}
          <Link className="rel-card" href={`/tarot/${card.slug}`}>
            <span className="rel-glyph" style={{ color: `var(--${card.element})` }}>
              <svg viewBox="0 0 46 46" width={28} height={28}><use href={`#${majorGlyphId(majorIndex)}`} /></svg>
            </span>
            <span className="rel-num">CARD</span>
            <span className="rel-name">{card.name} card</span>
          </Link>
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
