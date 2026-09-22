import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { YEAR_READING_PRICE_DISPLAY } from "../../lib/yearReadingPricing";
import { SITE_URL } from "../../lib/site";
import styles from "./page.module.css";

const URL = `${SITE_URL}/pricing`;
const TITLE = "Tarot Subscription & Reading Pricing | The Tarot Almanac";
const DESCRIPTION =
  "What The Tarot Almanac costs: free daily cards with no account, a $7/month subscription for the whole Almanac, or one-off purchases: a $12 birth chart or a $15 year-ahead reading.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  openGraph: { title: TITLE, description: DESCRIPTION, url: URL, type: "website" },
};

// Comparison-table content lives in one place so the three-card summary above
// it can't drift from the row-by-row detail below. `sub`/`free`/`oneOff` are
// short cell values: true/false render as check/dash, a string renders as-is.
type Cell = boolean | string;
const ROWS: { label: string; free: Cell; sub: Cell; oneOff: Cell }[] = [
  { label: "Today's cards, collective and yours", free: true, sub: true, oneOff: true },
  { label: "This month, day 1 through today", free: true, sub: true, oneOff: true },
  { label: "Your Bearing (birth card)", free: true, sub: true, oneOff: true },
  { label: "Every day you've lived, plus the month ahead", free: false, sub: true, oneOff: false },
  { label: "Your full birth chart, all seven cards", free: false, sub: true, oneOff: "With the $12 chart" },
  { label: "Charts for the people you love", free: false, sub: true, oneOff: "$12 each" },
  { label: "Monthly personal reading", free: false, sub: true, oneOff: false },
  { label: "Year-ahead reading", free: false, sub: `${YEAR_READING_PRICE_DISPLAY} each`, oneOff: `${YEAR_READING_PRICE_DISPLAY} each` },
  { label: "Cancel anytime", free: true, sub: true, oneOff: true },
  { label: "14-day money-back guarantee", free: false, sub: true, oneOff: false },
];

function Cell({ value }: { value: Cell }) {
  if (value === true) return <span className={styles.yes} aria-label="Included">&#10003;</span>;
  if (value === false) return <span className={styles.no} aria-label="Not included">&mdash;</span>;
  return <span className={styles.note}>{value}</span>;
}

export default function PricingPage() {
  return (
    <>
      <SiteNav current="pricing" />
      <main>
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Pricing</span>
          <h1>What it costs to keep your Almanac</h1>
          <p className={styles.deck}>
            Your daily cards are always free, and you don&rsquo;t need an account. A subscription
            opens up the whole Almanac for $7 a month, and you can cancel anytime. Or buy just what
            you need, once.
          </p>
        </header>

        {/* THREE TIERS */}
        <div className={styles.tiers}>
          <div className={styles.tier}>
            <div className={styles.tierTagline}>No account needed</div>
            <div className={styles.tierName}>Free</div>
            <div className={styles.tierPrice}>
              $0<span className={styles.tierPer}> forever</span>
            </div>
            <p className={styles.tierWhat}>
              Today&rsquo;s cards, the collective card and yours. This month, from day one through
              today. And your Bearing, free for life.
            </p>
            <Link href="/today" className={styles.tierCta}>
              See today&rsquo;s cards
            </Link>
          </div>

          <div className={`${styles.tier} ${styles.tierFeatured}`}>
            <span className={styles.badge}>Most popular</span>
            <div className={styles.tierTagline}>Everything, always</div>
            <div className={styles.tierName}>Subscription</div>
            <div className={styles.tierPrice}>
              $7<span className={styles.tierPer}>/mo</span>
            </div>
            <p className={styles.tierWhat}>
              Every day you&rsquo;ve lived, plus the month ahead. Your full birth chart, and
              charts for the people you love. A personal reading every month. We keep it all in
              one place so you can come back to it whenever you like.
            </p>
            <Link href="/me?subscribe=1#subscribe" className={styles.tierCta}>
              Start your Almanac
            </Link>
            <p className={styles.tierFine}>Cancel anytime. 14-day money-back guarantee.</p>
          </div>

          <div className={styles.tier}>
            <div className={styles.tierTagline}>Pay once, keep it</div>
            <div className={styles.tierName}>One-off purchases</div>

            <div className={styles.oneOffItem}>
              <div className={styles.tierPrice}>
                $12<span className={styles.tierPer}> once</span>
              </div>
              <p className={styles.tierWhat}>
                A birth chart for one birthday, yours or someone else&rsquo;s. It&rsquo;s yours to
                keep, or to give. It&rsquo;s also included with a subscription.
              </p>
              <Link href="/chart" className={styles.tierCtaSecondary}>
                Build a chart
              </Link>
            </div>

            <div className={styles.oneOffDivider} />

            <div className={styles.oneOffItem}>
              <div className={styles.tierPrice}>
                {YEAR_READING_PRICE_DISPLAY}
                <span className={styles.tierPer}> once</span>
              </div>
              <p className={styles.tierWhat}>
                A full year-ahead reading, built from one birthday and that year&rsquo;s card. Get
                one for yourself or give it as a gift.
              </p>
              <Link href="/personal-year-card" className={styles.tierCtaSecondary}>
                See your year card
              </Link>
            </div>
          </div>
        </div>

        {/* COMPARISON TABLE */}
        <section className={styles.compare}>
          <h2>Compare what&rsquo;s included</h2>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th scope="col" className={styles.rowLabel}>
                    <span className={styles.srOnly}>Feature</span>
                  </th>
                  <th scope="col">Free</th>
                  <th scope="col" className={styles.colFeatured}>
                    Subscription
                  </th>
                  <th scope="col">One-off</th>
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className={styles.rowLabel}>
                      {row.label}
                    </th>
                    <td>
                      <Cell value={row.free} />
                    </td>
                    <td className={styles.colFeatured}>
                      <Cell value={row.sub} />
                    </td>
                    <td>
                      <Cell value={row.oneOff} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <p className={styles.trust}>
          Payments are secured by Stripe. Subscriptions cancel anytime through your account.
          Questions? <Link href="/contact">Get in touch</Link>.
        </p>
      </div>
      </main>
      <Footer />
    </>
  );
}
