// The year wheel: the full 22-Major cycle as a ring, with the twelve consecutive months
// lit and element-tinted, the year card marked as the doorway, and the nine untouched
// Majors dimmed. Rendered by Satori (next/og), so it reuses the share-image glyph infra
// (lib/shareRender's Glyph draws each Major from the parsed sprite; no <use href>).
import { createElement } from "react";
import { ELEMENT_BY_MAJOR } from "./almanac";
import { COLORS, elementColor, Glyph, type ElementName } from "./shareRender";

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

// Index i (0-21) sits at this angle, the Fool at top, running clockwise.
function angleFor(i: number): number {
  return -90 + i * (360 / 22);
}

export function YearWheel({
  yearCardIdx,
  monthIndices,
  diameter = 470,
  glyph = 36,
  centerTitle,
  centerSub,
}: {
  yearCardIdx: number;
  monthIndices: number[];
  diameter?: number;
  glyph?: number;
  centerTitle?: string;
  centerSub?: string;
}) {
  const R = diameter / 2;
  const cx = R;
  const cy = R;
  const ringR = R - glyph / 2 - 4;
  const lit = new Set<number>([yearCardIdx, ...monthIndices]);

  const [yx, yy] = polar(cx, cy, ringR, angleFor(yearCardIdx));
  const [ax, ay] = polar(cx, cy, ringR, angleFor(monthIndices[0]));
  const [bx, by] = polar(cx, cy, ringR, angleFor(monthIndices[monthIndices.length - 1]));
  // The lit path runs clockwise through the twelve month steps (>180°, so large-arc = 1).
  const arcPath = `M ${ax} ${ay} A ${ringR} ${ringR} 0 1 1 ${bx} ${by}`;

  return (
    <div style={{ display: "flex", position: "relative", width: diameter, height: diameter }}>
      {/* Base ring, the lit twelve-step arc, and the year-card doorway marker. */}
      <svg width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`} style={{ position: "absolute", left: 0, top: 0 }}>
        <circle cx={cx} cy={cy} r={ringR} fill="none" stroke={COLORS.warmStone} strokeWidth={1} />
        {createElement("path", { d: arcPath, fill: "none", stroke: COLORS.indigo, strokeWidth: 3, opacity: 0.55 })}
        <circle cx={yx} cy={yy} r={glyph * 0.72} fill="none" stroke={COLORS.indigo} strokeWidth={2} />
      </svg>

      {Array.from({ length: 22 }, (_, i) => i).map((i) => {
        const [x, y] = polar(cx, cy, ringR, angleFor(i));
        const color = elementColor(ELEMENT_BY_MAJOR[i] as ElementName);
        return (
          <div
            key={i}
            style={{
              display: "flex",
              position: "absolute",
              left: x - glyph / 2,
              top: y - glyph / 2,
              opacity: lit.has(i) ? 1 : 0.2,
            }}
          >
            <Glyph id={`ma-${i}`} size={glyph} color={color} />
          </div>
        );
      })}

      {(centerTitle || centerSub) && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            left: cx - 150,
            top: cy - 44,
            width: 300,
            height: 88,
          }}
        >
          {centerSub && (
            <span
              style={{
                display: "flex",
                fontFamily: "Lato",
                fontSize: 18,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: COLORS.label,
                marginBottom: 4,
              }}
            >
              {centerSub}
            </span>
          )}
          {centerTitle && (
            <span style={{ display: "flex", fontFamily: "Cormorant", fontSize: 46, color: COLORS.ink, textAlign: "center" }}>
              {centerTitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
