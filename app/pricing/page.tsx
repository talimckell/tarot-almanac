import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { YEAR_READING_PRICE_DISPLAY } from "../../lib/yearReadingPricing";
import { SITE_URL } from "../../lib/site";
import styles from "./page.module.css";

const URL = `${SITE_URL}/pricing`;
const TITLE = "Pricing | The Tarot Almanac";
const DESCRIPTION =
  "What The Tarot Almanac costs: a free daily card with no account, a $7/month subscription for the full almanac, or one-off purchases — a $12 natal chart or a $15 year-ahead reading.";

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
  { label: "Every day behind you, and a month ahead", free: false, sub: true, oneOff: false },
  { label: "Your full natal chart, all seven positions", free: false, sub: true, oneOff: "With the $12 chart" },
  { label: "Charts for the people you love", free: false, sub: true, oneOff: "$12 each" },
  { label: "Monthly personal reading", free: false, sub: true, oneOff: false },
  { label: "Year-ahead woven reading", free: false, sub: `${YEAR_READING_PRICE_DISPLAY} each`, oneOff: `${YEAR_READING_PRICE_DISPLAY} each` },
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
          <h1>What it costs to keep your almanac</h1>
          <p className={styles.deck}>
            Your daily card is always free, no account needed. An account opens the rest for $7 a
            month, cancel anytime. Or buy exactly what you need, once.
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
              Today&rsquo;s cards, the world&rsquo;s and yours. This month, day one through today.
              Your Bearing, free and permanent.
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
              Every day you&rsquo;ve already lived, open to walk back through, and always a month
              ahead. Your full natal chart. Charts for anyone you love, included. A monthly
              personal reading.
            </p>
            <Link href="/me#subscribe" className={styles.tierCta}>
              Make your almanac
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
                A natal chart, fixed and giftable, built from one birthday &mdash; yours or someone
                else&rsquo;s. Or included free with a subscription.
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
                A woven year-ahead reading, built from one birthday and the year&rsquo;s card. Yours
                or a gift.
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
