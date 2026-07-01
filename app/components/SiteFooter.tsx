import styles from "./SiteFooter.module.css";

// The footer shared by inner content pages. The homepage uses its own wider footer.
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <span className={styles.footLine}>
        <svg className={styles.star} viewBox="0 0 56 56" fill="var(--warm-stone)">
          <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
        </svg>
        The card doesn&rsquo;t change. You do.
      </span>
    </footer>
  );
}
