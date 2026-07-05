import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const WANDS_RECLAIMED_BOARD = "wands-reclaimed";
export const WANDS_RECLAIMED_TOTAL = SUIT_TOTAL;

export function pickNextUnusedWandsReclaimed(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(WANDS_RECLAIMED_BOARD, "Wands", count);
}
