// Generic "already generated" tracking shared across all Pinterest board tools
// (studio/pinterest-*) — one table (PinterestPinUsage), discriminated by `board`, so every
// future board reuses this instead of growing a new table each time. Not a JSON file:
// Vercel's filesystem is ephemeral in production, so this state has to live in the database.
import { prisma } from "./prisma";

export interface PinterestPoolStatus {
  total: number;
  used: number;
  remaining: number;
}

export async function pinterestPoolStatus(board: string, total: number): Promise<PinterestPoolStatus> {
  const used = await prisma.pinterestPinUsage.count({ where: { board } });
  return { total, used, remaining: Math.max(0, total - used) };
}

export async function pinterestUsedKeys(board: string): Promise<Set<string>> {
  const rows = await prisma.pinterestPinUsage.findMany({ where: { board }, select: { itemKey: true } });
  return new Set(rows.map((r) => r.itemKey));
}

export async function markPinterestUsed(board: string, itemKeys: string[]): Promise<void> {
  if (itemKeys.length === 0) return;
  await prisma.pinterestPinUsage.createMany({
    data: itemKeys.map((itemKey) => ({ board, itemKey })),
    skipDuplicates: true,
  });
}

// Scoped to ONE board — never wipes other boards' progress.
export async function resetPinterestBoard(board: string): Promise<void> {
  await prisma.pinterestPinUsage.deleteMany({ where: { board } });
}
