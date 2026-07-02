// pips.ts — The Tarot Almanac
// Single source of truth for minor-arcana pip layout and suit/element mapping.
// Imported by the card-page template and the today page so the two can never drift.
//
// The row-balance rule: rank-many suit icons arranged in balanced centered rows.
// (4 of Swords = two rows of two; 7 = a row of four over a row of three; etc.)

export const PIPLAYOUT: Record<number, number[]> = {
  1: [1],
  2: [2],
  3: [3],
  4: [2, 2],
  5: [3, 2],
  6: [3, 3],
  7: [4, 3],
  8: [4, 4],
  9: [3, 3, 3],
  10: [5, 5],
};

export const COURT_RANKS = ["Page", "Knight", "Queen", "King"] as const;

// Suit -> element (lowercase, matches the CSS color tokens --fire/--water/--air/--earth)
export const ELEM_BY_SUIT: Record<string, string> = {
  Wands: "fire",
  Cups: "water",
  Swords: "air",
  Pentacles: "earth",
};

// Sprite symbol id for a suit's icon (in public/major-arcana-icons.svg).
export function suitGlyphId(suit: string): string {
  return `suit-${suit.toLowerCase()}`;
}

// Sprite symbol id for a Major's glyph.
export function majorGlyphId(num: number): string {
  return `ma-${num}`;
}

export function isCourt(rankName: string): boolean {
  return (COURT_RANKS as readonly string[]).includes(rankName);
}

// Rows of suit-icons for a given pip rank (1-10). Courts/unknown -> single icon.
export function pipRows(rank: number): number[] {
  return PIPLAYOUT[rank] ?? [1];
}
