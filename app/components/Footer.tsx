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
            <a
              className={styles.fsocial}
              href="https://www.pinterest.com/tarotalmanac/"
              target="_blank"
              rel="me noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.378-.293 1.194-.333 1.361-.052.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.608 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
              </svg>
              Follow @tarotalmanac on Pinterest
            </a>
          </div>

          <div className={styles.fcol}>
            <div className={styles.fcolH}>The Almanac</div>
            <Link href="/today">Today</Link>
            <Link href="/bearing">Your Bearing</Link>
            <Link href="/tarot-birth-chart">Your Chart</Link>
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
