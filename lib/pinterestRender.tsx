// Shared Pinterest-pin building blocks — 1000x1500 (2:3), Pinterest's standard pin ratio.
// Deliberately separate from lib/shareRender.tsx (the social-share/Bluesky-campaign
// canvas, 1200x630 landscape): different platform, different ratio, different footer
// treatment. Built to be reused across all ~16 planned Pinterest boards, not just the
// first (Birthday Tarot Card) — future boards should add their own content layout here
// or in a sibling file, but reuse PinterestCanvas/PinterestFooter for the shared chrome.
import type { ReactNode } from "react";
import { COLORS, elementColor, Glyph, StarMark } from "./shareRender";

export const WIDTH = 1000;
export const HEIGHT = 1500;

export { COLORS, elementColor, Glyph };

// The four element accent colors, lightened for use as TEXT/glyph color on the dark ink
// background (used by "shadow"-toned boards — Major Shadow, and the suit Shadow boards
// still to come). The base elementColor() values are tuned for legibility on light stone
// backgrounds and badly fail contrast on dark ink (verified: 1.95-2.54, need >=4.5) — these
// are the same hues lightened until they clear 4.5:1 against COLORS.ink, computed via the
// WCAG relative-luminance formula rather than eyeballed.
const ELEMENT_ON_DARK: Record<import("./almanac").Element, string> = {
  fire: "#e16a53",
  water: "#4d96c2",
  air: "#af8924",
  earth: "#659c61",
};

export function elementColorOnDark(element: import("./almanac").Element): string {
  return ELEMENT_ON_DARK[element];
}

// The frame every Pinterest pin shares: stone field, a content region, and a footer with
// the brand mark + site URL. `cta` is the destination line shown at the bottom — always
// a bare domain/path (no https://) since this is printed text, not a clickable link;
// Pinterest's own destination-URL field is what actually drives the click-through.
export function PinterestCanvas({ children, cta }: { children: ReactNode; cta: string }) {
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        background: COLORS.stone,
        padding: "72px 64px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          borderTop: `1px solid ${COLORS.warmStone}`,
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StarMark size={36} />
          <span style={{ fontFamily: "Cormorant", fontSize: 42, color: COLORS.ink }}>The Tarot Almanac</span>
        </div>
        <span style={{ fontFamily: "Lato", fontSize: 30, color: COLORS.label }}>{cta}</span>
      </div>
    </div>
  );
}

// A full-bleed saturated-element-color variant of the frame — Pinterest rewards
// colorful, thumb-stopping pins, so boards that don't need the stone/editorial look
// (this Birthday board, and likely most Major/Minor meaning boards) can use this instead.
export function PinterestCanvasSaturated({
  children,
  cta,
  color,
}: {
  children: ReactNode;
  cta: string;
  color: string;
}) {
  const light = COLORS.stone;
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        background: color,
        padding: "72px 64px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>{children}</div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          borderTop: `1px solid ${light}`,
          opacity: 0.95,
          paddingTop: 28,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StarMark size={36} color={light} />
          <span style={{ fontFamily: "Cormorant", fontSize: 42, color: light }}>The Tarot Almanac</span>
        </div>
        <span style={{ fontFamily: "Lato", fontSize: 30, color: light }}>{cta}</span>
      </div>
    </div>
  );
}
