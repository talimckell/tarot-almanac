import type { Metadata } from "next";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { renderMarkdown } from "@/lib/markdown";
import styles from "./page.module.css";

const SITE = "https://tarotalmanac.com";

export const metadata: Metadata = {
  title: "Privacy Policy | The Tarot Almanac",
  description: "What The Tarot Almanac collects, how it's used, who it's shared with, and your rights over your data.",
  alternates: { canonical: `${SITE}/privacy` },
};

async function getBody() {
  const source = await readFile(join(process.cwd(), "content", "privacy-policy.md"), "utf-8");
  const effectiveDate = source.match(/Effective date:\s*(.+)/)?.[1]?.trim() ?? "";
  const body = source
    .replace(/^#\s+.*\n+/, "")
    .replace(/^\*\*The Tarot Almanac\*\*\n[^\n]*\n[^\n]*\n+/, "");
  return { html: await renderMarkdown(body), effectiveDate };
}

export default async function PrivacyPage() {
  const { html, effectiveDate } = await getBody();

  return (
    <>
      <SiteNav />

      <article className={styles.article}>
        <div className={styles.crumb}>
          <Link href="/">Home</Link>
        </div>

        <header className={styles.postHead}>
          <svg className={styles.postMark} viewBox="0 0 56 56" width="34" height="34" aria-hidden="true">
            <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" fill="var(--indigo)" />
          </svg>
          <span className={styles.postEyebrow}>Legal</span>
          <h1>Privacy Policy</h1>
          {effectiveDate && <p className={styles.postStandfirst}>Effective date: {effectiveDate}</p>}
        </header>

        <div className={styles.body} dangerouslySetInnerHTML={{ __html: html }} />

        <div className={styles.endmark}>
          <svg viewBox="0 0 56 56" fill="currentColor" width="13" height="13" aria-hidden="true">
            <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" />
          </svg>
        </div>
      </article>

      <Footer />
    </>
  );
}
