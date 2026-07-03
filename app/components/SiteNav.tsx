import Link from "next/link";
import styles from "./SiteNav.module.css";

export type SiteSection = "today" | "tarot" | "bearing" | "how-it-works" | "me";

const LINKS: { href: string; label: string; section: SiteSection }[] = [
  { href: "/today", label: "Today", section: "today" },
  { href: "/tarot", label: "Cards", section: "tarot" },
  { href: "/bearing", label: "Bearing", section: "bearing" },
  { href: "/how-it-works", label: "How it works", section: "how-it-works" },
  { href: "/me", label: "My Almanac", section: "me" },
];

// The nav shared by inner content pages (tarot, bearing, how-it-works, blog).
// The homepage uses its own wider marketing nav, not this one.
export default function SiteNav({ current }: { current?: SiteSection }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.navIn}>
        <Link href="/" className={styles.brand}>THE TAROT ALMANAC</Link>
        <div className={styles.links}>
          {LINKS.map((link) => (
            <Link
              key={link.section}
              href={link.href}
              className={link.section === current ? styles.current : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
