import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "How It Works: The Math Behind The Tarot Almanac | The Tarot Almanac",
  description:
    "Every card in The Tarot Almanac comes from arithmetic you can check yourself. No shuffle, no randomness. Here is exactly how a date becomes a card.",
  alternates: {
    canonical: "https://tarotalmanac.com/how-it-works",
  },
};

export default function HowItWorksPage() {
  return (
    <>
      <SiteNav current="how-it-works" />

      <div className={styles.wrap}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>How it works</span>
          <h1>Making tarot numerology actually work</h1>
          <p className={styles.deck}>
            Most tarot numerology has two flaws: it reduces too far, and it
            ignores the Tarot Cycle. Reduction loses half the deck. Ignoring
            the cycle flattens the order the cards were built in. The Almanac
            fixes both.
          </p>
        </header>

        {/* THE CORE IDEA */}
        <section className={styles.section}>
          <h2>The two flaws, and the fix</h2>
          <p>
            Traditional numerology reduces a date down to a single small
            number, adding digits until almost nothing is left. Run that
            against the twenty-two Major Arcana and two things break. First,
            reduction collapses everything toward a handful of survivors, so
            you can only ever reach about half the deck. Almost the entire
            back half, the Tower, the Star, the Moon, becomes a card the math
            can never land on. Second, reduction treats the cards as a list
            of meanings to look up, when the Majors were never a list.
            They&rsquo;re the Fool&rsquo;s Journey, an arc running from the
            Fool at the start to the World at the end, and the order carries
            meaning.
          </p>
          <p>
            The fix isn&rsquo;t more math. It&rsquo;s a better map, and it was
            already in the deck. The twenty-two Majors form a circle, the{" "}
            <b>Tarot Cycle</b>: the Fool at 0 running around to the World at
            21, then around again, the way a clock doesn&rsquo;t stop when it
            passes twelve. On a wheel, a date doesn&rsquo;t reduce to a card.
            It tells you where you&rsquo;re standing. You keep a running
            total, and whenever it reaches 22 or more, you subtract a full
            turn of 22, the same way a clock that passes twelve comes back
            around to one. (For the math-minded, that&rsquo;s dividing by 22
            and keeping the remainder.) That single move keeps every card
            reachable and the whole sequence intact.
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
            Take February 16, a birthday. Here&rsquo;s the Bearing, the
            lifelong card, worked from start to finish. You can do it on the
            back of an envelope and land where the app does.
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
                it hasn&rsquo;t reached a full turn, so there&rsquo;s nothing
                to wrap. The total stands.
              </span>
            </div>
            <div className={styles.result}>
              Card 18 is <b style={{ color: "var(--water)" }}>The Moon</b>.
            </div>
          </div>

          <p>
            Most totals don&rsquo;t land so neatly, and that&rsquo;s where
            the wheel earns its name. Take November 19.
          </p>

          <div className={styles.worked}>
            <span className={styles.wlabel}>November 19 → the day&rsquo;s Major</span>
            <div className={styles.step}>
              <span className={styles.calc}>11 + 19 = 30</span>
              <span className={styles.says}>month plus day</span>
            </div>
            <div className={styles.step}>
              <span className={styles.calc}>30 − 22 = 8</span>
              <span className={styles.says}>
                past the end of the deck, so wrap one full turn of
                twenty-two
              </span>
            </div>
            <div className={styles.result}>
              Card 8 is <b style={{ color: "var(--fire)" }}>Strength</b>.
            </div>
          </div>

          <p>
            You come around past the World and the Fool and land at card 8.
            The total walked off the top of the wheel and kept going from
            zero, the way 30 minutes past the hour puts you at the half.
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
            The Almanac gives you two parallel readings, built the same way.
            The <b>collective</b> reading is the same for everyone alive on a
            given day, made from the date alone. The <b>personal</b> reading
            is yours, made from your birthday folded into that same date.
            Both run through three layers, a year, a month, and a day, each
            feeding the next.
          </p>
          <h3>The year and month are Majors</h3>
          <p>
            The first two layers place you on the wheel of twenty-two. The
            collective year is the digit-sum of the year, wrapped. The month
            adds the month&rsquo;s number to that. The personal versions work
            identically, with your birth month and day joining at the first
            step. Your birth year never enters, because the reading is about
            where you stand in the cycle now, not how many turns you&rsquo;ve
            taken around it.
          </p>
          <h3>The day is a Minor, tied to its Major</h3>
          <p>
            The Major is the shape of a day, the archetype it belongs to. But
            a day has a texture as well as a shape, and texture is the work
            of the fifty-six Minor Arcana. So the day card is a Minor, drawn
            so its texture always belongs to the day&rsquo;s shape. The suit
            comes from the day&rsquo;s Major through its element, Fire to
            Wands, Water to Cups, Air to Swords, Earth to Pentacles. The
            specific rank comes from the date itself. The texture
            can&rsquo;t pull against the shape it came from.
          </p>
        </section>

        {/* THE FULL FORMULA CARD */}
        <section className={styles.section}>
          <h2>The whole thing on one card</h2>
          <p>
            Here is every formula in one place, for anyone who wants to
            recreate a reading exactly. <i>Wrap</i> means subtract a full
            turn of 22 whenever the total reaches 22 or more, the same as
            dividing by 22 and keeping the remainder.
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
              No randomness anywhere in it. The live Almanac runs exactly
              this and nothing more, which is why working it by hand lands on
              the same cards the app shows.
            </p>
          </div>
        </section>

        {/* WHY PUBLISH */}
        <section className={styles.section}>
          <h2>Why publish the method at all</h2>
          <p className={styles.lede}>
            Most divination keeps its method behind a curtain, because the
            mystery is the product. The Almanac runs the other way.
          </p>
          <p>
            The math being open is what makes it trustworthy. You don&rsquo;t
            have to believe anyone about where you are on the wheel or what
            the texture of your day is. You can check. Tarot has always
            grown this way, one practitioner at a time noticing a structure
            already latent in the cards and naming it, the Golden Dawn
            finding the order and the elements, Waite and Smith fixing the
            images in 1909. The timing was the layer waiting to be noticed,
            and a layer you can verify is a layer you can actually stand on.
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
        </section>

        {/* CTA */}
        <aside className={styles.cta}>
          <p>See where today places you on the wheel.</p>
          <Link className={styles.btn} href="/">Find your cards</Link>
        </aside>
      </div>

      <SiteFooter />
    </>
  );
}
