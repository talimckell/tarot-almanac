// Serializable props for the DailyCard composition. Remotion compositions run in a
// browser context (no node:fs), so everything a video needs — the day's card fields
// plus the parsed suit-glyph shapes — is assembled Node-side by lib/shortProps.ts and
// passed in as plain JSON.
import type { Element } from "../lib/almanac";

export interface ShortGlyphShape {
  tag: string;
  attrs: Record<string, string>;
}

export interface ShortGlyph {
  viewBox: string;
  shapes: ShortGlyphShape[];
}

// A type alias (not an interface) on purpose: Remotion's <Composition> needs props
// assignable to Record<string, unknown>, and TS only gives type literals the implicit
// index signature that makes that work.
export type ShortProps = {
  dateLabel: string;
  minorName: string;
  rank: number;
  element: Element;
  essence: string;
  affirmation: string;
  keywords: string[];
  collectiveLine: string;
  /** 0 affirmation · 1 essence · 2 keywords · 3 collective quote — same rotation as lib/campaignRender.tsx. */
  treatment: number;
  /** True when remotion/public/music.mp3 exists (checked Node-side at assembly). */
  hasMusic: boolean;
  glyph: ShortGlyph;
};
