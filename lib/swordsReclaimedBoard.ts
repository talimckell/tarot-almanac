import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const SWORDS_RECLAIMED_BOARD = "swords-reclaimed";
export const SWORDS_RECLAIMED_TOTAL = SUIT_TOTAL;

export function pickNextUnusedSwordsReclaimed(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(SWORDS_RECLAIMED_BOARD, "Swords", count);
}
