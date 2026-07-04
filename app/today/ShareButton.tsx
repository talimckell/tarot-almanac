"use client";

import { useState } from "react";
import styles from "./TodayView.module.css";

// Shares the generated card as an actual image file through the native share sheet
// (Web Share API level 2, navigator.share with `files`). That's what pulls up "all the
// ways to share" — Messages, Instagram, AirDrop — with the picture attached, rather than
// just a URL. Falls back to sharing/copying the link where file-sharing isn't supported
// (notably some desktop browsers).
export default function ShareButton({
  imagePath,
  pagePath,
  linkPath,
  title,
  text,
}: {
  imagePath: string; // same-origin path to the PNG, so it can be fetched without CORS
  pagePath: string; // the /share landing page, used as the no-file link-share fallback
  linkPath: string; // where the shared image should point back to (the live /today)
  title: string;
  text: string;
}) {
  const [label, setLabel] = useState("Share today");
  const [busy, setBusy] = useState(false);

  const shareLink = async (): Promise<boolean> => {
    const url = new URL(pagePath, location.origin).href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch (err) {
        if ((err as Error).name === "AbortError") return true; // user dismissed the sheet
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setLabel("Link copied");
      setTimeout(() => setLabel("Share today"), 2000);
      return true;
    }
    return false;
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
      // Fetch the PNG and try to share it as a file first.
      let file: File | null = null;
      try {
        const res = await fetch(imagePath);
        if (res.ok) {
          const blob = await res.blob();
          file = new File([blob], "tarot-almanac.png", { type: blob.type || "image/png" });
        }
      } catch {
        // network hiccup — fall through to the link share
      }

      // Attach the link back to /today alongside the image. Targets that honor a url with
      // files (Android, Messages) surface a tappable link; image-only targets ignore it,
      // which is why the card also prints the URL. canShare gates on files only — some
      // browsers reject the whole payload if asked about a url they won't use with files.
      const linkUrl = new URL(linkPath, location.origin).href;
      if (file && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title, text, url: linkUrl });
          return;
        } catch (err) {
          if ((err as Error).name === "AbortError") return; // user dismissed the sheet
          // NotAllowedError (activation expired) or unsupported target — fall back to link
        }
      }

      await shareLink();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" className={styles.btn} onClick={handleShare} disabled={busy}>
      {busy ? "Preparing…" : label}
    </button>
  );
}
