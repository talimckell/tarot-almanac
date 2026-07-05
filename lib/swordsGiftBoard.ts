import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const SWORDS_GIFT_BOARD = "swords-gift";
export const SWORDS_GIFT_TOTAL = SUIT_TOTAL;

export function pickNextUnusedSwordsGift(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(SWORDS_GIFT_BOARD, "Swords", count);
}
