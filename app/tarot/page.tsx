import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import { MAJORS, MAJOR_SLUGS, RANKS, ELEMENT_BY_MAJOR, SUIT_BY_ELEMENT, type Element } from "../../lib/almanac";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Cards: All 78 Tarot Card Meanings | The Tarot Almanac",
  description:
    "Every card in the tarot, all 78: the 22 Major Arcana and the four suits. Browse the full deck and read each card's meaning, upright and reversed.",
  alternates: {
    canonical: "https://tarotalmanac.com/tarot",
  },
};

const ELEMENT_CLASS: Record<Element, string> = {
  fire: styles.elFire,
  water: styles.elWater,
  air: styles.elAir,
  earth: styles.elEarth,
};

const SUIT_ELEMENT_CLASS: Record<Element, string> = {
  fire: styles.suitFire,
  water: styles.suitWater,
  air: styles.suitAir,
  earth: styles.suitEarth,
};

// The suits, in the order the deck is presented: Wands, Cups, Swords, Pentacles.
const SUIT_ORDER: Element[] = ["fire", "water", "air", "earth"];

function Glyph({ symbolId, small }: { symbolId: string; small?: boolean }) {
  return (
    <span className={small ? `${styles.cglyph} ${styles.small}` : styles.cglyph}>
      <svg aria-hidden="true">
        <use href={`#${symbolId}`} />
      </svg>
    </span>
  );
}

export default function TarotIndexPage() {
  return (
    <>
      <SiteNav current="tarot" />

      <div className={styles.wrap}>
        <header className={styles.hero}>
          <span className={styles.eyebrow}>The Cards</span>
          <h1>All seventy-eight</h1>
          <p className={styles.deck}>
            The whole tarot: twenty-two Major Arcana that hold the shape of
            things, and four suits of fourteen that carry the texture. Every
            card, with its meaning upright and reversed.
          </p>
        </header>

        {/* MAJORS */}
        <div className={styles.secthead}>
          <h2>The Major Arcana</h2>
          <p className={styles.sub}>Twenty-two cards, the Fool&rsquo;s Journey from 0 to 21.</p>
        </div>
        <div className={styles.cgrid}>
          {MAJORS.map((name, i) => (
            <Link
              key={name}
              className={`${styles.ccard} ${ELEMENT_CLASS[ELEMENT_BY_MAJOR[i]]}`}
              href={`/tarot/${MAJOR_SLUGS[i]}`}
            >
              <Glyph symbolId={`ma-${i}`} />
              <span className={styles.cnum}>{i}</span>
              <span className={styles.cname}>{name}</span>
            </Link>
          ))}
        </div>

        {/* MINORS */}
        <div className={styles.secthead}>
          <h2>The Minor Arcana</h2>
          <p className={styles.sub}>Fifty-six cards across four suits, each tied to an element.</p>
        </div>
        {SUIT_ORDER.map((element) => {
          const suit = SUIT_BY_ELEMENT[element];
          const suitSlug = suit.toLowerCase();
          const elementLabel = element.charAt(0).toUpperCase() + element.slice(1);
          return (
            <section className={styles.suitsec} key={suit}>
              <div className={`${styles.suithead} ${SUIT_ELEMENT_CLASS[element]}`}>
                <span className={styles.suitmark}>
                  <svg aria-hidden="true">
                    <use href={`#suit-${suitSlug}`} />
                  </svg>
                </span>
                <h2>{suit}</h2>
                <span className={styles.suitel}>{elementLabel}</span>
              </div>
              <div className={`${styles.cgrid} ${styles.minors}`}>
                {RANKS.map((rank) => (
                  <Link
                    key={rank}
                    className={`${styles.ccard} ${ELEMENT_CLASS[element]}`}
                    href={`/tarot/${rank.toLowerCase()}-of-${suitSlug}`}
                  >
                    <Glyph symbolId={`suit-${suitSlug}`} small />
                    <span className={styles.cname}>{rank}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <SiteFooter />
    </>
  );
}
