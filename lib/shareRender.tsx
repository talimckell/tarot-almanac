// Shared building blocks for share-image routes (next/og ImageResponse, rendered by
// Satori). Satori's layout engine expects every multi-child element to declare
// `display: "flex"` explicitly and doesn't resolve <use href>/currentColor the way a
// browser does, so glyphs get their color substituted at render time and every
// container below is written flex-first, unlike the rest of the app's plain-CSS style.
import { createElement, type ReactNode } from "react";
import { getGlyph } from "./shareGlyph";
import { pipRows, suitGlyphId } from "./pips";
import type { DayCard } from "./almanac";

export const WIDTH = 1200;
export const HEIGHT = 630;

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

// The footer every share card ends with: an optional left context slot (e.g. the date),
// the star mark + site name, and a per-surface call to action (copy supplied by the
// caller — reading/marketing copy isn't authored here, see CLAUDE.md). With `left` set
// the three sit on one justified line; without it, brand sits left and CTA right.
export function ShareFooter({ cta, left }: { cta: string; left?: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderTop: `1px solid ${COLORS.warmStone}`,
        paddingTop: 22,
      }}
    >
      {left ? (
        <span style={{ display: "flex", flex: 1, fontFamily: "Lato", fontSize: 22, color: COLORS.label }}>{left}</span>
      ) : null}
      <div style={{ display: "flex", flex: left ? 1 : 0, alignItems: "center", justifyContent: "center", gap: 12 }}>
        <StarMark size={28} />
        <span style={{ fontFamily: "Cormorant", fontSize: 30, color: COLORS.ink, whiteSpace: "nowrap" }}>
          The Tarot Almanac
        </span>
      </div>
      <span
        style={{
          display: "flex",
          flex: left ? 1 : 0,
          justifyContent: "flex-end",
          fontFamily: "Lato",
          fontSize: 22,
          color: COLORS.label,
          whiteSpace: "nowrap",
        }}
      >
        {cta}
      </span>
    </div>
  );
}

// The 1200x630 frame every share card shares: stone field, a content region, and the
// footer. Children own their own layout inside the flex:1 content region — a centered
// FeaturedCard for the affirmation surfaces, a bespoke grid for the chart.
export function ShareCanvas({
  children,
  footerLeft,
  cta,
}: {
  children: ReactNode;
  footerLeft?: string;
  cta: string;
}) {
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        background: COLORS.stone,
        padding: "40px 60px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>
      <ShareFooter left={footerLeft} cta={cta} />
    </div>
  );
}

// The centered hero used by today/bearing/monthly: an eyebrow, a glyph (minor pips or a
// Major glyph, passed in), the card name, and — optionally — the card's authored
// affirmation. Sizes are the ones tuned on the today card.
export function FeaturedCard({
  eyebrow,
  glyph,
  title,
  body,
}: {
  eyebrow: string;
  glyph: ReactNode;
  title: string;
  body?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: 22,
        textAlign: "center",
      }}
    >
      <span
        style={{
          fontFamily: "Lato",
          fontSize: 26,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: COLORS.label,
        }}
      >
        {eyebrow}
      </span>
      {glyph}
      <span style={{ fontFamily: "Cormorant", fontSize: 64, lineHeight: 1.02, color: COLORS.ink, whiteSpace: "nowrap" }}>
        {title}
      </span>
      {body ? (
        <span
          style={{
            fontFamily: "Cormorant",
            fontSize: 34,
            lineHeight: 1.34,
            color: COLORS.charcoal,
            textAlign: "center",
            maxWidth: 940,
          }}
        >
          {body}
        </span>
      ) : null}
    </div>
  );
}
