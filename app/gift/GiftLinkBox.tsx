"use client";

import { useState } from "react";
import styles from "./gift.module.css";

// The copyable gift link on the success page. One big "Copy link" button; falls back to
// selecting the text if the clipboard API is blocked (some in-app browsers).
export default function GiftLinkBox({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked: select the field so they can copy by hand.
      const el = document.getElementById("gift-link-field") as HTMLInputElement | null;
      el?.focus();
      el?.select();
    }
  }

  return (
    <div className={styles.linkRow}>
      <input
        id="gift-link-field"
        className={styles.linkField}
        value={url}
        readOnly
        onFocus={(e) => e.currentTarget.select()}
        aria-label="Your gift link"
      />
      <button type="button" className={styles.copyBtn} onClick={copy}>
        {copied ? "Copied ✓" : "Copy link"}
      </button>
    </div>
  );
}
