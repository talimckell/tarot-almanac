import Link from "next/link";
import { YEAR_READING_PRICE_DISPLAY } from "@/lib/yearReadingPricing";
import type { YearPackage } from "@/lib/yearReading";
import type { YearReadingSections } from "@/lib/yearReadingPrompt";
import ReportBody from "./ReportBody";
import "../../styles.css";

// The full-page wrapper: page chrome (crumb) + the report body + a bottom CTA that
// differs between the public sample (buy your own) and a real owned reading (just a
// credit line). The report content itself lives in ReportBody, which is also embedded
// directly on the checkout confirm page (see personal-year-card/continue/page.tsx).
export default function YearReadingReport({
  pkg,
  sections,
  sample = false,
}: {
  pkg: YearPackage;
  sections: YearReadingSections | null;
  sample?: boolean;
}) {
  return (
    <main className="pyc-wrap">
      <nav className="pyc-crumb">
        <Link href="/personal-year-card">Tarot Year Card</Link> · {sample ? "Sample reading" : "Your reading"}
      </nav>

      <ReportBody pkg={pkg} sections={sections} sample={sample} />

      {sample ? (
        <div className="pyc-sample-cta">
          <span className="eyebrow">Your year, woven like this</span>
          <h2>See your own year ahead</h2>
          <p>
            Enter your birthday and we&rsquo;ll write your year the same way, from your own cards.
            A keepsake you can read once and return to all year, or give to someone you love.
          </p>
          <Link href="/personal-year-card" className="pyc-cta-btn">
            Get your year-ahead reading · {YEAR_READING_PRICE_DISPLAY}
          </Link>
        </div>
      ) : (
        <p className="pyc-links">
          Made with <Link href="/personal-year-card">the tarot year card calculator</Link> at The Tarot Almanac.
        </p>
      )}
    </main>
  );
}
