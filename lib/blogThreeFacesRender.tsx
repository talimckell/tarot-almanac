// Blog-03-specific diagram: one real card's three faces (Gift/Shadow/Reclaiming) side by
// side. The card is looked up through lib/cards.ts's getCardBySlug() by the CALLER (the
// route), same as every other card-based board render in this codebase (e.g.
// lib/majorGiftRender.tsx) — this function takes an already-resolved Card, it doesn't
// touch the filesystem itself. Visual convention: Gift = upright glyph in the card's own
// element color (its clearest good); Shadow = upright glyph in a muted ink tone (the same
// gift, dimmed); Reclaiming = 180°-rotated glyph in full color — the same convention
// already established by the Bluesky/Pinterest Reclaimed Reversals campaigns, reused
// here for consistency rather than invented fresh.
import { majorGlyphId, suitGlyphId } from "./pips";
import type { Card } from "./cards";
import type { BlogThreeFacesDiagram } from "./blogSocialContent";
import { COLORS, elementColor, Glyph } from "./shareRender";
import { WIDTH, HEIGHT, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/blog";

function cardGlyphId(card: Card): string {
  if (card.arcana === "major" && card.majorIndex !== undefined) return majorGlyphId(card.majorIndex);
  return suitGlyphId(card.meta.suit ?? "Cups");
}

function Face({
  label,
  glyphId,
  color,
  rotated,
  keyword,
}: {
  label: string;
  glyphId: string;
  color: string;
  rotated?: boolean;
  keyword: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 30, flex: 1 }}>
      <span style={{ fontFamily: "Lato", fontSize: 24, letterSpacing: 2, textTransform: "uppercase", color: COLORS.label }}>
        {label}
      </span>
      {/* Satori chokes on an explicit `transform: undefined` in a style object (it
          doesn't just no-op like a browser would) — omit the key entirely via spread
          rather than a ternary-to-undefined when the face isn't rotated. */}
      <div style={{ display: "flex", ...(rotated ? { transform: "rotate(180deg)" } : {}) }}>
        <Glyph id={glyphId} size={180} color={color} />
      </div>
      <span style={{ fontFamily: "Cormorant", fontSize: 42, color: COLORS.ink, lineHeight: 1.15, textAlign: "center" }}>
        {keyword}
      </span>
    </div>
  );
}

export function renderBlogThreeFaces(diagram: BlogThreeFacesDiagram, card: Card) {
  const glyphId = cardGlyphId(card);
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
          gap: 78,
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

        <span style={{ fontFamily: "Cormorant", fontSize: 84, color: COLORS.ink, lineHeight: 1 }}>{card.name}</span>

        <div style={{ display: "flex", width: "100%", gap: 28, alignItems: "flex-start" }}>
          <Face label="Gift" glyphId={glyphId} color={color} keyword={card.gift.keywords[0]} />
          <Face label="Shadow" glyphId={glyphId} color={COLORS.charcoal} keyword={card.shadow.keywords[0]} />
          <Face label="Reclaiming" glyphId={glyphId} color={color} rotated keyword={card.reclaiming.keywords[0]} />
        </div>

        <span
          style={{
            fontFamily: "Cormorant",
            fontSize: 46,
            lineHeight: 1.25,
            color: COLORS.ink,
            textAlign: "center",
            maxWidth: 840,
            marginTop: 6,
          }}
        >
          {diagram.caption}
        </span>
      </div>
    </PinterestCanvas>
  );
}

export { WIDTH, HEIGHT };
