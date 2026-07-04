// Get-or-create for the monthly reading: one AI call, ever, per (account holder, month).
//
// Trigger design (decided with Tali): lazy, not scheduled. Whoever requests a given open
// month first — the natural first visit once it's current, or a subscriber peeking ahead
// into current+1 — is what generates it; the row is then terminal and every later
// request, from either window, serves the same stored copy. No cron job, no wasted calls
// on months nobody opens, and peeking ahead naturally "pre-warms" next month by the time
// it rolls over. See MONTHLY_READING_BUILD_BRIEF.md's cost model and hard rule #3.
//
// Claim-before-generate: a bare check-then-create left a real race (observed in
// production — two near-simultaneous requests, e.g. a browser prefetch plus the actual
// click, both saw "no row" and both paid for the AI call before either could write the
// unique constraint). Now the row is claimed with status "pending" BEFORE the AI call,
// so a second concurrent request sees "pending" and waits for the first to finish
// instead of generating again — the one-call guarantee holds under real concurrency,
// not just against duplicate writes.
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { type YM, formatMonthSlug } from "./today";
import { buildMonthlyPackage, type MonthlyPackage } from "./monthlyReading";
import { generateMonthlyReading } from "./monthlyReadingAI";
import type { MonthlyReadingSections } from "./monthlyReadingPrompt";

export type MonthlyReadingRecord =
  | { status: "ready"; sections: MonthlyReadingSections; pkg: MonthlyPackage }
  | { status: "failed"; pkg: MonthlyPackage };

export async function getOrCreateMonthlyReading(
  profileId: string,
  month: YM,
  bm: number,
  bd: number
): Promise<MonthlyReadingRecord> {
  const monthSlug = formatMonthSlug(month);
  // Cheap and pure — recomputed on every request rather than stored, so only the AI's
  // prose needs a database round trip at all.
  const pkg = buildMonthlyPackage(month, bm, bd);

  const existing = await prisma.monthlyReading.findUnique({
    where: { profileId_month: { profileId, month: monthSlug } },
  });
  if (existing) {
    if (existing.status === "pending") return waitForPending(profileId, monthSlug, pkg);
    return toRecord(existing, pkg);
  }

  try {
    await prisma.monthlyReading.create({ data: { profileId, month: monthSlug, status: "pending" } });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return waitForPending(profileId, monthSlug, pkg);
    }
    throw err;
  }

  const result = await generateMonthlyReading(pkg);
  const row = await prisma.monthlyReading.update({
    where: { profileId_month: { profileId, month: monthSlug } },
    data:
      result.status === "ready"
        ? { status: "ready", sections: result.sections as unknown as Prisma.InputJsonValue }
        : {
            status: "failed",
            failureReason: result.failureReason,
            heldSections: result.heldSections
              ? (result.heldSections as unknown as Prisma.InputJsonValue)
              : undefined,
          },
  });
  return toRecord(row, pkg);
}

// Polls the row another request already claimed. If it's still "pending" after ~5s
// (the claimant crashed mid-generation, or is just slow), this response degrades to
// the support-line fallback WITHOUT writing anything — the claimant's own write lands
// independently, so the next reload (including a reload of this same page) sees it.
async function waitForPending(
  profileId: string,
  monthSlug: string,
  pkg: MonthlyPackage
): Promise<MonthlyReadingRecord> {
  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const row = await prisma.monthlyReading.findUnique({
      where: { profileId_month: { profileId, month: monthSlug } },
    });
    if (row && row.status !== "pending") return toRecord(row, pkg);
  }
  return { status: "failed", pkg };
}

function toRecord(
  row: { status: string; sections: Prisma.JsonValue },
  pkg: MonthlyPackage
): MonthlyReadingRecord {
  if (row.status === "ready") {
    return { status: "ready", sections: row.sections as unknown as MonthlyReadingSections, pkg };
  }
  return { status: "failed", pkg };
}
