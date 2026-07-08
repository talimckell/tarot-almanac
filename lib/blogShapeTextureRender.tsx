// Blog-02-specific diagram: a day's Major "shape" resolving to its Minor "texture" — the
// post's own central mechanic (the day's element decides the suit; the rank runs free).
// The date is resolved through lib/almanac.ts's own collectiveDayCard() at render time,
// not hand-typed, so this can never drift from what the live engine actually computes.
import { majorGlyphId, suitGlyphId } from "./pips";
import { collectiveDayCard } from "./almanac";
import type { BlogShapeTextureDiagram } from "./blogSocialContent";
import { COLORS, elementColor, Glyph } from "./shareRender";
import { WIDTH, HEIGHT, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/blog";

export function renderBlogShapeTexture(diagram: BlogShapeTextureDiagram) {
  const card = collectiveDayCard(diagram.y, diagram.m, diagram.d);
  const color = elementColor(card.element);

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

        <span style={{ fontFamily: "Cormorant", fontSize: 68, color: COLORS.ink, lineHeight: 1 }}>
          {diagram.dateLabel}
        </span>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, marginTop: 24 }}>
          <span style={{ fontFamily: "Lato", fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: COLORS.label }}>
            The Shape
          </span>
          <Glyph id={majorGlyphId(card.major)} size={160} color={COLORS.ink} />
          <span style={{ fontFamily: "Cormorant", fontSize: 58, color: COLORS.ink, lineHeight: 1 }}>{card.majorName}</span>
        </div>

        <span style={{ fontFamily: "Lato", fontSize: 52, color: COLORS.warmStone, lineHeight: 1, margin: "10px 0" }}>&darr;</span>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <span style={{ fontFamily: "Lato", fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: COLORS.label }}>
            The Texture
          </span>
          <Glyph id={suitGlyphId(card.suit)} size={170} color={color} />
          <span style={{ fontFamily: "Cormorant", fontSize: 76, color: COLORS.ink, lineHeight: 1 }}>{card.minorName}</span>
        </div>
      </div>
    </PinterestCanvas>
  );
}

export { WIDTH, HEIGHT };
