"use client";

import { useState } from "react";

interface PoolStatus {
  total: number;
  used: number;
  remaining: number;
}

export default function ReclaimedReversalsStudio({ initialStatus }: { initialStatus: PoolStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [count, setCount] = useState(6);
  const [batch, setBatch] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [resetting, setResetting] = useState(false);

  const generate = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/studio/reclaimed-reversals-pick?count=${count}`);
      const data = await res.json();
      setBatch(data.slugs);
      setStatus(data.status);
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset all usage tracking? Every one of the 78 cards becomes eligible again.")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/studio/reclaimed-reversals-reset", { method: "POST" });
      const data = await res.json();
      setStatus(data.status);
      setBatch(null);
    } finally {
      setResetting(false);
    }
  };

  const zipHref = batch ? `/api/studio/reclaimed-reversals-batch?slugs=${batch.join(",")}` : "";

  return (
    <div style={{ marginTop: 32 }}>
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--label)" }}>
        {status.used} of {status.total} cards used &middot; {status.remaining} remaining
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", marginTop: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--sans)", fontSize: 14, color: "var(--label)" }}>
          Batch size
          <input
            type="number"
            min={1}
            max={30}
            value={count}
            onChange={(e) => setCount(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
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
          {busy ? "Picking…" : "Generate random batch"}
        </button>
        {batch && batch.length > 0 && (
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
            Download ZIP ({batch.length} cards + captions)
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
          {resetting ? "Resetting…" : "Reset all usage"}
        </button>
      </div>

      {status.remaining === 0 && (
        <p style={{ marginTop: 16, fontFamily: "var(--sans)", color: "var(--fire)" }}>
          All 78 cards have been used. Reset above to start a new cycle.
        </p>
      )}

      {batch && batch.length > 0 && (
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {batch.map((slug) => (
            <div key={slug} style={{ border: "1px solid var(--warm-stone)", borderRadius: 4, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/studio/reclaimed-reversals/preview?slug=${slug}`}
                alt={`Reclaimed Reversal for ${slug}`}
                width={1200}
                height={630}
                style={{ width: "100%", height: "auto", display: "block" }}
              />
              <div style={{ padding: "8px 12px", fontFamily: "var(--sans)", fontSize: 13, color: "var(--label)" }}>{slug}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
