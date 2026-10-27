"use client";

import { useRef, useState } from "react";
import styles from "./ShareImageButton.module.css";

// Shares a generated share-card as an actual image file through the native share sheet
// (Web Share API level 2, navigator.share with `files`) — that's what pulls up "all the
// ways to share" with the picture attached, rather than just a URL. Attaches a link back
// to the live page where the platform honors a url alongside files. Falls back to a plain
// link share, then to copying the link, where file-sharing isn't supported (some desktop
// browsers). Shared by every share surface (today, bearing, chart, monthly); callers pass
// their own paths, copy, and button className.
//
// The share image is prefetched on hover/focus/pointer-down and cached, so the click
// handler can call navigator.share *synchronously*. Awaiting the fetch inside the click
// would consume the page's transient user activation, and Safari (plus other strict
// browsers) then reject navigator.share with NotAllowedError — which is why the button
// used to appear dead. If the image isn't cached yet when clicked, we share the link
// instead (its /share page carries the card as its OG image, so previews still show it).
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
  pagePath: string; // the /share landing page, used as the link-share fallback
  linkPath: string; // where the shared image should point back to (the live page)
  title: string;
  text: string;
  className?: string;
  label?: string;
}) {
  const [current, setCurrent] = useState(label);
  const fileRef = useRef<File | null>(null);
  const fetchingRef = useRef<Promise<File | null> | null>(null);
  const sharingRef = useRef(false);

  const flash = (msg: string) => {
    setCurrent(msg);
    setTimeout(() => setCurrent(label), 2000);
  };

  // Fetch the share image into a File once and cache it. Kicked off on pointer/focus
  // intent so the image is usually ready by the time the button is clicked.
  const prefetch = (): Promise<File | null> => {
    if (fileRef.current) return Promise.resolve(fileRef.current);
    if (fetchingRef.current) return fetchingRef.current;
    const p = (async () => {
      try {
        const res = await fetch(imagePath);
        if (!res.ok) return null;
        const blob = await res.blob();
        const file = new File([blob], "tarot-almanac.png", { type: blob.type || "image/png" });
        fileRef.current = file;
        return file;
      } catch {
        return null; // network hiccup — we'll share the link instead
      } finally {
        fetchingRef.current = null;
      }
    })();
    fetchingRef.current = p;
    return p;
  };

  const copyLink = async (url: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        flash("Link copied");
        return;
      }
    } catch {
      // Clipboard blocked (permission policy, no activation) — fall through to prompt.
    }
    // Last resort so the button is never a dead end: surface the link to copy by hand.
    window.prompt("Copy this link to share:", url);
  };

  // Share the link only. navigator.share is called synchronously (no prior await) to keep
  // the user activation valid; a rejection that isn't an explicit dismissal falls back to
  // copying the link.
  const shareLink = (url: string) => {
    if (navigator.share) {
      navigator.share({ title, text, url }).catch((err) => {
        if ((err as Error).name === "AbortError") return; // user dismissed the sheet
        void copyLink(url);
      });
      return;
    }
    void copyLink(url);
  };

  const handleShare = () => {
    if (sharingRef.current) return;
    const pageUrl = new URL(pagePath, location.origin).href;
    const linkUrl = new URL(linkPath, location.origin).href;
    const file = fileRef.current;

    // Best case: the image is cached and this browser can share files. canShare gates on
    // files only, since some browsers reject the whole payload if asked about a url they
    // won't use with files; targets that ignore the url still show the URL printed on the
    // card.
    if (file && navigator.canShare?.({ files: [file] })) {
      sharingRef.current = true;
      navigator
        .share({ files: [file], title, text, url: linkUrl })
        .catch((err) => {
          if ((err as Error).name === "AbortError") return; // user dismissed the sheet
          shareLink(pageUrl); // NotAllowedError / unsupported target — share the link
        })
        .finally(() => {
          sharingRef.current = false;
        });
      // Warm the cache for next time in case this click shared only the link.
      return;
    }

    // Image not ready yet (or no file-share support): share the link, and prefetch so a
    // repeat click can attach the image.
    void prefetch();
    shareLink(pageUrl);
  };

  return (
    <button
      type="button"
      className={className ?? styles.shareBtn}
      onClick={handleShare}
      onPointerEnter={() => void prefetch()}
      onPointerDown={() => void prefetch()}
      onFocus={() => void prefetch()}
    >
      {current}
    </button>
  );
}
