// Shared board-logic for the 12 suit-based Pinterest boards (Cups/Wands/Swords/Pentacles x
// Gift/Shadow/Reclaimed) — same "fixed walk in canonical order, not done yet" shape as the
// Major boards (lib/majorGiftBoard.ts etc.), just over one suit's 14 ranks instead of all 22
// Majors. RANKS is already the site's one canonical rank order (lib/almanac.ts); slugs here
// must match content/cards/*.json filenames exactly (e.g. "three-of-cups").
import { RANKS } from "./almanac";
import { pinterestUsedKeys } from "./pinterestUsage";

export const SUIT_TOTAL = RANKS.length;

export function suitSlugs(suit: string): string[] {
  return RANKS.map((rank) => `${rank.toLowerCase()}-of-${suit.toLowerCase()}`);
}

export async function pickNextUnusedBySuit(board: string, suit: string, count: number): Promise<string[]> {
  const used = await pinterestUsedKeys(board);
  return suitSlugs(suit).filter((slug) => !used.has(slug)).slice(0, count);
}
