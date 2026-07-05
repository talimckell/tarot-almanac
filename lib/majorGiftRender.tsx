// The "Major Arcana Gift Meanings" Pinterest board — glyph (upright, not rotated — this
// is the gift/upright meaning, the inverse framing of Reclaimed Reversals' rotated
// glyph), card name, and its gift.keywords as tag pills, on a saturated element-color
// field matching the Birthday board's bright, inviting tone (the "gift" is the positive
// framing, unlike the moodier Shadow board planned next).
import type { Card } from "./cards";
import { majorGlyphId } from "./pips";
import { WIDTH, HEIGHT, COLORS, elementColor, Glyph, PinterestCanvasSaturated } from "./pinterestRender";

const CTA = "tarotalmanac.com/tarot";

export function renderMajorGift(card: Card) {
  const color = elementColor(card.element);
  const light = COLORS.stone;
  const keywords = card.gift.keywords.slice(0, 3);

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

        <Glyph id={majorGlyphId(card.majorIndex ?? 0)} size={160} color={light} />

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
