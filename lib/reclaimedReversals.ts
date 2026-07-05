// Data layer for the "Reclaimed Reversals" batch campaign — random draws from all 78
// cards (Major + Minor), with persistent "already posted" tracking so a batch never
// repeats a card until manually reset. Backed by the real database (ReclaimedReversalUsage),
// not a JSON file, since Vercel's filesystem is ephemeral in production.
import { prisma } from "./prisma";
import { getAllCards, type Card } from "./cards";

export interface ReclaimedReversalPoolStatus {
  total: number;
  used: number;
  remaining: number;
}

async function usedSlugSet(): Promise<Set<string>> {
  const rows = await prisma.reclaimedReversalUsage.findMany({ select: { slug: true } });
  return new Set(rows.map((r) => r.slug));
}

export async function poolStatus(): Promise<ReclaimedReversalPoolStatus> {
  const total = getAllCards().length;
  const used = await prisma.reclaimedReversalUsage.count();
  return { total, used, remaining: Math.max(0, total - used) };
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// A fresh random pick of unused cards — does NOT mark anything used. Safe to call
// repeatedly (e.g. "reroll this batch") with zero side effects.
export async function pickRandomUnused(count: number): Promise<Card[]> {
  const used = await usedSlugSet();
  const unused = getAllCards().filter((c) => !used.has(c.slug));
  return shuffle(unused).slice(0, count);
}

export function getCardBySlugStrict(slug: string): Card | undefined {
  return getAllCards().find((c) => c.slug === slug);
}

// The commit step — called only when a batch is actually downloaded, per the owner's
// call that idle previewing/rerolling should never burn through the pool.
export async function markUsed(slugs: string[]): Promise<void> {
  if (slugs.length === 0) return;
  await prisma.reclaimedReversalUsage.createMany({
    data: slugs.map((slug) => ({ slug })),
    skipDuplicates: true,
  });
}

export async function resetAllUsage(): Promise<void> {
  await prisma.reclaimedReversalUsage.deleteMany({});
}
