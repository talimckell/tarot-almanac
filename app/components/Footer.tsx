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
            <a
              className={styles.fsocial}
              href="https://bsky.app/profile/tarotalmanac.bsky.social"
              target="_blank"
              rel="me noopener noreferrer"
            >
              <svg viewBox="0 0 568 501" width="15" height="13" fill="currentColor" aria-hidden="true">
                <path d="M123.121 33.664C188.241 82.553 258.281 181.68 284 234.873c25.719-53.192 95.759-152.32 160.879-201.21C491.866-1.611 568-28.906 568 57.947c0 17.346-9.945 145.713-15.778 166.555-20.275 72.453-94.155 90.933-159.875 79.748C507.222 323.8 536.444 388.56 473.333 453.32c-119.86 122.992-172.272-30.859-185.702-70.281-2.462-7.227-3.614-10.608-3.631-7.733-.017-2.875-1.169.506-3.631 7.733-13.43 39.422-65.842 193.273-185.702 70.281-63.111-64.76-33.889-129.52 80.986-149.071-65.72 11.185-139.6-7.295-159.875-79.748C9.945 203.66 0 75.293 0 57.947 0-28.906 76.135-1.611 123.121 33.664Z" />
              </svg>
              Follow @tarotalmanac.bsky.social
            </a>
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
