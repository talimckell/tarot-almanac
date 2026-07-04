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
    "Your Bearing is the one tarot card you carry your whole life, fixed by your birthday. Find yours, and read what it means to greet the world through it.",
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

      <div className={styles.wrap}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>Your Bearing</span>
          <h1>The one card you carry your whole life</h1>
          <p className={styles.deck}>
            The daily cards turn and the months change their weather. Your
            Bearing holds still: the fixed card set by your birthday, the way
            you greet the world before you&rsquo;ve decided anything about it.
          </p>
        </header>

        <BearingHero />

        {/* WHAT IS A BEARING */}
        <section className={styles.section}>
          <h2>What a Bearing is</h2>
          <p>
            Most of what the Almanac shows you moves. The collective card
            changes with the date; your personal card shifts day to day. Your
            Bearing is the one thing that doesn&rsquo;t. It&rsquo;s the single
            Major Arcana card fixed by the day you were born, and it stays
            the same for your whole life.
          </p>
          <p>
            Think of it less as something that happens to you and more as the
            angle you bring to whatever happens, the stance you carry into a
            room before a word is spoken. Underneath, it&rsquo;s a fixed
            distance: the gap between how the world reads a day and how you
            read it never changes, and that constant is your Bearing.
          </p>
          <p className={styles.mathnote}>
            It&rsquo;s set by your birth month plus your birth day, brought
            around the wheel of 22. That sum never changes, so neither does
            your Bearing.{" "}
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

        {/* CHART CTA */}
        <aside className={styles.cta}>
          <span className={styles.ctaEyebrow}>Your Bearing is one position of seven</span>
          <p>
            Your Bearing is the still point. Your full Tarot Natal Chart sets
            it among the other six positions, the collective and personal
            cards of your birth year, month, and day, and reads the whole
            shape together.
          </p>
          <Link className={styles.btn} href="/chart">See your full chart</Link>
        </aside>
      </div>

      <Footer />
    </>
  );
}
