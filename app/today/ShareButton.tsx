"use client";

import { useState } from "react";
import styles from "./TodayView.module.css";

export default function ShareButton({ text }: { text: string }) {
  const [label, setLabel] = useState("Share today");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text, url: location.href });
      } catch {
        // user cancelled the share sheet — no-op
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      setLabel("Copied");
    }
  };

  return (
    <button type="button" className={styles.btn} onClick={handleShare}>
      {label}
    </button>
  );
}
