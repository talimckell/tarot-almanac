import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const PENTACLES_GIFT_BOARD = "pentacles-gift";
export const PENTACLES_GIFT_TOTAL = SUIT_TOTAL;

export function pickNextUnusedPentaclesGift(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(PENTACLES_GIFT_BOARD, "Pentacles", count);
}
