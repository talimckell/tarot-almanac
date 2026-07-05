"use client";

import { useState } from "react";

interface PoolStatus {
  total: number;
  used: number;
  remaining: number;
}

interface PickItem {
  dateSlug: string;
  birthdaySlug: string;
  label: string;
}

function todaySlug(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function PinterestBirthdayStudio({ initialStatus }: { initialStatus: PoolStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [start, setStart] = useState(todaySlug());
  const [count, setCount] = useState(10);
  const [items, setItems] = useState<PickItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);

  const generate = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/studio/pinterest-birthday-pick?start=${start}&count=${count}`);
      const data = await res.json();
      setItems(data.items);
      setStatus(data.status);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset the Birthday Tarot Card board's usage tracking? All 366 birthdays become eligible again.")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/studio/pinterest-birthday-reset", { method: "POST" });
      const data = await res.json();
      setStatus(data.status);
      setItems(null);
    } finally {
      setResetting(false);
    }
  };

  const zipHref = items && items.length > 0 ? `/api/studio/pinterest-birthday-batch?dates=${items.map((i) => i.dateSlug).join(",")}` : "";

  return (
    <div style={{ marginTop: 32 }}>
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--label)" }}>
        {status.used} of {status.total} birthdays done &middot; {status.remaining} remaining
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", marginTop: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--sans)", fontSize: 14, color: "var(--label)" }}>
          Start looking from
          <input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
            style={{ padding: "8px 10px", border: "1px solid var(--warm-stone)", borderRadius: 4, fontFamily: "var(--sans)" }}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--sans)", fontSize: 14, color: "var(--label)" }}>
          Batch size
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
          onClick={generate}
          disabled={busy || status.remaining === 0}
          style={{
            padding: "10px 22px",
            background: "transparent",
            border: "1px solid var(--indigo)",
            color: "var(--indigo)",
            borderRadius: 4,
            cursor: busy || status.remaining === 0 ? "default" : "pointer",
            opacity: busy || status.remaining === 0 ? 0.6 : 1,
            fontFamily: "var(--sans)",
          }}
        >
          {busy ? "Finding unused birthdays…" : "Generate next batch"}
        </button>
        {items && items.length > 0 && (
          <a
            href={zipHref}
            onClick={() => setTimeout(() => window.location.reload(), 1500)}
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
            Download ZIP ({items.length} pins + pins.csv)
          </a>
        )}
        <button
          type="button"
          onClick={reset}
          disabled={resetting}
          style={{
            padding: "10px 22px",
            background: "transparent",
            border: "1px solid var(--fire)",
            color: "var(--fire)",
            borderRadius: 4,
            cursor: resetting ? "default" : "pointer",
            fontFamily: "var(--sans)",
            marginLeft: "auto",
          }}
        >
          {resetting ? "Resetting…" : "Reset this board"}
        </button>
      </div>

      {status.remaining === 0 && (
        <p style={{ marginTop: 16, fontFamily: "var(--sans)", color: "var(--fire)" }}>
          All 366 birthdays have been generated. Reset above to start a new cycle.
        </p>
      )}

      {items && items.length === 0 && status.remaining > 0 && (
        <p style={{ marginTop: 16, fontFamily: "var(--sans)", color: "var(--label)" }}>
          No unused birthdays found starting from that date within one cycle &mdash; try an earlier start date.
        </p>
      )}

      {items && items.length > 0 && (
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {items.map((item) => (
            <div key={item.birthdaySlug} style={{ border: "1px solid var(--warm-stone)", borderRadius: 4, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/studio/pinterest-birthday/preview?date=${item.dateSlug}`}
                alt={`Pinterest pin for ${item.label}`}
                width={1000}
                height={1500}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              <div style={{ padding: "8px 12px", fontFamily: "var(--sans)", fontSize: 13, color: "var(--label)" }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
