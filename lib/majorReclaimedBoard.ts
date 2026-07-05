// Board-specific logic for "Major Arcana Reclaimed Reversal Meanings" — same fixed
// 22-card sequential walk as [[Major Gift]]/[[Major Shadow]], tracked under its own board key.
import { MAJOR_SLUGS } from "./almanac";
import { pinterestUsedKeys } from "./pinterestUsage";

export const MAJOR_RECLAIMED_BOARD = "major-reclaimed";
export const MAJOR_RECLAIMED_TOTAL = 22;

export async function pickNextUnusedMajorsReclaimed(count: number): Promise<string[]> {
  const used = await pinterestUsedKeys(MAJOR_RECLAIMED_BOARD);
  return MAJOR_SLUGS.filter((slug) => !used.has(slug)).slice(0, count);
}
