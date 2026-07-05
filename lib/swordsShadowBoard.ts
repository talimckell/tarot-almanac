import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const SWORDS_SHADOW_BOARD = "swords-shadow";
export const SWORDS_SHADOW_TOTAL = SUIT_TOTAL;

export function pickNextUnusedSwordsShadow(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(SWORDS_SHADOW_BOARD, "Swords", count);
}
