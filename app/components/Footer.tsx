import Link from "next/link";
import styles from "./Footer.module.css";

// The single shared site footer (per footer-SPEC.html), rendered on every public
// page. Replaces the old stripped one-liner footer used on inner pages and the
// homepage's own separate inline footer — those two had drifted apart; this is
// the only footer now.
export default function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.footerIn}>
        <div className={styles.footerTop}>
          <div className={styles.fbrand}>
            <span className={styles.fmark}>
              <svg viewBox="0 0 56 56" width="26" height="26" fill="currentColor" aria-hidden="true">
                <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
              </svg>
            </span>
            <div className={styles.fname}>THE TAROT ALMANAC</div>
            <div className={styles.ftag}>Find your angle on the day.</div>
          </div>

          <div className={styles.fcol}>
            <div className={styles.fcolH}>The Almanac</div>
            <Link href="/today">Today</Link>
            <Link href="/bearing">Your Bearing</Link>
            <Link href="/chart">Your Chart</Link>
            <Link href="/me">My Almanac</Link>
          </div>

          <div className={styles.fcol}>
            <div className={styles.fcolH}>The Cards</div>
            <Link href="/tarot">All 78 Cards</Link>
            <Link href="/how-it-works">How It Works</Link>
          </div>

          <div className={styles.fcol}>
            <div className={styles.fcolH}>Read</div>
            <Link href="/blog">The Blog</Link>
          </div>

          <div className={styles.fcol}>
            <div className={styles.fcolH}>The Almanac Co.</div>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span className={styles.fbottomLine}>
            <span className={styles.fstar}>
              <svg viewBox="0 0 56 56" width="13" height="13" fill="currentColor" aria-hidden="true">
                <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
              </svg>
            </span>
            The card doesn&rsquo;t change. You do.
          </span>
          <span className={styles.fcopy}>&copy; 2026 The Tarot Almanac &middot; tarotalmanac.com</span>
        </div>
      </div>
    </footer>
  );
}
