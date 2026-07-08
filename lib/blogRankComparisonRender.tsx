// Blog-02-specific diagram: two consecutive dates side by side, showing the day's rank
// moves freely rather than climbing (the post's own point: "the texture moved because the
// date moved, not because it's marching"). Both columns resolved through lib/almanac.ts's
// own collectiveDayCard(), not hand-typed, so they can never drift from the live engine.
import { majorGlyphId, suitGlyphId } from "./pips";
import { collectiveDayCard } from "./almanac";
import type { BlogRankComparisonDiagram, BlogRankComparisonColumn } from "./blogSocialContent";
import { COLORS, elementColor, Glyph } from "./shareRender";
import { WIDTH, HEIGHT, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/blog";

function Column({ column }: { column: BlogRankComparisonColumn }) {
  const card = collectiveDayCard(column.y, column.m, column.d);
  const color = elementColor(card.element);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, flex: 1 }}>
      <span style={{ fontFamily: "Cormorant", fontSize: 50, color: COLORS.ink, lineHeight: 1 }}>{column.dateLabel}</span>
      <Glyph id={majorGlyphId(card.major)} size={110} color={COLORS.ink} />
      <span style={{ fontFamily: "Lato", fontSize: 24, color: COLORS.label }}>{card.majorName}</span>
      <Glyph id={suitGlyphId(card.suit)} size={110} color={color} />
      <span style={{ fontFamily: "Cormorant", fontSize: 46, color: COLORS.ink, lineHeight: 1.1, textAlign: "center" }}>
        {card.minorName}
      </span>
    </div>
  );
}

export function renderBlogRankComparison(diagram: BlogRankComparisonDiagram) {
  return (
    <PinterestCanvas cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 54,
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

        <div style={{ display: "flex", width: "100%", gap: 28, alignItems: "flex-start" }}>
          <Column column={diagram.columns[0]} />
          <div style={{ display: "flex", width: 1, alignSelf: "stretch", background: COLORS.warmStone }} />
          <Column column={diagram.columns[1]} />
        </div>

        <span
          style={{
            fontFamily: "Cormorant",
            fontSize: 54,
            lineHeight: 1.2,
            color: COLORS.ink,
            textAlign: "center",
            maxWidth: 860,
            marginTop: 16,
          }}
        >
          {diagram.title}
        </span>
      </div>
    </PinterestCanvas>
  );
}

export { WIDTH, HEIGHT };
