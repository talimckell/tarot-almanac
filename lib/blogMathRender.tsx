// The "worked example" diagram — shows a specific date's arithmetic step by step,
// ending on the card it lands on. A concrete, show-your-work companion to the abstract
// wheel diagram (lib/blogWheelRender.tsx), for the Pinterest audience that responds well
// to "here's exactly how it's calculated" infographics.
import { majorGlyphId } from "./pips";
import { MAJORS, ELEMENT_BY_MAJOR } from "./almanac";
import type { BlogMathExample } from "./blogSocialContent";
import { COLORS, elementColor, Glyph } from "./shareRender";
import { WIDTH, HEIGHT, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/blog";

export function renderBlogMathDiagram(example: BlogMathExample) {
  const resultName = MAJORS[example.resultMajorIndex];
  const resultColor = elementColor(ELEMENT_BY_MAJOR[example.resultMajorIndex]);
  return (
    <PinterestCanvas cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 58,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Lato",
            fontSize: 30,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            color: COLORS.label,
          }}
        >
          {example.eyebrow}
        </span>

        <span style={{ fontFamily: "Cormorant", fontSize: 96, color: COLORS.ink, lineHeight: 1 }}>
          {example.dateLabel}
        </span>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
          {example.steps.map((step, i) => (
            <span
              key={i}
              style={{
                display: "flex",
                fontFamily: "Lato",
                fontWeight: 700,
                fontSize: 72,
                color: COLORS.charcoal,
                letterSpacing: 1,
              }}
            >
              {step}
            </span>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, marginTop: 32 }}>
          <Glyph id={majorGlyphId(example.resultMajorIndex)} size={180} color={resultColor} />
          <span style={{ fontFamily: "Cormorant", fontSize: 90, color: COLORS.ink, lineHeight: 1 }}>{resultName}</span>
        </div>
      </div>
    </PinterestCanvas>
  );
}

export { WIDTH, HEIGHT };
