"use client";

import { useState } from "react";

interface PoolStatus {
  total: number;
  used: number;
  remaining: number;
}

export default function MajorReclaimedStudio({ initialStatus }: { initialStatus: PoolStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [count, setCount] = useState(6);
  const [batch, setBatch] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [resetting, setResetting] = useState(false);

  const generate = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/studio/major-reclaimed-pick?count=${count}`);
      const data = await res.json();
      setBatch(data.slugs);
      setStatus(data.status);
    } finally {
      setBusy(false);
    }
  };

  // Fetch-then-click, not a plain <a href> — see studio-zip-download-fix memory: a timed
  // reload racing an in-flight download can abort it before the file finishes saving.
  const download = async () => {
    if (!batch || batch.length === 0) return;
    setDownloading(true);
    try {
      const res = await fetch(`/api/studio/major-reclaimed-batch?slugs=${batch.join(",")}`);
      const blob = await res.blob();
      const disposition = res.headers.get("content-disposition");
      const match = disposition ? /filename="([^"]+)"/.exec(disposition) : null;
      const filename = match ? match[1] : "pinterest-major-reclaimed.zip";

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      const statusRes = await fetch("/api/studio/major-reclaimed-pick?count=1");
      const statusData = await statusRes.json();
      setStatus(statusData.status);
      setBatch(null);
    } finally {
      setDownloading(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset the Major Reclaimed board's usage tracking? All 22 Majors become eligible again.")) return;
    setResetting(true);
    try {
      const res = await fetch("/api/studio/major-reclaimed-reset", { method: "POST" });
      const data = await res.json();
      setStatus(data.status);
      setBatch(null);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div style={{ marginTop: 32 }}>
      <p style={{ fontFamily: "var(--sans)", fontSize: 14, color: "var(--label)" }}>
        {status.used} of {status.total} Majors done &middot; {status.remaining} remaining
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end", marginTop: 12 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontFamily: "var(--sans)", fontSize: 14, color: "var(--label)" }}>
          Batch size
          <input
            type="number"
            min={1}
            max={22}
            value={count}
            onChange={(e) => setCount(Math.min(22, Math.max(1, Number(e.target.value) || 1)))}
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
          {busy ? "Picking…" : "Generate next batch"}
        </button>
        {batch && batch.length > 0 && (
          <button
            type="button"
            onClick={download}
            disabled={downloading}
            style={{
              display: "inline-block",
              padding: "10px 22px",
              background: "var(--indigo)",
              color: "var(--stone)",
              border: "none",
              borderRadius: 4,
              cursor: downloading ? "default" : "pointer",
              opacity: downloading ? 0.7 : 1,
              fontFamily: "var(--sans)",
            }}
          >
            {downloading ? "Preparing download…" : `Download ZIP (${batch.length} pins + pins.csv)`}
          </button>
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
          All 22 Majors have been generated. Reset above to start a new cycle.
        </p>
      )}

      {batch && batch.length > 0 && (
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: 20,
          }}
        >
          {batch.map((slug) => (
            <div key={slug} style={{ border: "1px solid var(--warm-stone)", borderRadius: 4, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/studio/major-reclaimed/preview?slug=${slug}`}
                alt={`Pinterest pin for ${slug}`}
                width={1000}
                height={1500}
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
