// A public, indexable sample of the paid year reading, so buyers see exactly what they get.
// Uses a pinned, curated Maya reading (content/year-reading-sample.json) rendered through the
// real report layout — WYSIWYG. Fictional name on purpose; a real reading is never public.
import type { Metadata } from "next";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { SITE_URL } from "../../../lib/site";
import { buildYearPackage } from "../../../lib/yearReading";
import type { YearReadingSections } from "../../../lib/yearReadingPrompt";
import YearReadingReport from "../reading/[token]/YearReadingReport";
import sampleData from "../../../content/year-reading-sample.json";

const TITLE = "Sample Tarot Year-Ahead Reading | The Tarot Almanac";
const DESCRIPTION =
  "A full sample of the tarot year-ahead reading: the year card, how your Bearing meets the year, the stages you move through, and a woven read of all twelve months.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/personal-year-card/sample` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/personal-year-card/sample`, type: "article" },
};

// The sample is Maya, born March 3, read for 2026 (a Lovers Bearing in a Tower year).
const SAMPLE = { name: "Maya", year: 2026, bm: 3, bd: 3 };

export default function YearReadingSamplePage() {
  const pkg = buildYearPackage(SAMPLE.name, SAMPLE.year, SAMPLE.bm, SAMPLE.bd);
  const sections = sampleData.sections as unknown as YearReadingSections;

  return (
    <>
      <SiteNav />
      <YearReadingReport pkg={pkg} sections={sections} sample />
      <Footer />
    </>
  );
}
