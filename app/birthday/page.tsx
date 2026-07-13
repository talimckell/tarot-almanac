// app/birthday/page.tsx — the birthday index (hub for all 366 /birthday/[slug]
// pages). Its job is internal linking: one indexable page that links every
// birthday, so each is a single click from a crawlable hub instead of an
// orphan reachable only through the sitemap. Structural/navigational copy only;
// the interpretive content lives in each Bearing essay.
import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { MAJORS, bearingIndex } from "../../lib/almanac";
import { SITE_URL } from "../../lib/site";
import { MONTH_NAMES, allBirthdays, birthdaySlug, formatBirthdayLabel } from "../../lib/birthday";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Tarot Card by Birthday: Every Date's Bearing | The Tarot Almanac",
  description:
    "Every birthday carries one lifelong tarot card, its Bearing, set by the month and day alone. Pick any date and see the card it steers by.",
  alternates: { canonical: `${SITE_URL}/birthday` },
  openGraph: {
    title: "Tarot Card by Birthday: Every Date's Bearing",
    description:
      "Every birthday carries one lifelong tarot card, its Bearing, set by the month and day alone.",
    url: `${SITE_URL}/birthday`,
    type: "website",
  },
};

export default function BirthdayIndexPage() {
  const all = allBirthdays();
  const months = MONTH_NAMES.map((name, i) => ({
    name,
    days: all.filter((x) => x.m === i + 1),
  }));

  return (
    <>
      <SiteNav current="bearing" />
      <main className="wrap">
        <nav className="crumb">
          <Link href="/">Home</Link> · <Link href="/bearing">Bearing</Link> · Birthdays
        </nav>

        <header className="cardhead">
          <span className="num">By Birthday</span>
          <h1>Every Birthday&rsquo;s Tarot Card</h1>
          <p className="position">the lifelong Bearing for all 366 dates</p>
        </header>

        <section className="section">
          <p>
            Every date on the calendar carries one Tarot Bearing, the single card you steer by for
            life. It&rsquo;s set by tarot numerology from your birth month and day alone, so the year
            never changes it. Find your date below, or start with{" "}
            <Link href="/bearing">what a Bearing is</Link>.
          </p>
        </section>

        {months.map(({ name, days }) => (
          <section className={styles.monthBlock} key={name}>
            <h2 className={styles.monthName}>{name}</h2>
            <ul className={styles.dayList}>
              {days.map(({ m, d }) => (
                <li key={`${m}-${d}`}>
                  <Link className={styles.dayLink} href={`/birthday/${birthdaySlug(m, d)}`}>
                    <span className={styles.dayNum}>{formatBirthdayLabel(m, d)}</span>
                    <span className={styles.dayCard}>{MAJORS[bearingIndex(m, d)]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
