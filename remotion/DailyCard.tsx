// The daily collective-card Short: 1080x1920, one video per date. Four rotating
// treatments mirroring lib/campaignRender.tsx's image campaign (0 affirmation,
// 1 essence, 2 keywords on a full-bleed element field, 3 the collective line as a
// quote) so a week of daily videos doesn't read as one template on repeat. All copy is
// already-authored content passed in via props; nothing here writes new copy.
import { createElement, type ReactNode } from "react";
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { evolvePath } from "@remotion/paths";
import { PIPLAYOUT } from "../lib/pips";
import { COLORS, elementColor } from "../lib/shareTokens";
import type { ShortGlyph, ShortProps } from "./types";
import { timingForProps, type ShortTiming } from "./timing";

// Same CTA line the Bluesky campaign images use (lib/campaignRender.tsx) — reused, not
// new copy. A video-specific CTA is an authoring decision for later.
const CTA = "Your card at tarotalmanac.com/today";

const clamp = (n: number) => Math.min(1, Math.max(0, n));

// Ported verbatim from lib/shareRender.tsx's StarMark (that module pulls in node:fs via
// the glyph parser, so the composition can't import it directly).
function StarMark({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56">
      <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" fill={color} />
    </svg>
  );
}

// One suit glyph, animated: stroked paths draw themselves on (evolvePath turns a
// 0..1 progress into strokeDasharray/offset), everything else fades with the same
// progress. Shapes arrive pre-parsed from the sprite with <line> already rewritten
// as stroked paths (lib/shareGlyph.ts), which is exactly what draw-on needs.
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

// The full pip layout (rank-many suit glyphs in balanced rows, courts as one large
// glyph — same rules as SharePips in lib/shareRender.tsx), each pip's draw-on staggered
// a few frames behind the last.
function PipsBlock({
  glyph,
  rank,
  color,
  frame,
  startFrame,
  scale = 1,
}: {
  glyph: ShortGlyph;
  rank: number;
  color: string;
  frame: number;
  startFrame: number;
  scale?: number;
}) {
  const rows = rank >= 11 ? [1] : PIPLAYOUT[rank];
  const widest = Math.max(...rows);
  const base = rank >= 11 ? 190 : widest >= 5 ? 104 : widest === 4 ? 122 : 148;
  const size = Math.round(base * scale);
  const gap = Math.round(26 * scale);
  let pipIndex = 0;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: Math.round(22 * scale) }}>
      {rows.map((count, r) => (
        <div key={r} style={{ display: "flex", gap }}>
          {Array.from({ length: count }).map((_, c) => {
            const start = startFrame + pipIndex++ * 5;
            const progress = interpolate(frame, [start, start + 28], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            return <AnimatedGlyph key={c} glyph={glyph} size={size} color={color} progress={progress} />;
          })}
        </div>
      ))}
    </div>
  );
}

function Eyebrow({ text, dateLabel, color, opacity }: { text: string; dateLabel: string; color: string; opacity: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, opacity }}>
      <span style={{ fontSize: 34, letterSpacing: 7, textTransform: "uppercase", color }}>{text}</span>
      <span style={{ fontSize: 29, color, opacity: 0.75 }}>{dateLabel}</span>
    </div>
  );
}

function CardName({ name, color, frame, fps, startFrame }: { name: string; color: string; frame: number; fps: number; startFrame: number }) {
  const s = spring({ frame: frame - startFrame, fps, config: { damping: 200 } });
  return (
    <span
      style={{
        fontFamily: "Cormorant",
        fontWeight: 600,
        fontSize: name.length > 17 ? 84 : 96,
        lineHeight: 1.02,
        color,
        opacity: s,
        transform: `translateY(${(1 - s) * 26}px)`,
      }}
    >
      {name}
    </span>
  );
}

// Treatments 0/1: the FeaturedCard look from the image campaign — eyebrow, pips, name,
// one authored line. They differ only in which field and which eyebrow, matching
// AffirmationTreatment/EssenceTreatment in lib/campaignRender.tsx.
function FeaturedBody({ props, frame, fps, eyebrowText, body, introOpacity }: { props: ShortProps; frame: number; fps: number; eyebrowText: string; body: string; introOpacity: number }) {
  const color = elementColor(props.element);
  const bodyOpacity = interpolate(frame, [138, 164], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Eyebrow text={eyebrowText} dateLabel={props.dateLabel} color={COLORS.label} opacity={introOpacity} />
      <PipsBlock glyph={props.glyph} rank={props.rank} color={color} frame={frame} startFrame={40} />
      <CardName name={props.minorName} color={COLORS.ink} frame={frame} fps={fps} startFrame={100} />
      <span
        style={{
          fontFamily: "Cormorant",
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.4,
          color: COLORS.charcoal,
          maxWidth: 840,
          opacity: bodyOpacity,
        }}
      >
        {body}
      </span>
    </>
  );
}

// Treatment 2: keyword chips on the full-bleed element field (the one non-stone look,
// mirroring KeywordsTreatment) — everything renders in light stone on the element color.
function KeywordsBody({ props, frame, fps, introOpacity }: { props: ShortProps; frame: number; fps: number; introOpacity: number }) {
  const light = COLORS.stone;
  return (
    <>
      <Eyebrow text="Today’s Collective Card" dateLabel={props.dateLabel} color={light} opacity={introOpacity * 0.9} />
      <PipsBlock glyph={props.glyph} rank={props.rank} color={light} frame={frame} startFrame={40} />
      <CardName name={props.minorName} color={light} frame={frame} fps={fps} startFrame={100} />
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center", maxWidth: 860 }}>
        {props.keywords.slice(0, 3).map((k, i) => {
          const s = spring({ frame: frame - (135 + i * 9), fps, config: { damping: 200 } });
          return (
            <span
              key={k}
              style={{
                fontSize: 32,
                color: light,
                padding: "14px 34px",
                border: `1.5px solid ${light}`,
                borderRadius: 999,
                opacity: s * 0.92,
                transform: `scale(${0.9 + s * 0.1})`,
              }}
            >
              {k}
            </span>
          );
        })}
      </div>
    </>
  );
}

// Treatment 3: the collective reading's own line, quote-styled — text is the star and
// the card name drops to a small attribution (the inverse emphasis of 0/1), mirroring
// CollectiveTreatment in lib/campaignRender.tsx.
function QuoteBody({ props, frame, introOpacity }: { props: ShortProps; frame: number; introOpacity: number }) {
  const color = elementColor(props.element);
  const quoteIn = interpolate(frame, [45, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const attributionIn = interpolate(frame, [95, 120], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <>
      <Eyebrow text="Today’s Collective Card" dateLabel={props.dateLabel} color={COLORS.label} opacity={introOpacity} />
      <span
        style={{
          fontFamily: "Cormorant",
          fontWeight: 600,
          fontStyle: "italic",
          fontSize: 58,
          lineHeight: 1.32,
          color: COLORS.ink,
          maxWidth: 860,
          opacity: quoteIn,
          transform: `translateY(${(1 - quoteIn) * 20}px)`,
        }}
      >
        &ldquo;{props.collectiveLine}&rdquo;
      </span>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, opacity: attributionIn }}>
        <PipsBlock glyph={props.glyph} rank={props.rank} color={color} frame={frame} startFrame={90} scale={0.36} />
        <span style={{ fontSize: 26, color: COLORS.label }}>&mdash; the collective card of the day, {props.minorName}</span>
      </div>
    </>
  );
}

function Footer({ light, opacity }: { light: boolean; opacity: number }) {
  const line = light ? COLORS.stone : COLORS.warmStone;
  const text = light ? COLORS.stone : COLORS.ink;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        borderTop: `1px solid ${line}`,
        paddingTop: 30,
        opacity,
      }}
    >
      <StarMark size={30} color={light ? COLORS.stone : COLORS.indigo} />
      <span style={{ fontFamily: "Cormorant", fontWeight: 600, fontSize: 36, color: text }}>The Tarot Almanac</span>
    </div>
  );
}

function MusicTrack({ timing }: { timing: ShortTiming }) {
  return (
    <Audio
      loop
      src={staticFile("music.mp3")}
      volume={(f) =>
        0.35 *
        interpolate(f, [0, 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
        interpolate(f, [timing.total - 45, timing.total - 5], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      }
    />
  );
}

export function DailyCard(props: ShortProps) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = timingForProps(props);
  const tr = props.treatment % 4;
  const isField = tr === 2; // full-bleed element-color treatment

  const introOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const mainFade = interpolate(frame, [t.endStart - 18, t.endStart], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endOpacity = interpolate(frame, [t.endStart, t.endStart + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  let body: ReactNode;
  switch (tr) {
    case 0:
      body = <FeaturedBody props={props} frame={frame} fps={fps} eyebrowText="Today’s Collective Card" body={props.affirmation} introOpacity={introOpacity} />;
      break;
    case 1:
      body = <FeaturedBody props={props} frame={frame} fps={fps} eyebrowText="The Collective Card of the Day" body={props.essence} introOpacity={introOpacity} />;
      break;
    case 2:
      body = <KeywordsBody props={props} frame={frame} fps={fps} introOpacity={introOpacity} />;
      break;
    default:
      body = <QuoteBody props={props} frame={frame} introOpacity={introOpacity} />;
  }

  return (
    <AbsoluteFill style={{ background: COLORS.stone, fontFamily: "Lato" }}>
      {props.hasMusic ? <MusicTrack timing={t} /> : null}

      <AbsoluteFill
        style={{
          padding: "110px 90px",
          opacity: mainFade,
          display: "flex",
          flexDirection: "column",
          background: isField ? elementColor(props.element) : COLORS.stone,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 54,
            textAlign: "center",
          }}
        >
          {body}
        </div>
        <Footer light={isField} opacity={introOpacity} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
          opacity: endOpacity,
          textAlign: "center",
          padding: "0 90px",
        }}
      >
        <StarMark size={72} color={COLORS.indigo} />
        <span style={{ fontFamily: "Cormorant", fontWeight: 600, fontSize: 76, color: COLORS.ink }}>The Tarot Almanac</span>
        <span style={{ fontSize: 34, color: COLORS.label }}>{CTA}</span>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
