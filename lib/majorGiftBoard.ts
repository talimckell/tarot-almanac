// Board-specific logic for "Major Arcana Gift Meanings" — a fixed, ordered set of 22
// cards (unlike Birthday's 366-day walk or Reclaimed Reversals' random 78-card pool), so
// picking is just "next N in canonical Major order that aren't done yet." Reuses the
// generic PinterestPinUsage tracking (lib/pinterestUsage.ts) rather than inventing new
// per-board persistence.
import { MAJOR_SLUGS } from "./almanac";
import { pinterestUsedKeys } from "./pinterestUsage";

export const MAJOR_GIFT_BOARD = "major-gift";
export const MAJOR_GIFT_TOTAL = 22;

export async function pickNextUnusedMajors(count: number): Promise<string[]> {
  const used = await pinterestUsedKeys(MAJOR_GIFT_BOARD);
  return MAJOR_SLUGS.filter((slug) => !used.has(slug)).slice(0, count);
}
