// Blog-05-specific diagram: the seven-card natal chart itself, worked from one real birth
// date. Every card — the four Major positions, the two Minor day positions, and the
// Bearing — is computed live through lib/natalChart.ts's computeNatalChart(), so the grid
// can never drift from the engine or from the post's own worked numbers. Two sides (you /
// the world) across three layers (year / month / day), with the Bearing set apart below as
// the constant that ties the two sides together.
import { majorGlyphId, suitGlyphId } from "./pips";
import { computeNatalChart, bearingStepsWord, type MajorPosition } from "./natalChart";
import type { DayCard } from "./almanac";
import type { BlogNatalChartDiagram } from "./blogSocialContent";
import { COLORS, elementColor, Glyph } from "./shareRender";
import { WIDTH, HEIGHT, PinterestCanvas } from "./pinterestRender";

const CTA = "tarotalmanac.com/blog";
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const LAYERS = [
  { label: "Year", sub: "the core" },
  { label: "Month", sub: "inner life" },
  { label: "Day", sub: "the surface" },
];

function MajorCell({ pos }: { pos: MajorPosition }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", gap: 14 }}>
      <Glyph id={majorGlyphId(pos.major)} size={84} color={COLORS.ink} />
      <span style={{ fontFamily: "Cormorant", fontSize: 34, color: COLORS.ink, textAlign: "center", lineHeight: 1.05 }}>
        {pos.name}
      </span>
    </div>
  );
}

function MinorCell({ card }: { card: DayCard }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center", gap: 14 }}>
      <Glyph id={suitGlyphId(card.suit)} size={84} color={elementColor(card.element)} />
      <span style={{ fontFamily: "Cormorant", fontSize: 34, color: COLORS.ink, textAlign: "center", lineHeight: 1.05 }}>
        {card.minorName}
      </span>
    </div>
  );
}

export function renderBlogNatalChart(diagram: BlogNatalChartDiagram) {
  const chart = computeNatalChart(diagram.by, diagram.bm, diagram.bd);
  const dateLabel = `Born ${MONTHS[diagram.bm - 1]} ${diagram.bd}, ${diagram.by}`;
  const you = [chart.personalYear, chart.personalMonth];
  const world = [chart.collectiveYear, chart.collectiveMonth];
  const steps = bearingStepsWord(chart.bearing.major);

  return (
    <PinterestCanvas cta={CTA}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 22 }}>
        <span style={{ fontFamily: "Lato", fontSize: 26, letterSpacing: 2.5, textTransform: "uppercase", color: COLORS.label }}>
          {diagram.eyebrow}
        </span>
        <span style={{ fontFamily: "Cormorant", fontSize: 56, color: COLORS.ink, textAlign: "center", lineHeight: 1.12, maxWidth: 800 }}>
          {diagram.title}
        </span>
        <span style={{ fontFamily: "Lato", fontSize: 24, color: COLORS.warmStone }}>{dateLabel}</span>

        {/* Column headers */}
        <div style={{ display: "flex", width: "100%", marginTop: 18 }}>
          <span style={{ display: "flex", width: 176 }} />
          <span style={{ display: "flex", flex: 1, justifyContent: "center", fontFamily: "Lato", fontWeight: 700, fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: COLORS.indigo }}>
            You
          </span>
          <span style={{ display: "flex", flex: 1, justifyContent: "center", fontFamily: "Lato", fontWeight: 700, fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: COLORS.warmStone }}>
            The World
          </span>
        </div>

        {/* Three layer rows */}
        <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
          {LAYERS.map((layer, i) => (
            <div
              key={layer.label}
              style={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                paddingTop: 26,
                paddingBottom: 26,
                borderTop: i === 0 ? "none" : `1px solid ${COLORS.vellum}`,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", width: 176, paddingRight: 8 }}>
                <span style={{ fontFamily: "Cormorant", fontSize: 40, color: COLORS.charcoal, lineHeight: 1 }}>{layer.label}</span>
                <span style={{ fontFamily: "Lato", fontSize: 18, letterSpacing: 1, textTransform: "uppercase", color: COLORS.warmStone }}>{layer.sub}</span>
              </div>
              {i < 2 ? <MajorCell pos={you[i]} /> : <MinorCell card={chart.personalDayMinor} />}
              {i < 2 ? <MajorCell pos={world[i]} /> : <MinorCell card={chart.collectiveDayMinor} />}
            </div>
          ))}
        </div>

        {/* The seventh card: the Bearing */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 22,
            width: "100%",
            marginTop: 14,
            paddingTop: 30,
            borderTop: `2px solid ${COLORS.warmStone}`,
          }}
        >
          <Glyph id={majorGlyphId(chart.bearing.major)} size={66} color={COLORS.indigo} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontFamily: "Lato", fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: COLORS.warmStone }}>
              The Bearing
            </span>
            <span style={{ fontFamily: "Cormorant", fontSize: 40, color: COLORS.ink, lineHeight: 1.05 }}>
              {chart.bearing.name} · {steps} steps at every layer
            </span>
          </div>
        </div>

        <span style={{ fontFamily: "Cormorant", fontSize: 36, color: COLORS.charcoal, textAlign: "center", lineHeight: 1.28, maxWidth: 820, marginTop: 8 }}>
          {diagram.caption}
        </span>
      </div>
    </PinterestCanvas>
  );
}

export { WIDTH, HEIGHT };
