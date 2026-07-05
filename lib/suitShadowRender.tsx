// Shared render for every suit's "Shadow Meanings" Pinterest board — identical to
// lib/majorShadowRender.tsx's dark-ink treatment (elementColorOnDark for WCAG contrast),
// just with the suit glyph instead of a Major glyph. One file for all 4 suits.
import type { Card } from "./cards";
import { suitGlyphId } from "./pips";
import { WIDTH, HEIGHT, COLORS, elementColorOnDark, Glyph, PinterestCanvasSaturated } from "./pinterestRender";

const CTA = "tarotalmanac.com/tarot";

export function renderSuitShadow(card: Card) {
  const accent = elementColorOnDark(card.element);
  const light = COLORS.stone;
  const keywords = card.shadow.keywords.slice(0, 3);
  const suit = card.meta.suit ?? "Wands";

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

        <Glyph id={suitGlyphId(suit)} size={160} color={accent} />

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
