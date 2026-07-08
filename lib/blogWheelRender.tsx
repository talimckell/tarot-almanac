// The "22 Majors arranged in a circle" diagram — a direct visual for blog-01's central
// metaphor ("the Major Arcana are a wheel, not a list"). Satori (next/og's renderer)
// supports absolute positioning inside a relative container, so each glyph's spot is
// computed by hand via basic trigonometry rather than laid out with flexbox.
import { majorGlyphId } from "./pips";
import { MAJORS } from "./almanac";
import type { BlogWheelDiagram } from "./blogSocialContent";
import { COLORS, elementColor, Glyph } from "./shareRender";
import { WIDTH, HEIGHT, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/blog";
const RING_SIZE = 780;
const RADIUS = 340;
const GLYPH_SIZE = 56;
const HIGHLIGHT_SIZE = 86;

export function renderBlogWheelDiagram(diagram: BlogWheelDiagram, highlightMajorIndex: number) {
  const highlightColor = elementColor("fire");
  return (
    <PinterestCanvas cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 42,
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

        <div style={{ display: "flex", position: "relative", width: RING_SIZE, height: RING_SIZE }}>
          {MAJORS.map((_, i) => {
            const isHighlight = i === highlightMajorIndex;
            const size = isHighlight ? HIGHLIGHT_SIZE : GLYPH_SIZE;
            const angle = (i / MAJORS.length) * 2 * Math.PI - Math.PI / 2;
            const center = RING_SIZE / 2;
            const left = center + RADIUS * Math.cos(angle) - size / 2;
            const top = center + RADIUS * Math.sin(angle) - size / 2;
            return (
              <div key={i} style={{ display: "flex", position: "absolute", left, top }}>
                <Glyph
                  id={majorGlyphId(i)}
                  size={size}
                  color={isHighlight ? highlightColor : COLORS.warmStone}
                />
              </div>
            );
          })}
        </div>

        <span
          style={{
            fontFamily: "Cormorant",
            fontSize: 58,
            lineHeight: 1.18,
            color: COLORS.ink,
            textAlign: "center",
            maxWidth: 880,
          }}
        >
          {diagram.title}
        </span>
        <span style={{ fontFamily: "Lato", fontSize: 30, color: COLORS.label, textAlign: "center" }}>
          {diagram.subtitle}
        </span>
      </div>
    </PinterestCanvas>
  );
}

export { WIDTH, HEIGHT };
