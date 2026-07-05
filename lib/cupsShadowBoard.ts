import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const CUPS_SHADOW_BOARD = "cups-shadow";
export const CUPS_SHADOW_TOTAL = SUIT_TOTAL;

export function pickNextUnusedCupsShadow(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(CUPS_SHADOW_BOARD, "Cups", count);
}
