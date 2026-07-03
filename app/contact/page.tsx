import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import styles from "./page.module.css";

const SITE = "https://tarotalmanac.com";

export const metadata: Metadata = {
  title: "Contact | The Tarot Almanac",
  description: "Get in touch with The Tarot Almanac: support, privacy, legal, and security contacts.",
  alternates: { canonical: `${SITE}/contact` },
};

const CHANNELS = [
  {
    label: "General questions",
    detail: "Something in your reading looks off, a payment question, or anything else about using the Almanac.",
    email: "support@tarotalmanac.com",
  },
  {
    label: "Privacy",
    detail: "Requests about your data, an account deletion, or questions about the Privacy Policy.",
    email: "privacy@tarotalmanac.com",
  },
  {
    label: "Legal",
    detail: "Questions about the Terms of Service.",
    email: "legal@tarotalmanac.com",
  },
  {
    label: "Security",
    detail: "Found a vulnerability? Report it here before disclosing it publicly.",
    email: "security@tarotalmanac.com",
  },
];

export default function ContactPage() {
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
          <span className={styles.postEyebrow}>Contact</span>
          <h1>Get in touch</h1>
          <p className={styles.postStandfirst}>
            The Tarot Almanac is a one-person operation. Every message reaches Tali directly.
          </p>
        </header>

        <div className={styles.channels}>
          {CHANNELS.map((c) => (
            <div className={styles.channel} key={c.email}>
              <div className={styles.channelText}>
                <div className={styles.channelLabel}>{c.label}</div>
                <div className={styles.channelDetail}>{c.detail}</div>
              </div>
              <a className={styles.channelEmail} href={`mailto:${c.email}`}>
                {c.email}
              </a>
            </div>
          ))}
        </div>

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
