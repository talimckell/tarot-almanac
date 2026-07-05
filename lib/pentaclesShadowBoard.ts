import { pickNextUnusedBySuit, SUIT_TOTAL } from "./suitBoards";

export const PENTACLES_SHADOW_BOARD = "pentacles-shadow";
export const PENTACLES_SHADOW_TOTAL = SUIT_TOTAL;

export function pickNextUnusedPentaclesShadow(count: number): Promise<string[]> {
  return pickNextUnusedBySuit(PENTACLES_SHADOW_BOARD, "Pentacles", count);
}
