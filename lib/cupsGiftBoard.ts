import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const CUPS_GIFT_BOARD = "cups-gift";
export const CUPS_GIFT_TOTAL = SUIT_TOTAL;

export function pickNextUnusedCupsGift(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(CUPS_GIFT_BOARD, "Cups", count);
}
