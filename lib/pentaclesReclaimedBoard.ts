import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const PENTACLES_RECLAIMED_BOARD = "pentacles-reclaimed";
export const PENTACLES_RECLAIMED_TOTAL = SUIT_TOTAL;

export function pickNextUnusedPentaclesReclaimed(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(PENTACLES_RECLAIMED_BOARD, "Pentacles", count);
}
