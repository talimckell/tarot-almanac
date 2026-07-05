"use client";

import { useState } from "react";
import { TREATMENT_NAMES } from "@/lib/campaignTreatments";

function todaySlug(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function addDaysToSlug(slug: string, delta: number): string {
  const [y, m, d] = slug.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + delta));
  return `${next.getUTCFullYear()}-${String(next.getUTCMonth() + 1).padStart(2, "0")}-${String(next.getUTCDate()).padStart(2, "0")}`;
}

export default function CollectiveStudio() {
  const [start, setStart] = useState(todaySlug());
  const [count, setCount] = useState(8);
  const [previewing, setPreviewing] = useState(false);

  const days = previewing
    ? Array.from({ length: count }, (_, i) => ({
        date: addDaysToSlug(start, i),
        treatment: i % TREATMENT_NAMES.length,
      }))
    : [];

  const zipHref = `/api/studio/collective-batch?start=${start}&count=${count}`;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--sans)", fontSize: 14, color: "var(--label)" }}>
          Start date
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ padding: "8px 10px", border: "1px solid var(--warm-stone)", borderRadius: 4, fontFamily: "var(--sans)" }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--sans)", fontSize: 14, color: "var(--label)" }}>
          Number of days
          <input
            type="number"
            min={1}
            max={60}
            value={count}
            onChange={(e) => setCount(Math.min(60, Math.max(1, Number(e.target.value) || 1)))}
            style={{ padding: "8px 10px", border: "1px solid var(--warm-stone)", borderRadius: 4, width: 90, fontFamily: "var(--sans)" }}
          />
        </label>
        <button
          type="button"
          onClick={() => setPreviewing(true)}
          style={{
            padding: "10px 22px",
            background: "transparent",
            border: "1px solid var(--indigo)",
            color: "var(--indigo)",
            borderRadius: 4,
            cursor: "pointer",
            fontFamily: "var(--sans)",
          }}
        >
          Generate previews
        </button>
        {previewing && (
          <a
            href={zipHref}
            style={{
              display: "inline-block",
              padding: "10px 22px",
              background: "var(--indigo)",
              color: "var(--stone)",
              borderRadius: 4,
              textDecoration: "none",
              fontFamily: "var(--sans)",
            }}
          >
            Download ZIP ({count} images + captions)
          </a>
        )}
      </div>

      {previewing && (
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {days.map(({ date, treatment }) => (
            <div key={`${date}-${treatment}`} style={{ border: "1px solid var(--warm-stone)", borderRadius: 4, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/studio/collective/preview?date=${date}&treatment=${treatment}`}
                alt={`${date} — ${TREATMENT_NAMES[treatment]}`}
                width={1200}
                height={630}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              <div style={{ padding: "8px 12px", fontFamily: "var(--sans)", fontSize: 13, color: "var(--label)" }}>
                {date} &middot; {TREATMENT_NAMES[treatment]}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
