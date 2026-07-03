import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { computeNatalChart, bearingStepsWord } from "@/lib/natalChart";
import { formatLongDate } from "@/lib/almanac";
import { getPersonalReading } from "@/lib/personalReadings";
import bearings from "@/data/bearings.json";
import ChartDiagram, { LockedPositionsGrid } from "./ChartDiagram";
import { majorGlyphId } from "@/lib/pips";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Tarot Natal Chart | The Tarot Almanac",
  robots: { index: false },
};

export default async function ChartPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/chart");

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email ?? user.id },
  });

  if (!profile.birthDate) {
    return (
      <>
        <SiteNav current="me" />
        <div className={styles.addBirthday}>
          <h1>Add your birthday first</h1>
          <p>
            Your natal chart runs on your birth date. <Link href="/me#your-details">Add it in My Almanac</Link> to see your chart.
          </p>
        </div>
        <SiteFooter />
      </>
    );
  }

  const by = profile.birthDate.getUTCFullYear();
  const bm = profile.birthDate.getUTCMonth() + 1;
  const bd = profile.birthDate.getUTCDate();
  const chart = computeNatalChart(by, bm, bd);
  const unlocked = profile.subscriptionStatus === "active";

  const bearingReading = bearings.find((b) => b.slug === chart.bearing.slug);
  const dayReading = getPersonalReading(chart.personalDayMinor);

  return (
    <>
      <SiteNav current="me" />
      <div className={styles.wrap}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Your Tarot Natal Chart</span>
          <h1>The self you came in as</h1>
          <p className={styles.bornline}>Born {formatLongDate(by, bm, bd)}</p>
        </div>

        <ChartDiagram chart={chart} unlocked={unlocked} columnLabel="You" they={false} />

        <p className={styles.gapNote}>
          {bearingStepsWord(chart.bearing.major).charAt(0).toUpperCase() + bearingStepsWord(chart.bearing.major).slice(1)} steps
          separate you from the world at every layer. That distance, the {chart.bearing.name}, is your Bearing. It never
          changes, and it&rsquo;s yours to keep.
        </p>

        <div className={styles.readings}>
          <div className={`${styles.readcard} ${styles.bearingcard}`}>
            <div className={styles.rcIcon}>
              <svg width="40" height="40" aria-hidden="true">
                <use href={`#${majorGlyphId(chart.bearing.major)}`} />
              </svg>
            </div>
            <div className={styles.rcBody}>
              <div className={styles.rcHead}>
                <span className={styles.rcSide}>Your Bearing · free</span>
              </div>
              <div className={styles.rcName}>{chart.bearing.name}</div>
              {bearingReading && <p className={styles.rcText}>{bearingReading.reading}</p>}
              <Link className={styles.rcMore} href={`/bearing/${chart.bearing.slug}`}>
                Read the full Bearing of {chart.bearing.name} &rarr;
              </Link>
            </div>
          </div>

          {unlocked ? (
            <div className={styles.readcard}>
              <div className={styles.rcIcon}>
                <svg width="40" height="40" aria-hidden="true">
                  <use href={`#${majorGlyphId(chart.collectiveDayMajor.major)}`} />
                </svg>
              </div>
              <div className={styles.rcBody}>
                <div className={styles.rcHead}>
                  <span className={styles.rcSide}>Rising · how you meet a room</span>
                </div>
                <div className={styles.rcName}>{chart.personalDayMinor.minorName}</div>
                {dayReading && <p className={styles.rcText}>{dayReading}</p>}
              </div>
            </div>
          ) : (
            <>
              <LockedPositionsGrid chart={chart} they={false} heading="The other six positions of your chart" />
              <p className={styles.teaser}>
                Your chart also holds the full architecture of who caught you and what you inherited &mdash; unlock it to
                read every position.
              </p>
            </>
          )}
        </div>

        {!unlocked && (
          <div className={styles.paywall}>
            <h3>Read your whole chart</h3>
            <p>
              Your Bearing is yours free. Unlock the other six positions, the self you came in as and the world that
              caught you.
            </p>
            <div className={styles.options}>
              <div className={`${styles.opt} ${styles.primary}`}>
                <div className={styles.tagline}>Everything, always</div>
                <div className={styles.price}>
                  $7<span className={styles.per}>/mo</span>
                </div>
                <div className={styles.what}>
                  Your full chart, plus charts for everyone you love, monthly readings, and time-travel through the year.
                </div>
                <button className={styles.buy} disabled title="Checkout isn't wired up yet">
                  Subscribe
                </button>
              </div>
              <div className={`${styles.opt} ${styles.secondary}`}>
                <div className={styles.tagline}>Just this chart</div>
                <div className={styles.price}>
                  $12<span className={styles.per}> once</span>
                </div>
                <div className={styles.what}>Unlock this one natal chart to read and keep. No subscription.</div>
                <button className={styles.buy} disabled title="Checkout isn't wired up yet">
                  Buy my chart
                </button>
              </div>
            </div>
            <p className={styles.checkoutNote}>Checkout isn&rsquo;t wired up yet &mdash; coming soon.</p>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
