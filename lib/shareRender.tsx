// Shared building blocks for share-image routes (next/og ImageResponse, rendered by
// Satori). Satori's layout engine expects every multi-child element to declare
// `display: "flex"` explicitly and doesn't resolve <use href>/currentColor the way a
// browser does, so glyphs get their color substituted at render time and every
// container below is written flex-first, unlike the rest of the app's plain-CSS style.
import { createElement } from "react";
import { getGlyph } from "./shareGlyph";
import { pipRows, suitGlyphId } from "./pips";
import type { DayCard } from "./almanac";

export const COLORS = {
  stone: "#f6f2eb",
  vellum: "#e8e0d0",
  warmStone: "#b8a890",
  label: "#5f5648",
  charcoal: "#4a3e30",
  ink: "#2e2418",
  indigo: "#1e3a58",
  indigoMid: "#2e5478",
  fire: "#b4371f",
  water: "#2a5c7a",
  air: "#785e19",
  earth: "#3a5a38",
} as const;

export type ElementName = "fire" | "water" | "air" | "earth";

export function elementColor(el: ElementName): string {
  return COLORS[el];
}

// A single Major/suit glyph, redrawn from the parsed sprite data with `color` swapped
// in for every `currentColor` attribute (fill or stroke) the source symbol used.
export function Glyph({ id, size, color }: { id: string; size: number; color: string }) {
  const glyph = getGlyph(id);
  if (!glyph) return null;
  return (
    <svg width={size} height={size} viewBox={glyph.viewBox}>
      {glyph.shapes.map((shape, i) => {
        const resolved: Record<string, string> = {};
        for (const [k, v] of Object.entries(shape.attrs)) {
          resolved[k] = v === "currentColor" ? color : v;
        }
        return createElement(shape.tag, { key: i, ...resolved });
      })}
    </svg>
  );
}

// The eight-pointed star brand mark, ported verbatim from the inline path duplicated
// across app/today/TodayView.tsx and friends (no shared component exists for it yet).
export function StarMark({ size = 28, color = COLORS.indigo }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" fill={color} />
    </svg>
  );
}

// A Minor's pip glyph, redrawn as centered rows the same way PipGrid/MinorPips do in
// the live DOM (lib/pips.ts's row-balance table) — court cards (rank >= 11) fall back
// to a single icon, matching ChartDiagram.tsx's MinorPips.
export function SharePips({ card, size, color }: { card: DayCard; size: number; color: string }) {
  const glyphId = suitGlyphId(card.suit);
  const rows = card.rank >= 11 ? [1] : pipRows(card.rank);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      {rows.map((count, i) => (
        <div key={i} style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: count }).map((_, j) => (
            <Glyph key={j} id={glyphId} size={size} color={color} />
          ))}
        </div>
      ))}
    </div>
  );
}

// The footer CTA every share card ends with: star mark, site name, and a per-surface
// call to action (copy supplied by the caller — reading/marketing copy isn't authored
// here, see CLAUDE.md).
export function ShareFooter({ cta }: { cta: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderTop: `1px solid ${COLORS.warmStone}`,
        paddingTop: 28,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <StarMark size={26} />
        <span style={{ fontFamily: "Cormorant", fontSize: 26, color: COLORS.ink }}>
          The Tarot Almanac
        </span>
      </div>
      <span style={{ fontFamily: "Lato", fontSize: 20, color: COLORS.label }}>{cta}</span>
    </div>
  );
}
