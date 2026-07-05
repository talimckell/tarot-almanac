import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const CUPS_RECLAIMED_BOARD = "cups-reclaimed";
export const CUPS_RECLAIMED_TOTAL = SUIT_TOTAL;

export function pickNextUnusedCupsReclaimed(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(CUPS_RECLAIMED_BOARD, "Cups", count);
}
