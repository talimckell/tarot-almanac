// The post-sign-in landing spot for the year-reading buy flow. A stranger who clicks
// "Get the full woven reading" signed out gets bounced to /sign-in (checkoutActions.ts),
// then lands here instead of back on the full calculator — so finishing doesn't feel
// like starting over. This page is deliberately narrow: no month/day/year dropdowns, no
// FAQ, no "every year card" grid, just the card they already found plus one button.
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { createClient } from "../../../lib/supabase/server";
import {
  yearCardIndex,
  yearCardContent,
  yearMonths,
  majorName,
  majorElement,
  parseYearCardResumeParams,
  MONTH_NAMES,
} from "../../../lib/yearCard";
import { YEAR_READING_PRICE_DISPLAY } from "../../../lib/yearReadingPricing";
import { startYearReadingCheckout } from "../checkoutActions";
import "../styles.css";

export const metadata: Metadata = {
  title: "Continue your year reading | The Tarot Almanac",
  robots: { index: false },
};

export default async function ContinueYearReading({
  searchParams,
}: {
  searchParams: Promise<{ bm?: string; bd?: string; year?: string }>;
}) {
  const { bm, bd, year } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const here = `/personal-year-card/continue?bm=${bm ?? ""}&bd=${bd ?? ""}&year=${year ?? ""}`;
    redirect(`/sign-in?next=${encodeURIComponent(here)}&reason=year-reading`);
  }

  const parsed = parseYearCardResumeParams(bm, bd, year);
  if (!parsed) redirect("/personal-year-card");

  const idx = yearCardIndex(parsed.year, parsed.bm, parsed.bd);
  const content = yearCardContent(idx);
  const months = yearMonths(idx);
  const bmPadded = String(parsed.bm).padStart(2, "0");
  const bdPadded = String(parsed.bd).padStart(2, "0");

  return (
    <>
      <SiteNav />
      <main className="pyc-wrap">
        <nav className="pyc-crumb">
          <Link href="/">Home</Link> · Personal Year Card
        </nav>

        <p className="pyc-eyebrow">You&rsquo;re signed in</p>
        <h1 className="pyc-h1">One more step</h1>
        <p className="pyc-lede">
          Your card&rsquo;s still right here. Confirm and I&rsquo;ll take you to checkout.
        </p>

        <div className="pyc-result" style={{ marginTop: 32 }}>
          <span className="pyc-glyph" style={{ color: `var(--${majorElement(idx)})` }}>
            <svg viewBox="0 0 46 46" aria-label={`${majorName(idx)} glyph`}>
              <use href={`#ma-${idx}`} />
            </svg>
          </span>
          <div>
            <p className="rlead">Your {parsed.year} year card is</p>
            <p className="rname">{majorName(idx)}</p>
            <p className="rblurb">{content.blurb}</p>
          </div>
        </div>

        <div className="pyc-result-wheel">
          <span className="pyc-eyebrow" style={{ marginBottom: 10 }}>
            Your {parsed.year} year wheel
          </span>
          <p className="hint" style={{ marginTop: 0, marginBottom: 14 }}>
            The twelve months that follow from your year card, one Major each. The full
            reading walks each one; this is just the shape of it.
          </p>
          <div className="pyc-arc">
            {months.map((mi, i) => (
              <div className="pyc-arc-item" key={i}>
                <span className="pyc-glyph" style={{ color: `var(--${majorElement(mi)})` }}>
                  <svg viewBox="0 0 46 46" aria-hidden="true">
                    <use href={`#ma-${mi}`} />
                  </svg>
                </span>
                <span>
                  <span className="mon">{MONTH_NAMES[i]}</span>
                  <br />
                  <span className="cardname">{majorName(mi)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        <form action={startYearReadingCheckout} className="pyc-buy">
          <input type="hidden" name="bm" value={bmPadded} />
          <input type="hidden" name="bd" value={bdPadded} />
          <input type="hidden" name="year" value={String(parsed.year)} />
          <input name="name" className="pyc-buy-name" placeholder="Name for the reading (yours, or a gift)" maxLength={40} />
          <button type="submit" className="pyc-cta-btn">
            Get the full woven reading · {YEAR_READING_PRICE_DISPLAY}
          </button>
        </form>

        <p className="pyc-links">
          <Link href="/personal-year-card">Not right now, back to the calculator</Link>
        </p>
      </main>
      <Footer />
    </>
  );
}
