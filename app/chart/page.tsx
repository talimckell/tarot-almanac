import type { Metadata } from "next";
import Link from "next/link";
import { parseDateSlug } from "@/lib/today";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import ShareImageButton from "../components/ShareImageButton";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import { isSubscribed } from "@/lib/compAccounts";
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
import AdsConsent from "../components/AdsConsent";
import AdsPurchaseConversion from "../components/AdsPurchaseConversion";
import { startSubscriptionCheckout, startOwnChartCheckout } from "./checkoutActions";
import InAppBrowserNotice from "../components/InAppBrowserNotice";
import BirthdayFields from "../components/BirthdayFields";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your Tarot Natal Chart | The Tarot Almanac",
  robots: { index: false },
};

export default async function ChartPage({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; session_id?: string; d?: string }>;
}) {
  const { checkout, session_id, d } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Resolve the chart's birth date for signed-in viewers AND guests. Signed-in keeps
  // its exact prior behavior (saved profile birthday). Guests get the preview from a
  // birth date in the URL (?d=YYYY-MM-DD) or an inline form — no account needed to SEE
  // the chart. `unlocked` only ever goes true for a signed-in, paid/subscribed profile,
  // so a guest gets the same leak-proofed preview: the reading text below is gated on
  // `unlocked` and is never shipped to the browser for a guest.
  let by: number, bm: number, bd: number;
  let unlocked = false;
  let subscribed = false;
  let name: string | undefined;
  let purchase: { value: number; currency: string; transactionId: string } | null = null;

  if (user) {
    const profile = await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id, email: user.email ?? user.id },
    });
    name = profile.name ?? undefined;

    // Just back from a successful Stripe Checkout: resolve the real amount from the
    // session so the Google Ads conversion carries a verified value (not a spoofable
    // URL param) and dedupes on transaction_id. Ownership + paid are both checked so a
    // replayed or borrowed session id can't fire a phantom conversion. Owner's own
    // purchases are excluded, mirroring how server analytics drops owner events.
    const isOwner = (user.email ?? "").toLowerCase() === STUDIO_OWNER_EMAIL.toLowerCase();
    if (checkout === "success" && session_id && !isOwner) {
      try {
        const s = await stripe.checkout.sessions.retrieve(session_id);
        if (
          s.payment_status === "paid" &&
          s.metadata?.supabaseUserId === user.id &&
          s.amount_total
        ) {
          purchase = {
            value: s.amount_total / 100,
            currency: (s.currency ?? "usd").toUpperCase(),
            transactionId: s.id,
          };
        }
      } catch {
        purchase = null;
      }
    }

    if (!profile.birthDate) {
      return (
        <>
          <SiteNav current="me" />
          <main>
          <div className={styles.addBirthday}>
            <h1>Add your birthday first</h1>
            <p>
              Your natal chart runs on your birth date. <Link href="/me?next=/chart#your-details">Add it in My Almanac</Link> to see your chart.
            </p>
          </div>
          </main>
          <Footer />
        </>
      );
    }

    by = profile.birthDate.getUTCFullYear();
    bm = profile.birthDate.getUTCMonth() + 1;
    bd = profile.birthDate.getUTCDate();
    subscribed = isSubscribed(profile);
    unlocked = subscribed || !!profile.ownChartPurchasedPaymentIntentId;
  } else {
    // Guest just completed a guest checkout: no session yet (the webhook provisions the
    // account + emails a sign-in link). Confirm the payment and point them to their inbox,
    // rather than dropping back to the birth-date form.
    if (checkout === "success") {
      return (
        <>
          <SiteNav current="me" />
          <main>
          <div className={styles.addBirthday}>
            <h1>Payment received</h1>
            <p>
              Thank you. We&rsquo;ve emailed you a sign-in link so you can read your full chart and keep
              it — check your inbox (and spam) for a note from The Tarot Almanac.
            </p>
          </div>
          </main>
          <Footer />
        </>
      );
    }

    // Guest: no sign-in wall. Show the preview from ?d=YYYY-MM-DD, otherwise a date
    // form. The chart needs the birth YEAR (unlike the month/day Bearing), so this takes
    // a full date, not the Bearing cookie.
    const ymd = d ? parseDateSlug(d) : null;
    const thisYear = new Date().getUTCFullYear();
    if (!ymd || ymd.y < 1900 || ymd.y > thisYear) {
      return (
        <>
          <SiteNav current="me" />
          <main>
          <div className={styles.addBirthday}>
            <h1>See your natal chart</h1>
            <p>
              Your chart runs on your birth date. Enter it to see your chart — the preview is free,
              structure and all, no account needed.
            </p>
            <form method="get" action="/chart" className={styles.dateForm}>
              <BirthdayFields name="d" required selectClassName={styles.dateSelect} />
              <button type="submit" className={styles.seeChart}>See my chart &rarr;</button>
            </form>
            <p className={styles.privacyNote}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="1.5" />
                <path d="M7.5 11V7a4.5 4.5 0 0 1 9 0v4" />
              </svg>
              Your birth date stays private. We use it only to build your chart, and you don&rsquo;t
              need an account to see it.
            </p>
          </div>
          </main>
          <Footer />
        </>
      );
    }
    by = ymd.y;
    bm = ymd.m;
    bd = ymd.d;
  }

  const chart = computeNatalChart(by, bm, bd);
  const readings = getChartReadings(chart);
  const [bearingReading, ...otherReadings] = readings;
  const repeat = findRepeatedMajor(chart);

  // The chart's birth date as YYYY-MM-DD — carried on the guest "Buy my chart" form so
  // guest checkout knows which chart was purchased (ignored for signed-in buyers).
  const birthDateParam = `${by}-${String(bm).padStart(2, "0")}-${String(bd).padStart(2, "0")}`;

  const shareQ = new URLSearchParams({ by: String(by), bm: String(bm), bd: String(bd) });
  if (name) shareQ.set("n", name);
  const chartShareImg = `/chart/share/image?${shareQ}`;
  const chartSharePage = `/chart/share?${shareQ}`;

  return (
    <>
      {/* Headless loader: no banner here (the ask happens on the landing page). If the
          visitor opted in there, this loads the Ads tag so the conversion below can fire. */}
      <AdsConsent />
      {purchase && (
        <AdsPurchaseConversion
          value={purchase.value}
          currency={purchase.currency}
          transactionId={purchase.transactionId}
        />
      )}
      <SiteNav current="me" />
      <main>
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
              title={name ? `${name}'s natal chart` : "My natal chart"}
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
              {repeat ? (
                <a href="#unlock" className={styles.rareCallout}>
                  <span className={styles.rareLabel}>A rare pattern in your chart</span>
                  <span className={styles.rareBody}>
                    One card repeats where it almost never does, somewhere in the six positions
                    still locked. Unlock the full reading to see where it lands.
                  </span>
                  <span className={styles.rareCue}>Read your whole chart &darr;</span>
                </a>
              ) : (
                <p className={styles.teaser}>
                  Your chart also holds the full architecture of who caught you and what you
                  inherited.{" "}
                  <a href="#unlock" className={styles.teaserLink}>
                    Unlock it to read every position &darr;
                  </a>
                </p>
              )}
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
          <div className="trust-solo" style={{ margin: "40px auto 0" }}>
            <div className="trust-card">
              <span className="trust-card-label">On the birth chart</span>
              <p className="trust-quote">
                &ldquo;I have read a lot of astrology and tarot content, and this felt
                more focused and less overwhelming. The chart gave me a clear place
                to start, then let me explore the details at my own pace. Thank
                you!&rdquo;
              </p>
              <span className="trust-name">Tay</span>
            </div>
          </div>
        )}

        {!unlocked && (
          <div id="unlock" className={styles.paywall}>
            <h3>Read your whole chart</h3>
            <p>
              Your Bearing is yours free. Unlock the other six positions, the self you came in as and the world that
              caught you.
            </p>
            <InAppBrowserNotice />
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
                  <input type="hidden" name="location" value="chart_paywall" />
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
                  <input type="hidden" name="d" value={birthDateParam} />
                  <CheckoutSubmitButton className={styles.buy} pendingLabel="Redirecting to Stripe…">
                    Buy my chart
                  </CheckoutSubmitButton>
                </form>
              </div>
            </div>
            <p className={styles.secureLine}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="1.5" />
                <path d="M7.5 11V7a4.5 4.5 0 0 1 9 0v4" />
              </svg>
              Secure checkout with Stripe. We never see your card details.
            </p>
          </div>
        )}

        {unlocked && !subscribed && (
          <div className={styles.paywall}>
            <h3>You&rsquo;ve unlocked this chart</h3>
            <p>A subscription covers everything else: charts for everyone you love, monthly readings, and time-travel.</p>
            <InAppBrowserNotice />
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
                  <input type="hidden" name="location" value="chart_upsell" />
                  <CheckoutSubmitButton className={styles.buy} pendingLabel="Redirecting to Stripe…">
                    Subscribe
                  </CheckoutSubmitButton>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      </main>
      <Footer />
    </>
  );
}
