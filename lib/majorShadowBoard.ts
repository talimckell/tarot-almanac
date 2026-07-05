// Board-specific logic for "Major Arcana Shadow Meanings" — same fixed 22-card sequential
// walk as [[Major Gift]], just tracked under its own board key so progress on one board
// never affects the other.
import { MAJOR_SLUGS } from "./almanac";
import { pinterestUsedKeys } from "./pinterestUsage";

export const MAJOR_SHADOW_BOARD = "major-shadow";
export const MAJOR_SHADOW_TOTAL = 22;

export async function pickNextUnusedMajorsShadow(count: number): Promise<string[]> {
  const used = await pinterestUsedKeys(MAJOR_SHADOW_BOARD);
  return MAJOR_SLUGS.filter((slug) => !used.has(slug)).slice(0, count);
}
