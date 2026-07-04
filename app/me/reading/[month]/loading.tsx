import SiteNav from "../../../components/SiteNav";
import Footer from "../../../components/Footer";
import styles from "./loading.module.css";

// Next's file-convention loading UI: shown automatically while page.tsx's async
// component (the DB lookup, and on a month's very first visit, the AI call) is still
// resolving. Only the first-ever request for a given person's month pays that wait —
// every later visit serves the stored copy and never shows this at all.
export default function MonthlyReadingLoading() {
  return (
    <>
      <SiteNav current="me" />
      <div className={styles.wrap}>
        <span className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 56 56" width="34" height="34" fill="currentColor">
            <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
          </svg>
        </span>
        <p className={styles.text}>Pulling this month&rsquo;s dates and meanings.</p>
        <p className={styles.sub}>The first look at a new month takes a moment. After this, it&rsquo;s instant.</p>
      </div>
      <Footer />
    </>
  );
}
