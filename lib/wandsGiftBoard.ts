import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const WANDS_GIFT_BOARD = "wands-gift";
export const WANDS_GIFT_TOTAL = SUIT_TOTAL;

export function pickNextUnusedWandsGift(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(WANDS_GIFT_BOARD, "Wands", count);
}
