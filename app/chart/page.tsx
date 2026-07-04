import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import ShareImageButton from "../components/ShareImageButton";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  computeNatalChart,
  bearingStepsWord,
  isFoolBearing,
  foolBearingNote,
  findRepeatedMajor,
  repeatedMajorNote,
} from "@/lib/natalChart";
import { formatLongDate } from "@/lib/almanac";
import { getChartReadings } from "@/lib/chartReadings";
import ChartDiagram, { LockedPositionsGrid } from "./ChartDiagram";
import ReadCard from "./ReadCard";
import CheckoutSubmitButton from "../components/CheckoutSubmitButton";
import { startSubscriptionCheckout, startOwnChartCheckout } from "./checkoutActions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Tarot Natal Chart | The Tarot Almanac",
  robots: { index: false },
};

export default async function ChartPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string }>;
}) {
  const { checkout } = await searchParams;
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
        <Footer />
      </>
    );
  }

  const by = profile.birthDate.getUTCFullYear();
  const bm = profile.birthDate.getUTCMonth() + 1;
  const bd = profile.birthDate.getUTCDate();
  const chart = computeNatalChart(by, bm, bd);
  const subscribed = profile.subscriptionStatus === "active";
  const unlocked = subscribed || !!profile.ownChartPurchasedPaymentIntentId;
  const readings = getChartReadings(chart);
  const [bearingReading, ...otherReadings] = readings;
  const repeat = findRepeatedMajor(chart);

  const shareQ = new URLSearchParams({ by: String(by), bm: String(bm), bd: String(bd) });
  if (profile.name) shareQ.set("n", profile.name);
  const chartShareImg = `/chart/share/image?${shareQ}`;
  const chartSharePage = `/chart/share?${shareQ}`;

  return (
    <>
      <SiteNav current="me" />
      <div className={styles.wrap}>
        <div className={styles.head}>
          <span className={styles.eyebrow}>Your Tarot Natal Chart</span>
          <h1>The self you came in as</h1>
          <p className={styles.bornline}>Born {formatLongDate(by, bm, bd)}</p>
          <div style={{ marginTop: 16 }}>
            <ShareImageButton
              imagePath={chartShareImg}
              pagePath={chartSharePage}
              linkPath="/chart"
              title={profile.name ? `${profile.name}'s natal chart` : "My natal chart"}
              text="My natal chart · The Tarot Almanac"
              label="Share my chart"
            />
          </div>
        </div>

        <ChartDiagram chart={chart} unlocked={unlocked} columnLabel="You" they={false} />

        <p className={styles.gapNote}>
          {bearingStepsWord(chart.bearing.major).charAt(0).toUpperCase() + bearingStepsWord(chart.bearing.major).slice(1)} steps
          separate you from the world at every layer. That distance, {chart.bearing.name}, is your Bearing. It never
          changes, and it&rsquo;s yours to keep.
        </p>
        {isFoolBearing(chart) && <p className={styles.gapNote}>{foolBearingNote("your")}</p>}
        {unlocked && repeat && <p className={styles.gapNote}>{repeatedMajorNote(repeat, "your")}</p>}

        <div className={styles.readings}>
          <ReadCard
            item={bearingReading}
            featured
            linkText={`Read the full Bearing of ${chart.bearing.name} →`}
          />

          {unlocked ? (
            otherReadings.map((item) => <ReadCard key={item.key} item={item} />)
          ) : (
            <>
              <LockedPositionsGrid chart={chart} they={false} heading="The other six positions of your chart" />
              <p className={styles.teaser}>
                {repeat
                  ? "Your chart also holds a rare pattern: one card repeats where it almost never does, somewhere in the six positions still locked. It's waiting inside the full reading."
                  : "Your chart also holds the full architecture of who caught you and what you inherited. Unlock it to read every position."}
              </p>
            </>
          )}
        </div>

        {checkout === "success" && !unlocked && (
          <p className={styles.checkoutNote}>
            Payment received — unlocking your chart. If it doesn&rsquo;t appear in a few seconds,{" "}
            <Link href="/chart">refresh this page</Link>.
          </p>
        )}

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
                  Your full chart, plus charts for everyone you love, monthly readings, and time-travel through past and near-future readings.
                </div>
                <form action={startSubscriptionCheckout}>
                  <CheckoutSubmitButton className={styles.buy} pendingLabel="Redirecting to Stripe…">
                    Subscribe
                  </CheckoutSubmitButton>
                </form>
              </div>
              <div className={`${styles.opt} ${styles.secondary}`}>
                <div className={styles.tagline}>Just this chart</div>
                <div className={styles.price}>
                  $12<span className={styles.per}> once</span>
                </div>
                <div className={styles.what}>Unlock this one natal chart to read and keep. No subscription.</div>
                <form action={startOwnChartCheckout}>
                  <CheckoutSubmitButton className={styles.buy} pendingLabel="Redirecting to Stripe…">
                    Buy my chart
                  </CheckoutSubmitButton>
                </form>
              </div>
            </div>
          </div>
        )}

        {unlocked && !subscribed && (
          <div className={styles.paywall}>
            <h3>You&rsquo;ve unlocked this chart</h3>
            <p>A subscription covers everything else: charts for everyone you love, monthly readings, and time-travel.</p>
            <div className={styles.options}>
              <div className={`${styles.opt} ${styles.primary}`}>
                <div className={styles.tagline}>Everything, always</div>
                <div className={styles.price}>
                  $7<span className={styles.per}>/mo</span>
                </div>
                <div className={styles.what}>
                  Charts for everyone you love, monthly readings, and time-travel through past and near-future readings.
                </div>
                <form action={startSubscriptionCheckout}>
                  <CheckoutSubmitButton className={styles.buy} pendingLabel="Redirecting to Stripe…">
                    Subscribe
                  </CheckoutSubmitButton>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
