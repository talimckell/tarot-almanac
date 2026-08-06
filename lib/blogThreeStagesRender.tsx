// The "22 Majors banded into three stages" diagram — blog-07's central figure made into a
// Pinterest pin. The whole Major Arcana wheel (Fool at 0, top, running clockwise) with each
// glyph colored by the stage it sits in: Initiation (0–7), Testing (8–14), Reckoning (15–21).
// The band boundaries are the post's own (content/blog-07), fixed and structural rather than
// data-driven, and each glyph's spot is placed by hand-trig inside a relative container the
// same way lib/blogWheelRender.tsx does it (Satori supports absolute-in-relative, not arcs).
import { majorGlyphId } from "./pips";
import { MAJORS } from "./almanac";
import type { BlogThreeStagesDiagram } from "./blogSocialContent";
import { COLORS, Glyph } from "./shareRender";
import { WIDTH, HEIGHT, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/blog";
const RING_SIZE = 620;
const RADIUS = 272;
const GLYPH_SIZE = 52;

// The three bands, in the post's own order and boundaries. Colors are three distinct
// palette accents (indigo / fire / earth) so the three arcs read apart at a glance on the
// stone field, decoded by the legend below the wheel.
const BANDS = [
  { name: "Initiation", range: "Cards 0–7", start: 0, end: 7, color: COLORS.indigo },
  { name: "Testing", range: "Cards 8–14", start: 8, end: 14, color: COLORS.fire },
  { name: "Reckoning", range: "Cards 15–21", start: 15, end: 21, color: COLORS.earth },
] as const;

function bandColorFor(i: number): string {
  for (const b of BANDS) if (i >= b.start && i <= b.end) return b.color;
  return COLORS.warmStone;
}

export function renderBlogThreeStages(diagram: BlogThreeStagesDiagram) {
  return (
    <PinterestCanvas cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 40,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Lato",
            fontSize: 28,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: COLORS.label,
          }}
        >
          {diagram.eyebrow}
        </span>

        <span
          style={{
            fontFamily: "Cormorant",
            fontSize: 60,
            lineHeight: 1.12,
            color: COLORS.ink,
            maxWidth: 820,
          }}
        >
          {diagram.title}
        </span>

        <div style={{ display: "flex", position: "relative", width: RING_SIZE, height: RING_SIZE }}>
          {MAJORS.map((_, i) => {
            const angle = (i / MAJORS.length) * 2 * Math.PI - Math.PI / 2;
            const center = RING_SIZE / 2;
            const left = center + RADIUS * Math.cos(angle) - GLYPH_SIZE / 2;
            const top = center + RADIUS * Math.sin(angle) - GLYPH_SIZE / 2;
            return (
              <div key={i} style={{ display: "flex", position: "absolute", left, top }}>
                <Glyph id={majorGlyphId(i)} size={GLYPH_SIZE} color={bandColorFor(i)} />
              </div>
            );
          })}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 6 }}>
          {BANDS.map((b) => (
            <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "flex", width: 26, height: 26, borderRadius: 13, background: b.color }} />
              <span style={{ display: "flex", fontFamily: "Cormorant", fontSize: 44, color: COLORS.ink }}>
                {b.name}
              </span>
              <span style={{ display: "flex", fontFamily: "Lato", fontSize: 28, color: COLORS.label }}>
                {b.range}
              </span>
            </div>
          ))}
        </div>
      </div>
    </PinterestCanvas>
  );
}

export { WIDTH, HEIGHT };
