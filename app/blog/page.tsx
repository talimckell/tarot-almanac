import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { BLOG_POSTS } from "../../lib/blog";
import { ELEMENT_BY_MAJOR } from "../../lib/almanac";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "The Blog: How Tarot Numerology Works | The Tarot Almanac",
  description:
    "Plain-language pieces on tarot numerology: how a date becomes a card, what a Bearing is, how to read your tarot natal chart. The method, shown openly.",
  alternates: {
    canonical: "https://tarotalmanac.com/blog",
  },
};

// Decorative glyph strip at the top of the hero — not tied to specific posts.
const HEADER_GLYPHS = [0, 2, 10, 17, 18, 19, 21];

export default function BlogIndexPage() {
  return (
    <>
      <SiteNav />

      <div className={styles.wrap}>
        <div className={styles.crumb}>
          <Link href="/how-it-works">How it works</Link> &nbsp;/&nbsp; The Blog
        </div>

        <div className={styles.hero}>
          <div className={styles.glyphRow}>
            {HEADER_GLYPHS.map((i) => (
              <span key={i} style={{ color: `var(--${ELEMENT_BY_MAJOR[i]})` }}>
                <svg aria-hidden="true"><use href={`#ma-${i}`} /></svg>
              </span>
            ))}
          </div>
          <span className={styles.eyebrow}>The Blog</span>
          <h1>How the Almanac works, in plain language</h1>
          <p className={styles.deck}>
            The method behind tarot numerology, shown openly. How a date
            becomes a card, what your Bearing is, how to read your whole
            chart. You can check every bit of it yourself.
          </p>
        </div>

        {BLOG_POSTS.map((post) => (
          <Link className={styles.entry} href={`/blog/${post.slug}`} key={post.slug}>
            <span
              className={styles.entryGlyph}
              style={{ color: `var(--${ELEMENT_BY_MAJOR[post.majorIndex]})` }}
            >
              <svg aria-hidden="true"><use href={`#ma-${post.majorIndex}`} /></svg>
            </span>
            <span className={styles.entryBody}>
              <h2 className={styles.entryTitle}>{post.title}</h2>
              <p className={styles.entrySf}>{post.indexTeaser}</p>
            </span>
          </Link>
        ))}

        <div className={styles.capture}>
          <h3>New pieces, now and then</h3>
          <p>
            No schedule, no noise. Just a note when there&rsquo;s a new piece
            on how the Almanac works, or something worth reading.
          </p>
          <div className={styles.captureForm}>
            <input
              className={styles.captureInput}
              type="email"
              placeholder="your email"
              aria-label="Your email address"
            />
            <button className={styles.captureBtn} type="button">Keep me posted</button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
