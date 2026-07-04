"use client";

import { useState } from "react";
import styles from "./ShareImageButton.module.css";

// Shares a generated share-card as an actual image file through the native share sheet
// (Web Share API level 2, navigator.share with `files`) — that's what pulls up "all the
// ways to share" with the picture attached, rather than just a URL. Attaches a link back
// to the live page where the platform honors a url alongside files. Falls back to
// sharing/copying the link where file-sharing isn't supported (some desktop browsers).
// Shared by every share surface (today, bearing, chart, monthly); callers pass their own
// paths, copy, and button className.
export default function ShareImageButton({
  imagePath,
  pagePath,
  linkPath,
  title,
  text,
  className,
  label = "Share",
}: {
  imagePath: string; // same-origin path to the PNG, fetched without CORS
  pagePath: string; // the /share landing page, used as the no-file link-share fallback
  linkPath: string; // where the shared image should point back to (the live page)
  title: string;
  text: string;
  className?: string;
  label?: string;
}) {
  const [current, setCurrent] = useState(label);
  const [busy, setBusy] = useState(false);

  const shareLink = async (): Promise<void> => {
    const url = new URL(pagePath, location.origin).href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return; // user dismissed the sheet
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCurrent("Link copied");
      setTimeout(() => setCurrent(label), 2000);
    }
  };

  const handleShare = async () => {
    if (busy) return;
    setBusy(true);
    try {
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

      // Attach the link back alongside the image. canShare gates on files only, since
      // some browsers reject the whole payload if asked about a url they won't use with
      // files; targets that ignore the url still show the URL printed on the card.
      const url = new URL(linkPath, location.origin).href;
      if (file && navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title, text, url });
          return;
        } catch (err) {
          if ((err as Error).name === "AbortError") return; // user dismissed the sheet
          // NotAllowedError / unsupported target — fall back to the link
        }
      }

      await shareLink();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" className={className ?? styles.shareBtn} onClick={handleShare} disabled={busy}>
      {busy ? "Preparing…" : current}
    </button>
  );
}
