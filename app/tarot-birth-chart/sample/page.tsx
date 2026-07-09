// app/tarot-birth-chart/sample/page.tsx — PUBLIC, indexable sample of the natal chart,
// so an ad/organic visitor sees exactly what the $12 chart reads like before paying.
// Renders the REAL chart engine + the REAL ReadCard layout, fully unlocked — WYSIWYG,
// the same components /chart/[id] uses. Maya is a fictional example (the same Maya as the
// year-reading sample: born March 3, a Lovers Bearing); a real chart is never public.
// The authored per-position copy is the deck's own natal text, not generated here.
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { SITE_URL } from "../../../lib/site";
import {
  computeNatalChart,
  bearingStepsWord,
  isFoolBearing,
  foolBearingNote,
  findRepeatedMajor,
  repeatedMajorNote,
} from "../../../lib/natalChart";
import { formatLongDate } from "../../../lib/almanac";
import { getChartReadings } from "../../../lib/chartReadings";
import ChartDiagram from "../../chart/ChartDiagram";
import ReadCard from "../../chart/ReadCard";
import styles from "../../chart/page.module.css";

const URL = `${SITE_URL}/tarot-birth-chart/sample`;
const TITLE = "Sample Tarot Birth Chart | The Tarot Almanac";
const DESCRIPTION =
  "A full sample tarot birth chart, read all the way through: seven cards from one birthday, each position named and read, with the Bearing that ties them together. See exactly what a chart gives you.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "article" },
};

// The sample subject: Maya, born March 3, 1988 — the same Maya as the year-reading
// sample (March 3 gives a Lovers Bearing, consistent across both). The birth year the
// chart needs yields a varied spread: Wheel, Emperor, Death, Chariot, Lovers.
const SAMPLE = { name: "Maya", by: 1988, bm: 3, bd: 3 };

export default function TarotBirthChartSamplePage() {
  const chart = computeNatalChart(SAMPLE.by, SAMPLE.bm, SAMPLE.bd);
  const readings = getChartReadings(chart);
  const [bearingReading, ...otherReadings] = readings;
  const steps = bearingStepsWord(chart.bearing.major);
  const repeat = findRepeatedMajor(chart);

  return (
    <>
      <SiteNav current="chart" />
      <div className={styles.wrap}>
        <div className={styles.crumb}>
          <Link href="/tarot-birth-chart">Tarot Birth Chart</Link> / Sample
        </div>
        <div className={styles.head}>
          <span className={styles.eyebrow}>A sample chart</span>
          <h1>{SAMPLE.name}&rsquo;s chart</h1>
          <p className={styles.bornline}>
            Born {formatLongDate(SAMPLE.by, SAMPLE.bm, SAMPLE.bd)} &middot; Bearing of {chart.bearing.name}
          </p>
          <p className={styles.giftFrom}>Maya is an example. A real chart is only ever the account holder&rsquo;s own.</p>
        </div>

        <ChartDiagram chart={chart} unlocked columnLabel={SAMPLE.name} they />

        <p className={styles.gapNote}>
          {steps.charAt(0).toUpperCase() + steps.slice(1)} steps separate {SAMPLE.name} from the world at every layer.
          That distance, {chart.bearing.name}, is {SAMPLE.name}&rsquo;s Bearing.
        </p>
        {isFoolBearing(chart) && <p className={styles.gapNote}>{foolBearingNote(`${SAMPLE.name}'s`)}</p>}
        {repeat && <p className={styles.gapNote}>{repeatedMajorNote(repeat, `${SAMPLE.name}'s`)}</p>}

        <div className={styles.readings}>
          <ReadCard
            item={bearingReading}
            featured
            linkText={`Read the full Bearing of ${chart.bearing.name} →`}
          />
          {otherReadings.map((item) => (
            <ReadCard key={item.key} item={item} />
          ))}
        </div>

        <div className={styles.funnel}>
          <h3>Now build your own</h3>
          <p>
            This is Maya&rsquo;s, read in full. Yours is seven cards from your own birthday, named and read the
            same way, then woven into one portrait you can keep or give. A chart is $12 on its own, or included
            with a subscription.
          </p>
          <Link className={styles.funnelCta} href="/chart">
            Build your natal chart &rarr;
          </Link>
          <p className={styles.funnelSub}>
            <Link href="/tarot-birth-chart">What each position means</Link> &middot;{" "}
            <Link href="/bearing">Find your Bearing first</Link>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
