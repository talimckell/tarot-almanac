// Node-side props assembly for the DailyCard Remotion composition (see /remotion).
// Everything that needs the filesystem — card JSONs via campaignContent, the glyph
// sprite via shareGlyph, the optional music track — happens here; the composition gets
// plain JSON. Shared by scripts/assembleShortProps.ts (one-off days) and
// scripts/renderShortsMonth.ts (the month batch).
import { existsSync } from "node:fs";
import { join } from "node:path";
import { assembleCampaignDay, type CampaignDay } from "./campaignContent";
import { suitGlyphId } from "./pips";
import { getGlyph } from "./shareGlyph";
import { TREATMENT_COUNT } from "./campaignTreatments";
import type { ShortProps } from "../remotion/types";

export const MUSIC_FILE = join(process.cwd(), "remotion", "public", "music.mp3");

export interface ShortDay {
  props: ShortProps;
  /** The full campaign day, so callers can build captions via captionForTreatment. */
  day: CampaignDay;
}

export function buildShortProps(y: number, m: number, d: number): ShortDay {
  const day = assembleCampaignDay({ y, m, d });
  const glyph = getGlyph(suitGlyphId(day.card.suit));
  if (!glyph) throw new Error(`No sprite glyph found for suit ${day.card.suit}`);
  // Keyed to the calendar day (not batch index like the image studio) so a video's
  // treatment is stable no matter what date range gets rendered; if the rotated
  // treatment has no authored content for this card, fall back to essence (1).
  let treatment = d % TREATMENT_COUNT;
  if (treatment === 0 && !day.affirmation) treatment = 1;
  if (treatment === 2 && day.keywords.length === 0) treatment = 1;
  if (treatment === 3 && !day.collectiveLine) treatment = 1;
  const props: ShortProps = {
    dateLabel: day.dateLabel,
    minorName: day.card.minorName,
    rank: day.card.rank,
    element: day.card.element,
    essence: day.essence,
    affirmation: day.affirmation,
    keywords: day.keywords.slice(0, 3),
    collectiveLine: day.collectiveLine,
    treatment,
    hasMusic: existsSync(MUSIC_FILE),
    glyph,
  };
  return { props, day };
}
