"use client";

import { useState } from "react";
import { generateYearReadingPreview, type PreviewResult } from "./actions";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const box: React.CSSProperties = {
  border: "1px solid var(--warm-stone)",
  background: "var(--vellum)",
  padding: "18px 20px",
  marginTop: 18,
};
const label: React.CSSProperties = {
  fontFamily: "var(--serif-sc)",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "var(--indigo)",
  display: "block",
  marginBottom: 8,
};
const para: React.CSSProperties = {
  fontFamily: "var(--sans)",
  fontWeight: 300,
  fontSize: 16,
  lineHeight: 1.66,
  color: "var(--ink)",
  margin: "0 0 12px",
  whiteSpace: "pre-wrap",
};

function paras(text: string) {
  return text.split(/\n\n+/).map((p, i) => (
    <p key={i} style={para}>
      {p.trim()}
    </p>
  ));
}

export default function YearReadingPreview() {
  const [pending, setPending] = useState(false);
  const [res, setRes] = useState<PreviewResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setRes(null);
    try {
      const fd = new FormData(e.currentTarget);
      setRes(await generateYearReadingPreview(fd));
    } catch (err) {
      setRes({ ok: false, error: String(err) });
    } finally {
      setPending(false);
    }
  }

  const sel: React.CSSProperties = {
    fontFamily: "var(--sans)", fontSize: 15, padding: "9px 11px",
    border: "1px solid var(--charcoal)", background: "var(--stone)", borderRadius: 0,
  };

  const pkg = res?.pkg;
  const result = res?.result;
  const sections = result?.status === "ready" ? result.sections : null;
  const monthText = new Map((sections?.months ?? []).map((m) => [m.month, m.text]));

  return (
    <div>
      <form onSubmit={onSubmit} style={{ ...box, display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: "var(--label)" }}>Name</span>
          <input name="name" defaultValue="Maya" style={{ ...sel, width: 140 }} />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: "var(--label)" }}>Month</span>
          <select name="month" defaultValue="3" style={sel}>
            {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: "var(--label)" }}>Day</span>
          <select name="day" defaultValue="3" style={sel}>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: "var(--label)" }}>Year</span>
          <input name="year" type="number" defaultValue="2026" min={1} max={3000} style={{ ...sel, width: 90 }} />
        </label>
        <button
          type="submit"
          disabled={pending}
          style={{
            fontFamily: "var(--serif-sc)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
            color: "var(--stone)", background: pending ? "var(--warm-stone)" : "var(--indigo)", border: "none",
            padding: "11px 20px", cursor: pending ? "default" : "pointer",
          }}
        >
          {pending ? "Generating…" : "Generate"}
        </button>
      </form>

      {res && !res.ok && (
        <div style={{ ...box, borderColor: "var(--fire)" }}>
          <span style={{ ...label, color: "var(--fire)" }}>Error</span>
          <p style={para}>{res.error}</p>
        </div>
      )}

      {pkg && (
        <div style={box}>
          <span style={label}>The numbers {res?.ms ? `· ${(res.ms / 1000).toFixed(1)}s` : ""}</span>
          <p style={{ ...para, marginBottom: 6 }}>
            <b>{pkg.name}</b>, {pkg.year} · Bearing <b>{pkg.bearing.name}</b> ({pkg.bearing.element}) ·
            Year card <b>{pkg.yearCard.name}</b> ({pkg.yearCard.element})
          </p>
          <p style={{ ...para, marginBottom: 6, fontSize: 14, color: "var(--charcoal)" }}>
            Bearing→year gap {pkg.bearingVsYear.gap} · {pkg.bearingVsYear.sameElement ? "same element" : "different element"}
            {pkg.bearingVsYear.decemberReturnsToBearing ? " · December returns to the Bearing" : ""}
          </p>
          <p style={{ ...para, marginBottom: 6, fontSize: 14, color: "var(--charcoal)" }}>
            Weather: {pkg.elementWeather.map((e) => `${e.count} ${e.element}`).join(" · ")}
          </p>
          <p style={{ ...para, marginBottom: 12, fontSize: 14, color: "var(--charcoal)" }}>
            Months: {pkg.months.map((m) => `${m.monthName.slice(0, 3)} ${m.card}`).join(" · ")}
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/personal-year-card/wheel/image?bm=${pkg.birth.month}&bd=${pkg.birth.day}&y=${pkg.year}&n=${encodeURIComponent(pkg.name)}`}
            alt="Year wheel"
            style={{ width: "100%", maxWidth: 600, border: "1px solid var(--warm-stone)" }}
          />
        </div>
      )}

      {result && result.status === "failed" && (
        <div style={{ ...box, borderColor: "var(--fire)" }}>
          <span style={{ ...label, color: "var(--fire)" }}>Generation failed · {result.failureReason}</span>
          <pre style={{ fontSize: 12, whiteSpace: "pre-wrap", color: "var(--charcoal)" }}>
            {JSON.stringify(result.held ?? null, null, 2)?.slice(0, 4000)}
          </pre>
        </div>
      )}

      {sections && pkg && (
        <div style={{ ...box, background: "var(--stone)" }}>
          <span style={label}>The reading</span>
          {paras(sections.yearOpening)}

          <span style={{ ...label, marginTop: 18 }}>How your Bearing meets the year</span>
          {paras(sections.bearingMeetsYear)}

          <span style={{ ...label, marginTop: 18 }}>The shape of the year</span>
          {paras(sections.arc)}

          <span style={{ ...label, marginTop: 18 }}>Element weather</span>
          {paras(sections.elementWeather)}

          <span style={{ ...label, marginTop: 18 }}>Month by month</span>
          {pkg.months.map((m) => (
            <p key={m.monthName} style={para}>
              <b>{m.monthName} · {m.card}.</b> {monthText.get(m.monthName)}
            </p>
          ))}

          <span style={{ ...label, marginTop: 18 }}>What this year asks you to practice</span>
          <ul style={{ margin: "0 0 12px", paddingLeft: 20 }}>
            {sections.skills.map((s, i) => <li key={i} style={{ ...para, margin: "4px 0" }}>{s}</li>)}
          </ul>

          <span style={{ ...label, marginTop: 6 }}>Reflection questions</span>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {sections.reflections.map((r, i) => <li key={i} style={{ ...para, margin: "4px 0" }}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
