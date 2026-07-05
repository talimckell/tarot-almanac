// The "Major Arcana Reclaimed Reversal Meanings" Pinterest board — reuses the calm stone
// background + rotated (180°) glyph look from the Bluesky Reclaimed Reversals campaign
// (lib/reclaimedReversalRender.tsx), giving "reclaimed" content one consistent visual
// identity across both platforms. Deliberately distinct from Major Gift (bright saturated
// field) and Major Shadow (dark ink field): third Major board, third distinct look.
import type { Card } from "./cards";
import { majorGlyphId } from "./pips";
import { WIDTH, HEIGHT, COLORS, elementColor, Glyph, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/tarot";

export function renderMajorReclaimed(card: Card) {
  const color = elementColor(card.element);
  const keywords = card.reclaiming.keywords.slice(0, 3);

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
          <Glyph id={majorGlyphId(card.majorIndex ?? 0)} size={140} color={color} />
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
