import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import BirthdayFields from "../components/BirthdayFields";
import { SITE_URL } from "@/lib/site";
import { computeNatalChart, bearingStepsWord } from "@/lib/natalChart";
import { getChartReadings } from "@/lib/chartReadings";
import ChartDiagram from "../chart/ChartDiagram";
import ReadCard from "../chart/ReadCard";
import chartStyles from "../chart/page.module.css";
import { startGiftCheckout } from "./actions";
import styles from "./gift.module.css";

const TITLE = "Gift a Tarot Birth Chart | The Tarot Almanac";
const DESCRIPTION =
  "Give someone their tarot birth chart: seven cards made from their birthday. You send a link, they open it and see their cards. No account, no app. $12, one time.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/gift` },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}/gift`, type: "website" },
};

// Eight-pointed star mark, reused in the step icons.
function Star({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 56 56" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
    </svg>
  );
}

export default function GiftLandingPage() {
  // A real sample chart (Ava, March 15 1990 → the Moon) for the "see a full example"
  // reveal. Rendered with the exact components the recipient opens at /gift/[token], so
  // the example is faithful: their Bearing named and fully read, plus the six positions.
  const sample = computeNatalChart(1990, 3, 15);
  const [sampleBearing, ...sampleOthers] = getChartReadings(sample);
  const sampleSteps = bearingStepsWord(sample.bearing.major);

  return (
    <>
      <SiteNav />
      <main className={styles.wrap}>
        {/* HERO */}
        <header className={styles.hero}>
          <span className={styles.eyebrow}>A gift from The Tarot Almanac</span>
          <h1>Give someone their tarot birth chart</h1>
          <p className={styles.heroLede}>
            It&rsquo;s seven cards, made from the day they were born. You send them a link. They open it
            and see their cards. No app, no account, nothing to wait for.
          </p>
          <a href="#make" className={styles.heroBtn}>Make their chart &middot; $12 &rarr;</a>
          <p className={styles.heroSub}>One payment of $12. They never pay a thing.</p>
        </header>

        {/* HOW IT WORKS — three steps with visuals */}
        <section className={styles.steps}>
          <h2 className={styles.sectionH}>How it works</h2>
          <div className={styles.stepGrid}>
            <div className={styles.step}>
              <span className={styles.stepIcon}>
                {/* birthday cake */}
                <svg viewBox="0 0 64 64" width="52" height="52" fill="none" stroke="var(--indigo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 40 h44 v10 a4 4 0 0 1-4 4 H14 a4 4 0 0 1-4-4 Z" />
                  <path d="M10 44 c6 0 6 4 11 4 s5-4 11-4 5 4 11 4 5-4 11-4" />
                  <path d="M20 40 V28 M32 40 V28 M44 40 V28" />
                </svg>
                <span className={styles.stepStar}><Star size={16} /></span>
              </span>
              <span className={styles.stepNum}>Step 1</span>
              <h3>Tell us who it&rsquo;s for</h3>
              <p>Their first name and their birthday. That&rsquo;s all we need.</p>
            </div>

            <div className={styles.step}>
              <span className={styles.stepIcon}>
                {/* a little chart: two columns of cards */}
                <svg viewBox="0 0 64 64" width="52" height="52" fill="none" stroke="var(--indigo)" strokeWidth="2" aria-hidden="true">
                  <rect x="12" y="10" width="16" height="13" rx="2" />
                  <rect x="36" y="10" width="16" height="13" rx="2" />
                  <rect x="12" y="41" width="16" height="13" rx="2" />
                  <rect x="36" y="41" width="16" height="13" rx="2" />
                </svg>
                <span className={styles.stepStarMid}><Star size={18} /></span>
              </span>
              <span className={styles.stepNum}>Step 2</span>
              <h3>We make their chart</h3>
              <p>Seven tarot cards, worked out from the day they were born.</p>
            </div>

            <div className={styles.step}>
              <span className={styles.stepIcon}>
                {/* phone with a message */}
                <svg viewBox="0 0 64 64" width="52" height="52" fill="none" stroke="var(--indigo)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="18" y="8" width="28" height="48" rx="4" />
                  <path d="M28 50 h8" />
                </svg>
                <span className={styles.stepStar}><Star size={16} /></span>
              </span>
              <span className={styles.stepNum}>Step 3</span>
              <h3>You get a link to send</h3>
              <p>Text or email it to them. When they open it, their chart is right there.</p>
            </div>
          </div>
        </section>

        {/* WHAT THEY OPEN — preview */}
        <section className={styles.previewSection}>
          <h2 className={styles.sectionH}>What they&rsquo;ll open</h2>
          <p className={styles.sectionSub}>
            A page made just for them, with their main card and the shape of their whole chart.
          </p>
          <div className={styles.previewCard}>
            <span className={styles.previewEyebrow}>A gift, made for you</span>
            <p className={styles.previewName}>Ava, here&rsquo;s your chart</p>
            <span className={styles.previewGlyph} aria-hidden="true">
              <svg viewBox="0 0 46 46"><use href="#ma-18" /></svg>
            </span>
            <p className={styles.previewBorn}>Born March 15, 1990 &middot; Bearing of The Moon</p>
            <div className={styles.previewSlots} aria-hidden="true">
              {[0, 7, 11, 17, 19, 21].map((i) => (
                <span className={styles.previewSlot} key={i}>
                  <svg viewBox="0 0 46 46"><use href={`#ma-${i}`} /></svg>
                </span>
              ))}
            </div>
            <span className={styles.previewTag}>A quick look. Open the full example below.</span>
          </div>

          <details className={styles.example}>
            <summary className={styles.exampleCarrot}>
              See a full example <span className={styles.carrotArrow} aria-hidden="true">&darr;</span>
            </summary>
            <div className={styles.exampleBody}>
              <ChartDiagram chart={sample} unlocked columnLabel="Ava" they />
              <p className={chartStyles.gapNote}>
                {sampleSteps.charAt(0).toUpperCase() + sampleSteps.slice(1)} steps separate Ava from the world
                at every layer. That distance, {sample.bearing.name}, is Ava&rsquo;s Bearing.
              </p>
              <div className={chartStyles.readings}>
                <ReadCard
                  item={sampleBearing}
                  featured
                  linkText={`Read the full Bearing of ${sample.bearing.name} →`}
                />
                {sampleOthers.map((item) => (
                  <ReadCard key={item.key} item={item} />
                ))}
              </div>
              <p className={styles.exampleNote}>
                This is Ava&rsquo;s example. The one you send is built from their own birthday.
              </p>
            </div>
          </details>
        </section>

        {/* WHY IT'S A GOOD GIFT */}
        <section className={styles.why}>
          <div className={styles.whyItem}><Star size={18} /><p><b>It&rsquo;s personal.</b> No two birthdays make the same chart.</p></div>
          <div className={styles.whyItem}><Star size={18} /><p><b>It never runs out.</b> The link works forever, and the chart never changes.</p></div>
          <div className={styles.whyItem}><Star size={18} /><p><b>It&rsquo;s ready in seconds.</b> No shipping, no waiting, no wrapping.</p></div>
        </section>

        {/* THE FORM */}
        <section className={styles.makeSection} id="make">
          <h2 className={styles.sectionH}>Make their chart</h2>
          <form action={startGiftCheckout} className={styles.form}>
            <label className={styles.label} htmlFor="giftName">Who is it for?</label>
            <input
              id="giftName"
              name="name"
              className={styles.input}
              placeholder="Their first name"
              maxLength={40}
              required
            />
            <label className={styles.label} style={{ marginTop: 16 }}>Their birthday</label>
            <BirthdayFields name="birthday" required selectClassName={styles.input} />
            <button type="submit" className={styles.submit}>Make their chart &middot; $12 &rarr;</button>
            <p className={styles.formNote}>
              One payment of $12. They never pay anything. No account needed, for you or for them.
            </p>
          </form>
        </section>

        {/* PLAIN FAQ */}
        <section className={styles.faq}>
          <h2 className={styles.sectionH}>Common questions</h2>
          <div className={styles.faqItem}>
            <h3>Do they need an account?</h3>
            <p>No. They just open the link and see their chart.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>How do they get it?</h3>
            <p>You send them the link. We don&rsquo;t message them, so you can give it however you like, whenever you like.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Does the link expire?</h3>
            <p>No. It works forever, and the chart never changes.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>What if I don&rsquo;t know their birth time?</h3>
            <p>You don&rsquo;t need it. Just the day they were born.</p>
          </div>
          <div className={styles.faqItem}>
            <h3>Can I see it before I send it?</h3>
            <p>Yes. Right after you pay, you&rsquo;ll see exactly what they&rsquo;ll open, with a link to send.</p>
          </div>
        </section>

        <p className={styles.footLinks}>
          Want one for yourself first? <Link href="/tarot-birth-chart">See your own tarot birth chart</Link>.
        </p>
      </main>
      <Footer />
    </>
  );
}
