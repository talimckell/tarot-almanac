// Scene 4 of the tarot-birth-chart pillar video, the proof: the viewer's year card and
// the world's year card across a stretch of years, with the gap column stamping the same
// number on every row. Grows out of lib/blogNatalChartRender.tsx's You/World chart (same
// columns, same Cormorant names, same tokens), turned from one static date into an
// animated table where both card columns change every row and the gap column never does.
// All numbers arrive pre-computed from the real engine via lib/bearingProofProps.ts.
import { createElement } from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { COLORS } from "../lib/shareTokens";
import type { ShortGlyph } from "./types";
import type { BearingProofProps, ProofRow } from "./proofTypes";

export const PROOF_FPS = 30;

// Scene beats, in frames. Rows drop in one at a time; once they're all down the gap
// column lights up (both card columns are visibly different row to row, the gap column
// is a stack of identical numbers), then the napkin shortcut fades in underneath.
const INTRO_END = 55; // date + column headers settled
const ROWS_START = 60;
const ROW_STRIDE = 46; // frames between one row landing and the next
const ROW_DRAW = 30; // glyph draw-on / name settle within a row
const HOLD_AFTER = 14;
const GLOW_LEN = 60;
const NAPKIN_LEN = 120;

export function proofDuration(rowCount: number): number {
  const rowsEnd = ROWS_START + rowCount * ROW_STRIDE + ROW_DRAW;
  return rowsEnd + HOLD_AFTER + GLOW_LEN + NAPKIN_LEN;
}

interface Cues {
  rowStarts: number[];
  glowStart: number;
  napkinStart: number;
  total: number;
}

// The scene's beats in frames — read off the VO sync when there's a voice track,
// otherwise fall back to the synthetic stride the silent POC used.
function resolveCues(props: BearingProofProps, fps: number): Cues {
  const rowCount = props.rows.length;
  if (props.sync) {
    const sec = (s: number) => Math.round(s * fps);
    return {
      rowStarts: props.sync.rowStarts.map(sec),
      glowStart: sec(props.sync.glowStart),
      napkinStart: sec(props.sync.napkinStart),
      total: sec(props.sync.total),
    };
  }
  const rowStarts = props.rows.map((_, i) => ROWS_START + i * ROW_STRIDE);
  const gStart = ROWS_START + rowCount * ROW_STRIDE + ROW_DRAW + HOLD_AFTER;
  return { rowStarts, glowStart: gStart, napkinStart: gStart + GLOW_LEN, total: proofDuration(rowCount) };
}

const clamp = (n: number) => Math.min(1, Math.max(0, n));

// Ported from DailyCard.tsx: stroked paths draw themselves on (evolvePath maps a 0..1
// progress to strokeDasharray/offset), everything else fades with the same progress.
// The Major glyphs are engraved line art, so nearly every shape draws on.
function AnimatedGlyph({ glyph, size, color, progress }: { glyph: ShortGlyph; size: number; color: string; progress: number }) {
  const p = clamp(progress);
  return (
    <svg width={size} height={size} viewBox={glyph.viewBox} style={{ display: "block" }}>
      {glyph.shapes.map((shape, i) => {
        const resolved: Record<string, string> = {};
        for (const [k, v] of Object.entries(shape.attrs)) {
          resolved[k] = v === "currentColor" ? color : v;
        }
        if (shape.tag === "path" && resolved.d && resolved.stroke && resolved.stroke !== "none") {
          const { strokeDasharray, strokeDashoffset } = evolvePath(p, resolved.d);
          return createElement("path", { key: i, ...resolved, strokeDasharray, strokeDashoffset });
        }
        return createElement(shape.tag, { key: i, ...resolved, opacity: p });
      })}
    </svg>
  );
}

// One card cell: glyph draws on, name springs up just behind it. Matches the MajorCell
// treatment in blogNatalChartRender (glyph over Cormorant name).
function CardCell({ card, color, frame, fps, start }: { card: ProofRow["you"]; color: string; frame: number; fps: number; start: number }) {
  const draw = interpolate(frame, [start, start + ROW_DRAW], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const nameSpring = spring({ frame: frame - (start + 6), fps, config: { damping: 200 } });
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "column", alignItems: "center", gap: 12 }}>
      <AnimatedGlyph glyph={card.glyph} size={70} color={color} progress={draw} />
      <span
        style={{
          fontFamily: "Cormorant",
          fontWeight: 600,
          fontSize: 34,
          lineHeight: 1.02,
          textAlign: "center",
          color: COLORS.ink,
          opacity: nameSpring,
          transform: `translateY(${(1 - nameSpring) * 10}px)`,
        }}
      >
        {card.name}
      </span>
    </div>
  );
}

const COL = { year: 200, gap: 240 } as const;

function ColHeader({ label, color, opacity }: { label: string; color: string; opacity: number }) {
  return (
    <span
      style={{
        display: "flex",
        flex: 1,
        justifyContent: "center",
        fontFamily: "Lato",
        fontWeight: 700,
        fontSize: 24,
        letterSpacing: 2,
        textTransform: "uppercase",
        color,
        opacity,
      }}
    >
      {label}
    </span>
  );
}

function Row({ row, index, start, frame, fps, gapLit }: { row: ProofRow; index: number; start: number; frame: number; fps: number; gapLit: number }) {
  const rowIn = interpolate(frame, [start, start + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // The gap number stamps in a beat after the two cards land.
  const stampAt = start + ROW_DRAW - 6;
  const stamp = spring({ frame: frame - stampAt, fps, config: { damping: 12, stiffness: 180 } });
  const gapColor = gapLit > 0.5 ? COLORS.indigo : COLORS.charcoal;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: 132,
        borderTop: index === 0 ? "none" : `1px solid ${COLORS.vellum}`,
        opacity: rowIn,
        transform: `translateY(${(1 - rowIn) * 16}px)`,
      }}
    >
      <span style={{ display: "flex", width: COL.year, fontFamily: "Cormorant", fontWeight: 600, fontSize: 46, color: COLORS.charcoal }}>
        {row.year}
      </span>
      <CardCell card={row.you} color={COLORS.indigo} frame={frame} fps={fps} start={start} />
      <CardCell card={row.world} color={COLORS.warmStone} frame={frame} fps={fps} start={start} />
      <div style={{ display: "flex", width: COL.gap, justifyContent: "center" }}>
        <span
          style={{
            fontFamily: "Cormorant",
            fontWeight: 600,
            fontSize: 66,
            color: gapColor,
            opacity: clamp(stamp),
            transform: `scale(${0.6 + clamp(stamp) * 0.4})`,
          }}
        >
          {row.gap}
        </span>
      </div>
    </div>
  );
}

export function BearingProof(props: BearingProofProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cues = resolveCues(props, fps);

  const introOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const headerOpacity = interpolate(frame, [24, INTRO_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const gapLit = interpolate(frame, [cues.glowStart, cues.glowStart + GLOW_LEN], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const napkinIn = interpolate(frame, [cues.napkinStart, cues.napkinStart + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: COLORS.stone, fontFamily: "Lato" }}>
      {props.sync ? <Audio src={staticFile(props.sync.audio)} /> : null}
      <AbsoluteFill style={{ padding: "80px 160px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Title: the birthday driving the table */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: introOpacity }}>
          <span style={{ fontFamily: "Lato", fontSize: 24, letterSpacing: 3, textTransform: "uppercase", color: COLORS.label }}>
            Born {props.dateLabel}
          </span>
          <span style={{ fontFamily: "Cormorant", fontWeight: 600, fontSize: 60, color: COLORS.ink, textAlign: "center" }}>
            My year card, and the world&rsquo;s
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", width: "100%", maxWidth: 1500, marginTop: 44 }}>
          {/* Column headers */}
          <div style={{ display: "flex", alignItems: "center", width: "100%", paddingBottom: 14, borderBottom: `2px solid ${COLORS.warmStone}` }}>
            <span style={{ display: "flex", width: COL.year }} />
            <ColHeader label="You" color={COLORS.indigo} opacity={headerOpacity} />
            <ColHeader label="The World" color={COLORS.warmStone} opacity={headerOpacity} />
            <div style={{ display: "flex", width: COL.gap, justifyContent: "center" }}>
              <span
                style={{
                  fontFamily: "Lato",
                  fontWeight: 700,
                  fontSize: 24,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: gapLit > 0.5 ? COLORS.indigo : COLORS.label,
                  opacity: headerOpacity,
                }}
              >
                The gap
              </span>
            </div>
          </div>

          {/* The gap-column highlight: a soft indigo panel behind the last column that
              fades in once every row is down, saying "this never moved." */}
          <div style={{ position: "relative", display: "flex", flexDirection: "column", width: "100%" }}>
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                right: 0,
                width: COL.gap,
                borderRadius: 18,
                background: COLORS.indigo,
                opacity: gapLit * 0.08,
              }}
            />
            {props.rows.map((row, i) => (
              <Row key={row.year} row={row} index={i} start={cues.rowStarts[i]} frame={frame} fps={fps} gapLit={gapLit} />
            ))}
          </div>
        </div>

        {/* Napkin shortcut */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 40, opacity: napkinIn, transform: `translateY(${(1 - napkinIn) * 12}px)` }}>
          <span style={{ fontFamily: "Cormorant", fontWeight: 600, fontStyle: "italic", fontSize: 52, color: COLORS.charcoal }}>
            {props.napkin}
          </span>
          <span style={{ fontFamily: "Lato", fontSize: 34, color: COLORS.warmStone }}>&rarr;</span>
          <span style={{ fontFamily: "Cormorant", fontWeight: 600, fontStyle: "italic", fontSize: 52, color: COLORS.indigo }}>
            {props.bearingName}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
