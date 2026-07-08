// Blog-04-specific diagram: the Bearing's whole point made visual. For a fixed birthday,
// the world's year card and yours both change every year, but the distance between them —
// the gap, the Bearing — never moves. Every row is computed live through lib/almanac.ts's
// collectiveYear()/personalYear(), so the table can never drift from the engine. The gap
// column is the same number, five times down the page — the invariant, shown rather than
// asserted. (The gap is the wheel distance mod22(personalYear − collectiveYear); it always
// equals this birthday's Bearing, mod22(bm + bd), which is why it holds.)
import { MAJORS, collectiveYear, personalYear, mod22 } from "./almanac";
import type { BlogGapHoldsDiagram } from "./blogSocialContent";
import { COLORS } from "./shareRender";
import { WIDTH, HEIGHT, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/blog";

function GapPill({ value }: { value: number }) {
  return (
    <div
      style={{
        display: "flex",
        width: 92,
        height: 92,
        borderRadius: 46,
        background: COLORS.indigo,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span style={{ fontFamily: "Lato", fontWeight: 700, fontSize: 44, color: COLORS.stone }}>{value}</span>
    </div>
  );
}

export function renderBlogGapHolds(diagram: BlogGapHoldsDiagram) {
  const rows = diagram.years.map((y) => {
    const world = collectiveYear(y);
    const you = personalYear(y, diagram.bm, diagram.bd);
    return { y, world: MAJORS[world], you: MAJORS[you], gap: mod22(you - world) };
  });

  return (
    <PinterestCanvas cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 40,
          textAlign: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
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
          <span
            style={{
              fontFamily: "Cormorant",
              fontSize: 60,
              lineHeight: 1.12,
              color: COLORS.ink,
              maxWidth: 820,
            }}
          >
            {diagram.title}
          </span>
        </div>

        {/* Column headers */}
        <div style={{ display: "flex", width: "100%", alignItems: "flex-end", paddingLeft: 8, paddingRight: 8 }}>
          <span style={{ display: "flex", width: 150, fontFamily: "Lato", fontSize: 20, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.warmStone }}>
            Year
          </span>
          <span style={{ display: "flex", flex: 1, justifyContent: "flex-end", paddingRight: 30, fontFamily: "Lato", fontSize: 20, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.warmStone }}>
            The world's card
          </span>
          <span style={{ display: "flex", width: 92, justifyContent: "center", fontFamily: "Lato", fontSize: 20, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.warmStone }}>
            Gap
          </span>
          <span style={{ display: "flex", flex: 1, justifyContent: "flex-start", paddingLeft: 30, fontFamily: "Lato", fontSize: 20, letterSpacing: 1.5, textTransform: "uppercase", color: COLORS.warmStone }}>
            Your card
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", gap: 6 }}>
          {rows.map((row, i) => (
            <div
              key={row.y}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 18,
                paddingBottom: 18,
                borderTop: i === 0 ? "none" : `1px solid ${COLORS.vellum}`,
              }}
            >
              <span style={{ display: "flex", width: 150, fontFamily: "Lato", fontWeight: 700, fontSize: 40, color: COLORS.label }}>
                {row.y}
              </span>
              <span style={{ display: "flex", flex: 1, justifyContent: "flex-end", paddingRight: 30, whiteSpace: "nowrap", fontFamily: "Cormorant", fontSize: 40, color: COLORS.ink, lineHeight: 1.05 }}>
                {row.world}
              </span>
              <div style={{ display: "flex", width: 92, justifyContent: "center" }}>
                <GapPill value={row.gap} />
              </div>
              <span style={{ display: "flex", flex: 1, justifyContent: "flex-start", paddingLeft: 30, whiteSpace: "nowrap", fontFamily: "Cormorant", fontSize: 40, color: COLORS.ink, lineHeight: 1.05 }}>
                {row.you}
              </span>
            </div>
          ))}
        </div>

        <span
          style={{
            fontFamily: "Cormorant",
            fontSize: 40,
            lineHeight: 1.28,
            color: COLORS.charcoal,
            textAlign: "center",
            maxWidth: 820,
            marginTop: 12,
          }}
        >
          {diagram.caption}
        </span>
      </div>
    </PinterestCanvas>
  );
}

export { WIDTH, HEIGHT };
