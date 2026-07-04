import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { getPostMeta } from "@/lib/blog";
import styles from "./page.module.css";

const SITE = "https://www.tarotalmanac.com";

export const metadata: Metadata = {
  title: "About | The Tarot Almanac",
  description:
    "Why The Tarot Almanac exists: a deterministic tarot system built from a family of black sheep, a stealthily smart mother, and a lifelong pull between structure and the unstructured.",
  alternates: { canonical: `${SITE}/about` },
};

export default function AboutPage() {
  const numerologyPost = getPostMeta("what-is-tarot-numerology");

  return (
    <>
      {/* This page's one non-standard asset: a cursive signature font, used nowhere
          else, so it's loaded here rather than via next/font in the root layout. */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Mrs+Saint+Delafield&display=swap" />
      <SiteNav />

      <article className={styles.article}>
        <div className={styles.crumb}>
          <Link href="/">Home</Link>
        </div>

        <header className={styles.postHead}>
          <svg className={styles.postMark} viewBox="0 0 56 56" width="34" height="34" aria-hidden="true">
            <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" fill="var(--indigo)" />
          </svg>
          <span className={styles.postEyebrow}>About</span>
          <h1>Why I&rsquo;m making this</h1>
          <p className={styles.postStandfirst}>On picking and choosing, and creating a balanced system.</p>
        </header>

        <div className={styles.body}>
          <p>
            Surprisingly, it&rsquo;s from the Mormon side of my family that my first Tarot cards were passed
            down, when I was 11. Growing up in Utah in the 80s, Mormons were the predominant culture. Yet my
            nuclear family was not Mormon, which meant from a young age I knew both that I was somewhat set
            apart from the collective, and could choose what to take or leave.
          </p>
          <p>
            My mother ran on a Puritan work ethic, and for a while we dabbled in a Missouri Synod Lutheran
            church that wanted absolutism. When I struggled with that absolutism, my mom told me to just pick
            and choose what I wanted. That was not what the bearded white pastor was telling me. It&rsquo;s
            what she was telling me, and she was always the stealthily smartest person I knew. The permission
            to take what serves you and leave the rest didn&rsquo;t come from rebellion. It came from my
            mother, quietly, while a man with a beard was telling me to swallow the whole thing.
          </p>
          <p>
            I spent my twenties ambitious for success. Successful at what, by whose measure, I never quite
            answered. I still have a day job, and on the good days I believe in its mission. That&rsquo;s
            real too. They&rsquo;re both mine.
          </p>
          <p>
            An astrologer once told me my sun and moon sit opposite each other in my chart, a permanent pull
            between structure and the unstructured by design. My daily life runs on logic, the masculine, the
            yang. Tarot has always been the pull back to yin. It was never just the party trick I sometimes
            pretended it was. It was the way into a real conversation, the way a new friend tells you their
            hopes or fears before they&rsquo;d normally say them out loud, the way every card turns out to
            have a silver lining if you sit with it.
          </p>
          <p>
            The Almanac is the place those two halves stopped taking turns. The math is mathing: systems
            thinking, deterministic, checkable. But it&rsquo;s also all of that meeting you and who you are
            today, your intuition, that first reaction you have to a card before you read its &ldquo;actual&rdquo;
            meaning.
          </p>
          <p>
            I don&rsquo;t know if I believe in fate. I do think we get a choice, every day, about what we do
            with what we&rsquo;re handed.
          </p>
        </div>

        <div className={styles.closing}>
          <p>The card doesn&rsquo;t change. I do.</p>
        </div>

        <div className={styles.signoff}>
          <p>With more curiosity than certainty,</p>
          <span className={styles.sigName}>Tali</span>
        </div>

        <div className={styles.endmark}>
          <svg viewBox="0 0 56 56" fill="currentColor" width="13" height="13" aria-hidden="true">
            <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
          </svg>
        </div>

        <div className={styles.keep}>
          <div className={styles.keepH}>Keep reading</div>
          <Link className={styles.keepPost} href="/how-it-works">
            <span className={styles.kt}>How It Works</span>
            <span className={styles.kd}>
              The plain-language math behind every card, with a worked example you can check yourself.
            </span>
          </Link>
          {numerologyPost && (
            <Link className={styles.keepPost} href={`/blog/${numerologyPost.slug}`}>
              <span className={styles.kt}>{numerologyPost.title}</span>
              <span className={styles.kd}>{numerologyPost.indexTeaser}</span>
            </Link>
          )}
        </div>
      </article>

      <Footer />
    </>
  );
}
