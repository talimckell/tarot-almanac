import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How It Works: The Math Behind The Tarot Almanac | The Tarot Almanac",
  description:
    "Every card in The Tarot Almanac comes from your birthday and the date, through tarot numerology. Here's exactly how a date becomes a card, so you can work it out yourself.",
  alternates: {
    canonical: "https://tarotalmanac.com/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <SiteNav current="how-it-works" />

      <main>
      <div className={styles.wrap}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>How it works</span>
          <h1>How a date becomes your cards</h1>
          <p className={styles.deck}>
            Every card in the Almanac comes from a date, worked out the same way
            every time. It&rsquo;s called tarot numerology, and this page walks
            through the whole method in plain language. We&rsquo;ll start with
            what it gives you, then get into the math.
          </p>
        </header>

        {/* PLAIN-LANGUAGE ORIENTATION — what you get, before any math */}
        <section className={styles.section}>
          <h2>What the Almanac gives you</h2>
          <p>
            Every day, the Almanac gives you two cards. One is the collective card,
            the one we all share that day. The other is your personal card, set by
            your birthday. Side by side, they show you the weather of the day and your
            angle on it.
          </p>
          <p>
            Each day card has a Major Arcana card behind it, and behind that are the
            month and the year you&rsquo;re in, each with its own card. Then
            there&rsquo;s your Bearing, set the day you were born. It&rsquo;s the one
            card that stays with you for life.
          </p>
          <p>
            Everything below shows how we get there. If you like, you can work a date
            out by hand and land on the same cards.
          </p>
        </section>

        {/* THE CORE IDEA */}
        <section className={styles.section}>
          <h2>Why every card can come up</h2>
          <p>
            Traditional numerology adds up the digits of a date until
            it&rsquo;s down to a single small number. Try that with the
            twenty-two Major Arcana and two things go wrong. First, you can
            only ever reach about half the deck. Almost the whole back half,
            the Tower, the Star, the Moon, never comes up. Second, it treats
            the cards like a list of meanings to look up. The Majors are the
            Fool&rsquo;s Journey, an arc from the Fool at the start to the
            World at the end, and the order matters.
          </p>
          <p>
            So we use a map that was already in the deck. The twenty-two
            Majors form a circle, the <b>Tarot Cycle</b>, with the Fool at 0
            running around to the World at 21, then around again. Think of a
            clock. It doesn&rsquo;t stop when it passes twelve. You keep a
            running total, and whenever it reaches 22 or more, you subtract
            22 and keep going. (For the math-minded, that&rsquo;s dividing by
            22 and keeping the remainder.) That one move keeps every card in
            play and the whole sequence in order.
          </p>
          <figure className={styles.cycleFig}>
            <Image
              src="/tarot-cycle.svg"
              alt="The Tarot Cycle: the 22 Major Arcana arranged in a wheel from the Fool at 0 to the World at 21, with the World folding back to the Fool."
              width={820}
              height={660}
              className={styles.cycleSvg}
            />
            <figcaption className={styles.cycleCap}>
              Every date lands you somewhere on this wheel. Pass the World,
              and you come around to the Fool again.
            </figcaption>
          </figure>
        </section>

        {/* WORKED EXAMPLE: the proof */}
        <section className={styles.section}>
          <h2>Watch one all the way through</h2>
          <p>
            Take February 16, a birthday. Here&rsquo;s how to find its
            Bearing, the card you carry for life. You can do it on the back of
            an envelope.
          </p>

          <div className={styles.worked}>
            <span className={styles.wlabel}>February 16 → your Bearing</span>
            <div className={styles.step}>
              <span className={styles.calc}>2 + 16 = 18</span>
              <span className={styles.says}>birth month plus birth day</span>
            </div>
            <div className={styles.step}>
              <span className={styles.calc}>18 is less than 22</span>
              <span className={styles.says}>
                it hasn&rsquo;t gone all the way around the wheel, so it
                stays as it is.
              </span>
            </div>
            <div className={styles.result}>
              Card 18 is <b style={{ color: "var(--water)" }}>The Moon</b>.
            </div>
          </div>

          <p>
            Most totals don&rsquo;t land so neatly, and that&rsquo;s where
            the wheel comes in. Take another birthday, November 19.
          </p>

          <div className={styles.worked}>
            <span className={styles.wlabel}>November 19 → your Bearing</span>
            <div className={styles.step}>
              <span className={styles.calc}>11 + 19 = 30</span>
              <span className={styles.says}>birth month plus birth day</span>
            </div>
            <div className={styles.step}>
              <span className={styles.calc}>30 − 22 = 8</span>
              <span className={styles.says}>
                past the end of the deck, so subtract 22 and keep going
              </span>
            </div>
            <div className={styles.result}>
              Card 8 is <b style={{ color: "var(--fire)" }}>Strength</b>.
            </div>
          </div>

          <p>
            You go past the World, around through the Fool, and land at card
            8. It works like a clock, where 14:00 comes back around to 2.
          </p>

          <p className={styles.asideNote}>
            One note on numbering: the Almanac places Strength at 8 and
            Justice at 11, the Golden Dawn ordering most modern decks follow.
            Older Marseille decks swap the two. If you&rsquo;re checking
            against a deck where Justice sits at 8, that&rsquo;s why.
          </p>
        </section>

        {/* TWO READINGS */}
        <section className={styles.section}>
          <h2>Two readings from one calculation</h2>
          <p>
            The Almanac gives you two readings side by side, worked out the
            same way. The <b>collective</b> reading is the one we all share on
            a given day, made from the date alone. The <b>personal</b> reading
            is yours, made from your birthday added into that same date. Both
            have three layers, a year, a month, and a day, and each one feeds
            the next.
          </p>
          <h3>The year and month are Majors</h3>
          <p>
            The first two layers place you on the wheel of twenty-two. The
            collective year is the digits of the year added up, then wrapped.
            The collective month adds the month&rsquo;s number to that. The
            personal versions work the same way, with your birth month and day
            added in at the first step. Your birth year doesn&rsquo;t come
            into it, because the reading is about where you are in the cycle
            right now. Your personal year card is that first layer on its own,
            and you can{" "}
            <Link href="/personal-year-card" style={{ color: "var(--indigo)" }}>
              look yours up for any year
            </Link>
            .
          </p>
          <h3>The day is a Minor, tied to its Major</h3>
          <p>
            The Major gives a day its shape, the archetype it belongs to. A
            day has a texture too, and that&rsquo;s what the fifty-six Minor
            Arcana are for. So the day card is a Minor, chosen so it always
            belongs to the day&rsquo;s Major. The suit comes from the
            Major&rsquo;s element: Fire to Wands, Water to Cups, Air to
            Swords, Earth to Pentacles. The rank comes from the date itself.
            That way, the texture of your day always matches its shape.
          </p>
        </section>

        {/* THE FULL FORMULA CARD */}
        <section className={styles.section}>
          <h2>The whole thing on one card</h2>
          <p>
            Here&rsquo;s every formula in one place, for anyone who wants to
            work out a reading exactly. <i>Wrap</i> means subtract 22 whenever
            the total reaches 22 or more, the same as dividing by 22 and
            keeping the remainder.
          </p>

          <div className={styles.formula}>
            <span className={styles.flabel}>The collective reading</span>
            <div className={styles.frow}>
              Collective Year <span className={styles.dim}>=</span> (digit-sum of the year), wrapped<br />
              Collective Month <span className={styles.dim}>=</span> (Collective Year + month), wrapped<br />
              Collective Day <span className={styles.dim}>=</span> (Collective Month + day), wrapped <span className={styles.dim}>→ Major</span>
            </div>
            <span className={styles.flabel} style={{ marginTop: "22px" }}>The personal reading</span>
            <div className={styles.frow}>
              Personal Year <span className={styles.dim}>=</span> (birth month + birth day + digit-sum of year), wrapped<br />
              Personal Month <span className={styles.dim}>=</span> (Personal Year + month), wrapped<br />
              Personal Day <span className={styles.dim}>=</span> (Personal Month + day), wrapped <span className={styles.dim}>→ Major</span>
            </div>
            <span className={styles.flabel} style={{ marginTop: "22px" }}>The day&rsquo;s Minor, from its Major</span>
            <div className={styles.frow}>
              Suit <span className={styles.dim}>=</span> element of the day&rsquo;s Major<br />
              <span className={styles.dim}>&nbsp;&nbsp;&nbsp;&nbsp;</span>(Fire→Wands, Water→Cups, Air→Swords, Earth→Pentacles)<br />
              Rank <span className={styles.dim}>=</span> (date number × 11) ÷ 14, remainder, + 1
            </div>
            <p className={styles.fnote}>
              The Almanac runs exactly this, so if you work it out by hand,
              you&rsquo;ll land on the same cards.
            </p>
          </div>
        </section>

        {/* WHY PUBLISH */}
        <section className={styles.section}>
          <h2>Why we show you the math</h2>
          <p className={styles.lede}>
            We publish the whole method because we want you to be able to use
            it yourself.
          </p>
          <p>
            When the math is open, you can check any card yourself, and you
            can see how the whole system fits together. Tarot has always grown
            this way, one person at a time noticing a structure already in the
            cards and naming it. The Golden Dawn found the order and the
            elements. Waite and Smith fixed the images in 1909. The timing was
            the next layer waiting to be noticed.
          </p>
        </section>

        {/* LEARN MORE: down to the blog */}
        <section className={styles.learn}>
          <h2>Go deeper</h2>
          <p className={styles.learnSub}>The full method, written out at length.</p>
          <Link className={styles.post} href="/blog/what-is-tarot-numerology">
            <div className={styles.postTitle}>What Is Tarot Numerology?</div>
            <div className={styles.postDesc}>
              Why reduction loses half the deck, and how the wheel brings it
              back. <span className={styles.arrow}>→</span>
            </div>
          </Link>
          <Link className={styles.post} href="/blog/how-tarot-numerology-works">
            <div className={styles.postTitle}>How Tarot Numerology Works: The Complete Formula</div>
            <div className={styles.postDesc}>
              Every layer, every number, and the reason each one is there.{" "}
              <span className={styles.arrow}>→</span>
            </div>
          </Link>
          <Link className={styles.post} href="/vs/raka">
            <div className={styles.postTitle}>The Tarot Almanac vs. Raka</div>
            <div className={styles.postDesc}>
              How this fixed formula compares to an AI-generated reading.{" "}
              <span className={styles.arrow}>→</span>
            </div>
          </Link>
          <Link className={styles.post} href="/vs/labyrinthos">
            <div className={styles.postTitle}>The Tarot Almanac vs. Labyrinthos</div>
            <div className={styles.postDesc}>
              A fixed reading versus lessons plus an AI reading feature.{" "}
              <span className={styles.arrow}>→</span>
            </div>
          </Link>
        </section>

        {/* CTA */}
        <aside className={styles.cta}>
          <p>See where today places you on the wheel.</p>
          <Link className={styles.btn} href="/">Find your cards</Link>
        </aside>
      </div>
      </main>

      <Footer />
    </>
  );
}
