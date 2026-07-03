import Link from "next/link";
import styles from "./SiteNav.module.css";

export type SiteSection = "today" | "tarot" | "bearing" | "how-it-works" | "me";

const LEADING_LINKS: { href: string; label: string; section: SiteSection }[] = [
  { href: "/today", label: "Today", section: "today" },
  { href: "/tarot", label: "Cards", section: "tarot" },
  { href: "/bearing", label: "Bearing", section: "bearing" },
  { href: "/how-it-works", label: "How it works", section: "how-it-works" },
];

// The nav shared by every page, including the homepage. The trailing /me link
// is a plain text link ("My Almanac") everywhere except the homepage, which
// passes ctaLabel to render it as the bordered CTA button instead — the one
// deliberate visual difference; everything else (brand, link styles, layout)
// is the same nav so the header doesn't drift between pages again.
export default function SiteNav({ current, ctaLabel }: { current?: SiteSection; ctaLabel?: string }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navIn}>
        <Link href="/" className={styles.brand}>THE TAROT ALMANAC</Link>
        <div className={styles.links}>
          {LEADING_LINKS.map((link) => (
            <Link
              key={link.section}
              href={link.href}
              className={link.section === current ? styles.current : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/me" className={ctaLabel ? styles.cta : current === "me" ? styles.current : undefined}>
            {ctaLabel ?? "My Almanac"}
          </Link>
        </div>
      </div>
    </nav>
  );
}
