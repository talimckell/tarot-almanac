"use client";

import { useState } from "react";
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
//
// Below 560px the link row (.links) is hidden and a hamburger toggle takes
// its place, opening the same links stacked in a dropdown panel — otherwise
// the only way to reach My Almanac / sign-in on a phone is to scroll to the
// footer.
export default function SiteNav({ current, ctaLabel }: { current?: SiteSection; ctaLabel?: string }) {
  const [open, setOpen] = useState(false);

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
        <button
          type="button"
          className={styles.menuBtn}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            {open ? (
              <path d="M4 4 L18 18 M18 4 L4 18" />
            ) : (
              <path d="M2 6 H20 M2 11 H20 M2 16 H20" />
            )}
          </svg>
        </button>
      </div>
      {open && (
        <div className={styles.mobileMenu} id="mobile-menu">
          {LEADING_LINKS.map((link) => (
            <Link
              key={link.section}
              href={link.href}
              className={link.section === current ? styles.current : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/me" className={current === "me" ? styles.current : undefined} onClick={() => setOpen(false)}>
            My Almanac
          </Link>
        </div>
      )}
    </nav>
  );
}
