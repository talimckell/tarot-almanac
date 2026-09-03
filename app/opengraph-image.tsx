// The homepage's og:image (and, absent a twitter-image file, its twitter:image too —
// Next.js falls back to opengraph-image for Twitter Card metadata automatically). Built
// from the same star mark + palette as the rest of the site rather than a screenshot, so
// it stays legible at link-preview size. See lib/shareRender.tsx for the pattern this
// borrows (Satori wants every multi-child element to declare display: "flex").
import { ImageResponse } from "next/og";
import { loadShareFonts } from "@/lib/ogFonts";
import { COLORS } from "@/lib/shareTokens";

export const runtime = "nodejs";
export const alt = "The Tarot Almanac — find your angle on the day";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const EYEBROW = "A PERPETUAL TAROT ALMANAC";
const LINE_1 = "Find your angle on";
const LINE_2 = "the day.";
const SUBTEXT = "Every day has its cards, set by tarot numerology.";
const FOOTER = "tarotalmanac.com";

export default async function Image() {
  const fonts = await loadShareFonts([EYEBROW, LINE_1, LINE_2, SUBTEXT, FOOTER].join(" "));

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: COLORS.stone,
        }}
      >
        <span
          style={{
            fontFamily: "Lato",
            fontSize: 22,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: COLORS.label,
          }}
        >
          {EYEBROW}
        </span>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: 1.05 }}>
          <span style={{ fontFamily: "Cormorant", fontSize: 78, color: COLORS.ink }}>{LINE_1}</span>
          <span style={{ fontFamily: "Cormorant", fontSize: 78, fontStyle: "italic", color: COLORS.indigo }}>
            {LINE_2}
          </span>
        </div>
        <span style={{ fontFamily: "Cormorant", fontSize: 30, color: COLORS.charcoal, marginTop: 4 }}>
          {SUBTEXT}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 24 }}>
          <svg width={22} height={22} viewBox="0 0 56 56">
            <path d="M28 7 L32.5 23.5 L49 28 L32.5 32.5 L28 49 L23.5 32.5 L7 28 L23.5 23.5 Z" fill={COLORS.indigo} />
          </svg>
          <span style={{ fontFamily: "Lato", fontSize: 22, color: COLORS.label }}>{FOOTER}</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
