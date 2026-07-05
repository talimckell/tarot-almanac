// The single visual treatment for "Reclaimed Reversals." Stone background (unlike the
// collective/birthday campaigns' saturated element-color fields, so this doesn't blur
// together with them on a feed) with the card's own glyph rendered upside down — a direct
// visual cue for "reversed" that reads clearly against a calm, neutral field.
import type { Card } from "./cards";
import { majorGlyphId, suitGlyphId } from "./pips";
import { WIDTH, HEIGHT, COLORS, elementColor, Glyph, ShareCanvas } from "./shareRender";

const CTA = "tarotalmanac.com/tarot";

function cardGlyphId(card: Card): string {
  if (card.arcana === "major" && card.majorIndex !== undefined) return majorGlyphId(card.majorIndex);
  return suitGlyphId(card.meta.suit ?? "Wands");
}

export function renderReclaimedReversal(card: Card) {
  const color = elementColor(card.element);
  const glyphId = cardGlyphId(card);
  const keywords = card.reclaiming.keywords.slice(0, 3);

  return (
    <ShareCanvas cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 24,
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
          Reclaimed Reversal
        </span>
        <div style={{ display: "flex", transform: "rotate(180deg)" }}>
          <Glyph id={glyphId} size={80} color={color} />
        </div>
        <span style={{ fontFamily: "Cormorant", fontSize: 54, lineHeight: 1.05, color: COLORS.ink, whiteSpace: "nowrap" }}>
          {`${card.name} Reversed`}
        </span>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          {keywords.map((k) => (
            <span
              key={k}
              style={{
                display: "flex",
                fontFamily: "Lato",
                fontSize: 22,
                color: COLORS.label,
                padding: "8px 22px",
                border: `1px solid ${COLORS.warmStone}`,
                borderRadius: 999,
              }}
            >
              {k}
            </span>
          ))}
        </div>
      </div>
    </ShareCanvas>
  );
}

export { WIDTH, HEIGHT };
