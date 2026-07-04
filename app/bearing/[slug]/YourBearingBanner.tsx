"use client";

import { useEffect, useState } from "react";
import { bearingIndex } from "@/lib/almanac";
import ShareImageButton from "../../components/ShareImageButton";

interface ViewerBirthday {
  known: boolean;
  bm?: number;
  bd?: number;
  name?: string | null;
}

// Shown only when this static Bearing page happens to be the visitor's OWN Bearing —
// checked via a client-side fetch (app/api/viewer-birthday) so the 22 /bearing/[slug]
// pages stay statically generated rather than becoming per-request dynamic. Renders
// nothing while the check is in flight or when it doesn't match; the page's existing
// generic "Share this Bearing" button (in the aside) still covers every other visitor.
export default function YourBearingBanner({
  majorIndex,
  slug,
  cardName,
}: {
  majorIndex: number;
  slug: string;
  cardName: string;
}) {
  const [viewer, setViewer] = useState<ViewerBirthday | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/viewer-birthday")
      .then((r) => r.json())
      .then((data: ViewerBirthday) => {
        if (!cancelled) setViewer(data);
      })
      .catch(() => {
        if (!cancelled) setViewer({ known: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!viewer?.known || viewer.bm === undefined || viewer.bd === undefined) return null;
  if (bearingIndex(viewer.bm, viewer.bd) !== majorIndex) return null;

  const name = viewer.name ?? undefined;
  const query = name ? `?n=${encodeURIComponent(name)}` : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: 12,
        margin: "20px 0 8px",
        padding: "14px 20px",
        background: "var(--vellum)",
        border: "1px solid var(--warm-stone)",
        borderRadius: 4,
      }}
    >
      <span style={{ fontFamily: "var(--serif)", fontSize: "1.1rem", color: "var(--ink)" }}>
        {name ? `${name}, this` : "This"} is your Bearing.
      </span>
      <ShareImageButton
        imagePath={`/bearing/${slug}/share/image${query}`}
        pagePath={`/bearing/${slug}/share${query}`}
        linkPath="/bearing"
        title={`${name ? `${name}'s` : "My"} Bearing is ${cardName}`}
        text={`${name ? `${name}'s` : "My"} Bearing is ${cardName} · The Tarot Almanac`}
        label="Share my Bearing"
      />
    </div>
  );
}
