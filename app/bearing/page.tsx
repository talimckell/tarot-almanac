import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR, type Element } from "../../lib/almanac";
import BearingHero from "./BearingHero";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Your Tarot Bearing: The Lifelong Card Set By Your Birthday | The Tarot Almanac",
  description:
    "Your Bearing is the one tarot card you carry your whole life, set by your birthday. It's the angle you bring to the world. Find yours and read what it means.",
  alternates: {
    canonical: "https://tarotalmanac.com/bearing",
  },
};

const ELEMENT_CLASS: Record<Element, string> = {
  fire: styles.elFire,
  water: styles.elWater,
  air: styles.elAir,
  earth: styles.elEarth,
};

export default function BearingPage() {
  return (
    <>
      <SiteNav current="bearing" />

      <main>
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Your Bearing</span>
          <h1>The one card you carry your whole life</h1>
          <p className={styles.deck}>
            Your daily cards change, and so do your monthly ones. Your Bearing
            stays the same. It&rsquo;s the one card set by your birthday, and
            it&rsquo;s the angle you bring to the world.
          </p>
        </header>

        <BearingHero />

        {/* WHAT IS A BEARING */}
        <section className={styles.section}>
          <h2>What a Bearing is</h2>
          <p>
            Most of what the Almanac shows you moves. The collective card
            changes with the date, and so does your personal card. Your
            Bearing is the one card that doesn&rsquo;t. It&rsquo;s the Major
            Arcana card set by the day you were born, and it&rsquo;s yours for
            life.
          </p>
          <p>
            It&rsquo;s the angle you bring to whatever happens, how you tend to
            walk into a room. And it&rsquo;s built into every day in the
            Almanac. The gap between the collective card and your personal card
            is always the same, and that gap is your Bearing.
          </p>
          <p>
            Your Bearing works a lot like your sun sign. It&rsquo;s the one thing
            about yourself you can name in a word, and once you know it, you
            start to see it everywhere. Look up the Bearings of the people you
            love, and a lot of things start making sense.
          </p>
          <p>
            Your Bearing sits at the center of your{" "}
            <Link className={styles.inline} href="/tarot-birth-chart">tarot birth chart</Link>, the
            seven cards set by your birthday.
          </p>
          <p>
            It&rsquo;s where each year starts from, too. Your{" "}
            <Link className={styles.inline} href="/personal-year-card">personal year card</Link>{" "}
            is your Bearing carried forward by the year&rsquo;s own number.
          </p>
          <p className={styles.mathnote}>
            It&rsquo;s your birth month plus your birth day, wrapped around the
            wheel of 22. That sum never changes, so neither does your
            Bearing.{" "}
            <Link className={styles.inline} href="/how-it-works">
              See how the math works.
            </Link>
          </p>
        </section>

        {/* THE 22 */}
        <section className={styles.gridwrap}>
          <h2>The twenty-two Bearings</h2>
          <p className={styles.gsub}>
            Every Bearing is one of the Major Arcana. Find yours above, or
            read any of them here.
          </p>
          <div className={styles.bgrid}>
            {MAJORS.map((name, i) => (
              <Link
                key={name}
                className={`${styles.bcard} ${ELEMENT_CLASS[ELEMENT_BY_MAJOR[i]]}`}
                href={`/bearing/${MAJOR_SLUGS[i]}`}
              >
                <span className={styles.bglyph}>
                  <svg aria-hidden="true">
                    <use href={`#ma-${i}`} />
                  </svg>
                </span>
                <span className={styles.bnum}>{i}</span>
                <span className={styles.bname}>{name}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* READER QUOTE — real proof right before the chart CTA below. */}
        <div className="trust-solo" style={{ margin: "48px auto" }}>
          <div className="trust-card">
            <span className="trust-card-label">On the Bearing</span>
            <p className="trust-quote">
              &ldquo;Finding my Bearing gave me a much better entry point into tarot.
              Instead of some label I had to live up to, it was more like the
              perspective I view the world from. It resonated immediately.&rdquo;
            </p>
            <span className="trust-name">Mara</span>
          </div>
        </div>

        {/* CHART CTA */}
        <aside className={styles.cta}>
          <span className={styles.ctaEyebrow}>Your Bearing is one position of seven</span>
          <p>
            Your Bearing is one card. Your birth chart is the whole picture:
            three cards for you, three for the world you were born into, and
            your Bearing in the middle. It&rsquo;s the reason you&rsquo;re the
            way you are, laid out on one page.
          </p>
          <Link className={styles.btn} href="/chart">See your full chart</Link>
          <p className={styles.ctaFine}>
            $12 once, or included with a subscription. You can preview it for
            free first.
          </p>
        </aside>
      </div>
      </main>

      <Footer />
    </>
  );
}
