// The "Major Arcana Shadow Meanings" Pinterest board — deliberately a different look from
// Major Gift's bright saturated field: a dark ink background (moodier, matching the
// harder content) with the element color as an accent on the glyph and keyword pills
// rather than as the field itself. Reuses PinterestCanvasSaturated as-is — it's agnostic
// to what color it's given, so passing the dark ink color produces the moody card with
// no new shared-canvas code. Glyph stays upright (the "reversed" motif is reserved for
// the Reclaimed board, matching the Bluesky Reclaimed Reversals treatment).
//
// Uses elementColorOnDark, NOT elementColor — the standard element colors are tuned for
// light backgrounds and fail WCAG contrast badly on this dark field (verified 1.95-2.54
// against the 4.5 minimum for text). elementColorOnDark lightens the same hues until they
// clear 4.5:1.
import type { Card } from "./cards";
import { majorGlyphId } from "./pips";
import { WIDTH, HEIGHT, COLORS, elementColorOnDark, Glyph, PinterestCanvasSaturated } from "./pinterestRender";

const CTA = "tarotalmanac.com/tarot";

export function renderMajorShadow(card: Card) {
  const accent = elementColorOnDark(card.element);
  const light = COLORS.stone;
  const keywords = card.shadow.keywords.slice(0, 3);

  return (
    <PinterestCanvasSaturated color={COLORS.ink} cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 36,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Lato",
            fontSize: 36,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: light,
            opacity: 0.7,
          }}
        >
          Tarot Card Meaning &middot; Shadow
        </span>

        <Glyph id={majorGlyphId(card.majorIndex ?? 0)} size={160} color={accent} />

        <span style={{ fontFamily: "Cormorant", fontSize: 86, lineHeight: 1.05, color: light, whiteSpace: "nowrap" }}>
          {card.name}
        </span>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", maxWidth: 880 }}>
          {keywords.map((k) => (
            <span
              key={k}
              style={{
                display: "flex",
                fontFamily: "Lato",
                fontSize: 32,
                color: accent,
                padding: "12px 30px",
                border: `1px solid ${accent}`,
                borderRadius: 999,
              }}
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </PinterestCanvasSaturated>
  );
}

export { WIDTH, HEIGHT };
