// app/tarot/[slug]/page.tsx — The Tarot Almanac card hub pages
// One template -> 78 static pages, built from /content/cards/*.json via lib/cards.ts.
// The card JSONs are exported from the master xlsx; never hand-edit them.
// Glyphs come from the sprite (public/major-arcana-icons.svg): #ma-0..#ma-21 for Majors,
// #suit-{wands|cups|swords|pentacles} for minors.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { getAllCards, getCardBySlug, getRelated, type Card } from "../../../lib/cards";
import { pipRows, suitGlyphId, isCourt } from "../../../lib/pips";

const SITE = "https://tarotalmanac.com";

export function generateStaticParams() {
  return getAllCards().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) return {};
  const title = `${card.name}: Tarot Card Meaning, Reversed & Upright | The Tarot Almanac`;
  const description = `${card.name} in tarot: ${card.essence}`.slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: `${SITE}/tarot/${card.slug}` },
    openGraph: { title, description, url: `${SITE}/tarot/${card.slug}`, type: "article" },
  };
}

// Hero glyph: Major -> single sprite symbol; minor pip -> rank-many suit symbols in
// row-balanced rows (lib/pips.ts); court -> one larger suit symbol.
function Hero({ card }: { card: Card }) {
  if (card.arcana === "major") {
    return (
      <span className="glyph" style={{ color: `var(--${card.element})` }}>
        <svg viewBox="0 0 46 46" width={96} height={96} aria-label={`${card.name} glyph`}>
          <use href={`#ma-${card.majorIndex}`} />
        </svg>
      </span>
    );
  }

  const glyphId = suitGlyphId(card.meta.suit ?? "");
  const court = isCourt(card.meta.rankName ?? "");

  if (court) {
    return (
      <span className="glyph" style={{ color: `var(--${card.element})` }}>
        <svg viewBox="0 0 44 44" width={88} height={88} aria-label={`${card.name} glyph`}>
          <use href={`#${glyphId}`} />
        </svg>
      </span>
    );
  }

  const rankNumber = ["Ace", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"].indexOf(
    card.meta.rankName ?? ""
  ) + 1;
  const rows = pipRows(rankNumber);
  return (
    <div className="pips" aria-label={card.name} style={{ color: `var(--${card.element})` }}>
      {rows.map((n, ri) => (
        <div className="pip-row" key={ri}>
          {Array.from({ length: n }).map((_, i) => (
            <svg key={i} viewBox="0 0 44 44" width={34} height={34}>
              <use href={`#${glyphId}`} />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}

function RelatedGlyph({ card }: { card: Card }) {
  const href = card.arcana === "major" ? `#ma-${card.majorIndex}` : `#${suitGlyphId(card.meta.suit ?? "")}`;
  return (
    <span className="rel-glyph" style={{ color: `var(--${card.element})` }}>
      <svg viewBox="0 0 46 46" width={28} height={28}>
        <use href={href} />
      </svg>
    </span>
  );
}

export default async function CardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card) notFound();

  const isMajor = card.arcana === "major";
  const court = !isMajor && isCourt(card.meta.rankName ?? "");
  const numberingNote = card.slug === "strength" || card.slug === "justice";
  const related = getRelated(card);

  const headerNum = isMajor
    ? `Major Arcana · ${card.numberLabel}`
    : `Minor Arcana · ${card.meta.suit}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${card.name}: Tarot Card Meaning, Reversed & Upright`,
    about: card.name,
    author: { "@type": "Organization", name: "The Tarot Almanac" },
    publisher: { "@type": "Organization", name: "The Tarot Almanac" },
    mainEntityOfPage: `${SITE}/tarot/${card.slug}`,
  };

  return (
    <>
      <SiteNav current="tarot" />
      <main className="wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="crumb">
        <Link href="/">Home</Link> · <Link href="/tarot">The Cards</Link> ·{" "}
        {isMajor ? (
          <Link href="/tarot">Major Arcana</Link>
        ) : (
          <Link href="/tarot">{card.meta.suit}</Link>
        )}{" "}
        · {card.name}
      </nav>

      <header className="cardhead">
        <Hero card={card} />
        <span className="num">{headerNum}</span>
        <h1>{card.name}</h1>
        <p className="position">{card.meta.tagline}</p>
      </header>

      <div className="meta">
        {isMajor ? (
          <>
            <div className="item"><span className="lbl">Arcana</span><span className="val">Major · {card.majorIndex}</span></div>
            <div className="item"><span className="lbl">Element</span><span className={`val ${card.element}`}>{card.meta.element}</span></div>
          </>
        ) : (
          <>
            <div className="item"><span className="lbl">Suit</span><span className={`val ${card.element}`}>{card.meta.suit}</span></div>
            <div className="item"><span className="lbl">Element</span><span className={`val ${card.element}`}>{card.meta.element}</span></div>
            <div className="item"><span className="lbl">{court ? "Court" : "Rank"}</span><span className="val">{card.meta.rankName}</span></div>
          </>
        )}
      </div>

      <p className="essence">{card.essence}</p>

      <section className="section">
        <h2>The Card in the Journey</h2>
        <p>{card.narrative}</p>
      </section>

      {/* THE GIFT (upright) */}
      <section className="face gift">
        <div className="face-head"><h2>The Gift</h2><span className="tag">Upright</span></div>
        <p className="keywords"><b>Keywords:</b> {card.gift.keywords.join(", ")}</p>
        <p>{card.gift.body}</p>
        <p className="affirm">{card.gift.affirmation}</p>
      </section>

      {/* THE SHADOW (reversed as distortion) */}
      <section className="face shadow">
        <div className="face-head"><h2>The Shadow</h2><span className="tag">Reversed · as distortion</span></div>
        <p className="keywords"><b>Keywords:</b> {card.shadow.keywords.join(", ")}</p>
        <p>{card.shadow.body}</p>
        <p className="affirm">{card.shadow.affirmation}</p>
      </section>

      {/* THE RECLAIMING (reversed as refusal) */}
      <section className="face reclaiming">
        <div className="face-head"><h2>The Reclaiming</h2><span className="tag">Reversed · as refusal</span></div>
        <p className="keywords"><b>Keywords:</b> {card.reclaiming.keywords.join(", ")}</p>
        <p>{card.reclaiming.body}</p>
        <p className="affirm">{card.reclaiming.affirmation}</p>
      </section>

      {/* SKILLS — one unified list */}
      <section className="skills">
        <h2>Skills This Card Asks For</h2>
        <ul>
          {card.skills.map((skill) => (
            <li key={skill}>
              <svg className="star" viewBox="0 0 56 56" fill="var(--warm-stone)">
                <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
              </svg>
              {skill}
            </li>
          ))}
        </ul>
      </section>

      {numberingNote && (
        <p className="numbering-note">
          A note on numbering: the Almanac places Strength at 8 and Justice at 11, the Golden Dawn
          ordering most modern decks follow. Older Marseille decks swap the two.
        </p>
      )}

      <aside className="almanac">
        <span className="eyebrow">This card in the almanac</span>
        <p>When the system hands you {card.name}, it points at the shape of the day, not a fortune. The card is fixed. What you do with it is yours.</p>
        <p className="dates">
          <Link href="/today">See today&rsquo;s card</Link> · <Link href="/tarot">All seventy-eight</Link>
          {isMajor && (
            <>
              {" "}· <Link href={`/bearing/${card.slug}`}>{card.name} as a Bearing</Link>
            </>
          )}
        </p>
      </aside>

      <section className="related">
        <h2>Nearby in the Journey</h2>
        <div className="rel-grid">
          {related.map((c) => (
            <Link className="rel-card" href={`/tarot/${c.slug}`} key={c.slug}>
              <RelatedGlyph card={c} />
              <span className="rel-num">
                {c.arcana === "major" ? c.numberLabel : (c.meta.suit ?? "").toUpperCase()}
              </span>
              <span className="rel-name">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
      </main>
      <Footer />
    </>
  );
}
