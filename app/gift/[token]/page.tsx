import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteFooter from "../../components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { computeNatalChart, bearingStepsWord, isFoolBearing, foolBearingNote, findRepeatedMajor } from "@/lib/natalChart";
import { formatLongDate } from "@/lib/almanac";
import { formatDateSlug } from "@/lib/today";
import { getChartReadings } from "@/lib/chartReadings";
import ChartDiagram, { LockedPositionsGrid } from "../../chart/ChartDiagram";
import ReadCard from "../../chart/ReadCard";
import styles from "../../chart/page.module.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const saved = await prisma.savedChart.findUnique({ where: { shareToken: token } });
  if (!saved) return {};
  const title = `A chart made for you | The Tarot Almanac`;
  const description = "Someone made you a Tarot Almanac natal chart. See your Bearing and the shape of your chart, free.";
  return { title, description, robots: { index: false } };
}

export default async function GiftPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const saved = await prisma.savedChart.findUnique({
    where: { shareToken: token },
    include: { owner: true },
  });
  if (!saved) notFound();

  const by = saved.birthDate.getUTCFullYear();
  const bm = saved.birthDate.getUTCMonth() + 1;
  const bd = saved.birthDate.getUTCDate();
  const chart = computeNatalChart(by, bm, bd);

  const [bearingReading] = getChartReadings(chart);
  const steps = bearingStepsWord(chart.bearing.major);
  const repeat = findRepeatedMajor(chart);
  const giverName = saved.owner.name ?? saved.owner.email;
  const birthdaySlug = formatDateSlug({ y: by, m: bm, d: bd });

  return (
    <>
      <nav className={styles.giftNav}>
        <div className={styles.giftNavIn}>
          <Link href="/" className={styles.navBrand}>THE TAROT ALMANAC</Link>
          <div className={styles.giftNavLinks}>
            <Link href="/how-it-works">What is this?</Link>
            <Link href="/bearing">Find your Bearing</Link>
          </div>
        </div>
      </nav>
      <div className={styles.wrap}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>A gift, made for you</span>
          <h1>{saved.name}, here&rsquo;s your chart</h1>
          <p className={styles.bornline}>
            Born {formatLongDate(by, bm, bd)} &middot; Bearing of {chart.bearing.name}
          </p>
          <p className={styles.giftFrom}>Made for you by {giverName}, using the Tarot Almanac.</p>
        </div>

        <ChartDiagram chart={chart} unlocked={false} columnLabel={saved.name} they />

        <p className={styles.gapNote}>
          {steps.charAt(0).toUpperCase() + steps.slice(1)} steps separate {saved.name} from the world at every layer.
          That distance, the {chart.bearing.name}, is {saved.name}&rsquo;s Bearing.
        </p>
        {isFoolBearing(chart) && <p className={styles.gapNote}>{foolBearingNote(`${saved.name}'s`)}</p>}

        <div className={styles.readings}>
          <ReadCard item={bearingReading} featured />
          <LockedPositionsGrid chart={chart} they heading={`${saved.name}'s six positions`} />
          {repeat && (
            <p className={styles.teaser}>
              {saved.name}&rsquo;s chart also holds a rare pattern: one card repeats where it almost never does,
              somewhere in the six positions still locked.
            </p>
          )}
        </div>

        <div className={styles.funnel}>
          <h3>This is the part that never changes</h3>
          <p>
            This chart is fixed, set the day {saved.name} was born, and it holds for life. But the <em>living almanac</em>{" "}
            changes every day: a card for today, a reading for this month, the whole year to travel. That part is{" "}
            {saved.name}&rsquo;s alone, and it starts with the birthday above, which we already have.
          </p>
          <Link className={styles.funnelCta} href={`/today?b=${birthdaySlug}`}>
            Start my almanac &rarr;
          </Link>
          <p className={styles.funnelSub}>Free to begin. See today&rsquo;s card and your full Bearing.</p>
        </div>
      </div>
      <SiteFooter />
    </>
  );
}
