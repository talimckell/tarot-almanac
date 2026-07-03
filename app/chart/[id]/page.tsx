import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import SiteFooter from "../../components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { computeNatalChart, bearingStepsWord, isFoolBearing, foolBearingNote } from "@/lib/natalChart";
import { formatLongDate } from "@/lib/almanac";
import { getChartReadings } from "@/lib/chartReadings";
import ChartDiagram from "../ChartDiagram";
import ReadCard from "../ReadCard";
import { removeChart } from "./actions";
import styles from "../page.module.css";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const chart = await prisma.savedChart.findUnique({ where: { id } });
  return {
    title: chart ? `${chart.name}'s Chart | The Tarot Almanac` : "Chart | The Tarot Almanac",
    robots: { index: false },
  };
}

export default async function ChartPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/me");

  const saved = await prisma.savedChart.findUnique({ where: { id } });
  // Not owned is treated exactly like not found — no signal either way to a visitor
  // probing ids that aren't theirs.
  if (!saved || saved.ownerId !== user.id) notFound();

  const by = saved.birthDate.getUTCFullYear();
  const bm = saved.birthDate.getUTCMonth() + 1;
  const bd = saved.birthDate.getUTCDate();
  const chart = computeNatalChart(by, bm, bd);
  const readings = getChartReadings(chart, true);
  const [bearingReading, ...otherReadings] = readings;
  const steps = bearingStepsWord(chart.bearing.major);

  return (
    <>
      <SiteNav current="me" />
      <div className={styles.wrap}>
        <div className={styles.crumb}>
          <Link href="/me">My Almanac</Link> / <Link href="/me">Library</Link> / {saved.name}
        </div>
        <div className={styles.head}>
          <span className={styles.eyebrow}>A chart in your library</span>
          <h1>{saved.name}&rsquo;s chart</h1>
          <p className={styles.bornline}>
            Born {formatLongDate(by, bm, bd)} &middot; Bearing of {chart.bearing.name}
          </p>
          <div className={styles.ownerActions}>
            <Link href={`/gift/${saved.shareToken}`}>Share this chart</Link>
            <form action={removeChart} style={{ display: "inline" }}>
              <input type="hidden" name="id" value={saved.id} />
              <button type="submit">Remove</button>
            </form>
          </div>
        </div>

        <ChartDiagram chart={chart} unlocked columnLabel={saved.name} they />

        <p className={styles.gapNote}>
          {steps.charAt(0).toUpperCase() + steps.slice(1)} steps separate {saved.name} from the world at every layer.
          That distance, the {chart.bearing.name}, is {saved.name}&rsquo;s Bearing.
        </p>
        {isFoolBearing(chart) && <p className={styles.gapNote}>{foolBearingNote(`${saved.name}'s`)}</p>}

        <div className={styles.readings}>
          <ReadCard item={bearingReading} featured />
          {otherReadings.map((item) => (
            <ReadCard key={item.key} item={item} />
          ))}
        </div>

        <p className={styles.gapNote}>
          This is {saved.name}&rsquo;s fixed chart, yours to keep in your library. The daily almanac is {saved.name}
          &rsquo;s own to start.
        </p>
      </div>
      <SiteFooter />
    </>
  );
}
