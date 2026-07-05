// Shared render for every suit's "Gift Meanings" Pinterest board (Cups/Wands/Swords/
// Pentacles) — identical layout to lib/majorGiftRender.tsx (saturated element-color field,
// upright glyph, gift.keywords as pills), just using the suit glyph instead of a Major
// glyph. One file serves all 4 suits since nothing here is suit-specific beyond the card
// data itself — no per-suit render file needed.
import type { Card } from "./cards";
import { suitGlyphId } from "./pips";
import { WIDTH, HEIGHT, COLORS, elementColor, Glyph, PinterestCanvasSaturated } from "./pinterestRender";

const CTA = "tarotalmanac.com/tarot";

export function renderSuitGift(card: Card) {
  const color = elementColor(card.element);
  const light = COLORS.stone;
  const keywords = card.gift.keywords.slice(0, 3);
  const suit = card.meta.suit ?? "Wands";

  return (
    <PinterestCanvasSaturated color={color} cta={CTA}>
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
            opacity: 0.85,
          }}
        >
          Tarot Card Meaning &middot; Upright
        </span>

        <Glyph id={suitGlyphId(suit)} size={160} color={light} />

        <span style={{ fontFamily: "Cormorant", fontSize: 86, lineHeight: 1.05, color: light, whiteSpace: "nowrap" }}>
          {card.name}
        </span>

        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", justifyContent: "center", maxWidth: 860 }}>
          {keywords.map((k) => (
            <span
              key={k}
              style={{
                display: "flex",
                fontFamily: "Lato",
                fontSize: 34,
                color: light,
                padding: "12px 32px",
                border: `1px solid ${light}`,
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
