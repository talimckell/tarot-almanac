import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const WANDS_SHADOW_BOARD = "wands-shadow";
export const WANDS_SHADOW_TOTAL = SUIT_TOTAL;

export function pickNextUnusedWandsShadow(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(WANDS_SHADOW_BOARD, "Wands", count);
}
