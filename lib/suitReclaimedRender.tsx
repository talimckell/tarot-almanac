// Shared render for every suit's "Reclaimed Reversal Meanings" Pinterest board — identical
// to lib/majorReclaimedRender.tsx's calm stone field + 180°-rotated glyph (matching the
// Bluesky Reclaimed Reversals look), just with the suit glyph. One file for all 4 suits.
import type { Card } from "./cards";
import { suitGlyphId } from "./pips";
import { WIDTH, HEIGHT, COLORS, elementColor, Glyph, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/tarot";

export function renderSuitReclaimed(card: Card) {
  const color = elementColor(card.element);
  const keywords = card.reclaiming.keywords.slice(0, 3);
  const suit = card.meta.suit ?? "Wands";

  return (
    <PinterestCanvas cta={CTA}>
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
            color: COLORS.label,
          }}
        >
          Tarot Card Meaning &middot; Reclaimed Reversal
        </span>

        <div style={{ display: "flex", transform: "rotate(180deg)" }}>
          <Glyph id={suitGlyphId(suit)} size={140} color={color} />
        </div>

        <span style={{ fontFamily: "Cormorant", fontSize: 86, lineHeight: 1.05, color: COLORS.ink, whiteSpace: "nowrap" }}>
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
                color: COLORS.label,
                padding: "12px 30px",
                border: `1px solid ${COLORS.warmStone}`,
                borderRadius: 999,
              }}
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </PinterestCanvas>
  );
}

export { WIDTH, HEIGHT };
