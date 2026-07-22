// app/personal-month-card/[slug]/page.tsx — one template -> 22 static pages.
// "[Major] as your personal month card." The SEO core of the feature: evergreen,
// indexable, cross-linked. Shows the free tier (the authored month meaning + the
// card behind it); the living almanac (walking all twelve months) is the paid
// layer. Slugs match MAJOR_SLUGS / the /tarot/[slug] hub pages.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { SITE_URL } from "../../../lib/site";
import { MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "../../../lib/almanac";
import { getCardBySlug, getPositionReading } from "../../../lib/cards";
import { majorShortName, indefiniteArticle, ELEMENT_LABEL } from "../../../lib/monthCard";
import "../../personal-year-card/styles.css";

export function generateStaticParams() {
  return MAJOR_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const idx = MAJOR_SLUGS.indexOf(slug as (typeof MAJOR_SLUGS)[number]);
  if (idx < 0) return {};
  const name = MAJORS[idx];
  const body = getPositionReading(slug, "ongoingPersonalMonth")?.body ?? "";
  const title = `${name} as Your Personal Month Card | The Tarot Almanac`;
  const description = `${name} as your personal month card, your tarot card of the month: ${body}`.slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/personal-month-card/${slug}` },
    openGraph: { title, description, url: `${SITE_URL}/personal-month-card/${slug}`, type: "article" },
  };
}

export default async function MonthCardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = MAJOR_SLUGS.indexOf(slug as (typeof MAJOR_SLUGS)[number]);
  if (idx < 0) notFound();

  const name = MAJORS[idx];
  const shortName = majorShortName(idx);
  const aShort = `${indefiniteArticle(shortName)} ${shortName}`;
  const element = ELEMENT_BY_MAJOR[idx];
  const card = getCardBySlug(slug);
  const numberLabel = card?.numberLabel ?? String(idx);
  const body = getPositionReading(slug, "ongoingPersonalMonth")?.body ?? "";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${name} as Your Personal Month Card`,
    about: `${name} tarot month card`,
    author: { "@type": "Organization", name: "The Tarot Almanac" },
    publisher: { "@type": "Organization", name: "The Tarot Almanac" },
    mainEntityOfPage: `${SITE_URL}/personal-month-card/${slug}`,
  };

  return (
    <>
      <SiteNav />
      <main className="pyc-wrap">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <nav className="pyc-crumb">
          <Link href="/">Home</Link> · <Link href="/personal-month-card">Personal Month Card</Link> · {name}
        </nav>

        <header className="pyc-hero">
          <span className="pyc-glyph" style={{ color: `var(--${element})` }}>
            <svg viewBox="0 0 46 46" width={96} height={96} aria-label={`${name} glyph`}>
              <use href={`#ma-${idx}`} />
            </svg>
          </span>
          <span className="num">Major Arcana · {numberLabel}</span>
          <h1>The {shortName} Month</h1>
          <span className={`pyc-chip ${element}`}>
            <span className="dot" />
            {ELEMENT_LABEL[element]}
          </span>
        </header>

        <p className="pyc-blurb">{body}</p>

        <section className="pyc-section">
          <h2>The card behind the month</h2>
          <p className="pyc-subhead">
            Your month card is {name}, one of the twenty-two Majors. Here&rsquo;s what it means at full length.
          </p>
          {card?.essence && <p className="pyc-blurb" style={{ marginTop: 0 }}>{card.essence}</p>}
          <div className="pyc-whattodo">
            <span className="lbl">Read {aShort} month in the almanac</span>
            When a {shortName} month comes around for you, the living almanac reads it the day the
            month turns, then walks the daily cards inside it, personal and collective, alongside
            your Bearing.
          </div>
        </section>

        <section className="pyc-teaser">
          <span className="eyebrow">The living almanac</span>
          <h2>All twelve months, walked with you</h2>
          <p>
            This page is one month&rsquo;s theme. A subscription walks every month as it comes, each
            a step forward through the cycle, brings in how your Bearing meets it, and lays the daily
            cards inside it side by side, personal and collective.
          </p>
          <p style={{ marginTop: 4 }}>
            <Link href="/me#subscribe" style={{ color: "var(--indigo)", fontFamily: "var(--serif-sc)", letterSpacing: "0.1em", textTransform: "uppercase", fontSize: 13, textDecoration: "none" }}>
              See the living almanac &rarr;
            </Link>
          </p>
        </section>

        <p className="pyc-links">
          <Link href="/personal-month-card">Find your own month card &rarr;</Link>
          <br />
          More on this card: <Link href={`/tarot/${slug}`}>{name}, the full meaning</Link> ·{" "}
          <Link href={`/personal-year-card/${slug}`}>{name} as a year card</Link> ·{" "}
          <Link href={`/bearing/${slug}`}>{name} as a Bearing</Link> ·{" "}
          <Link href="/tarot">all seventy-eight cards</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
