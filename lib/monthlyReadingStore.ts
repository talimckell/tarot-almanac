// Get-or-create for the monthly reading: one AI call, ever, per (account holder, month).
//
// Trigger design (decided with Tali): lazy, not scheduled. Whoever requests a given open
// month first — the natural first visit once it's current, or a subscriber peeking ahead
// into current+1 — is what generates it; the row is then terminal and every later
// request, from either window, serves the same stored copy. No cron job, no wasted calls
// on months nobody opens, and peeking ahead naturally "pre-warms" next month by the time
// it rolls over. See MONTHLY_READING_BUILD_BRIEF.md's cost model and hard rule #3.
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
  if (existing) return toRecord(existing, pkg);

  const result = await generateMonthlyReading(pkg);

  try {
    const row = await prisma.monthlyReading.create({
      data:
        result.status === "ready"
          ? { profileId, month: monthSlug, status: "ready", sections: result.sections as unknown as Prisma.InputJsonValue }
          : {
              profileId,
              month: monthSlug,
              status: "failed",
              failureReason: result.failureReason,
              heldSections: result.heldSections
                ? (result.heldSections as unknown as Prisma.InputJsonValue)
                : undefined,
            },
    });
    return toRecord(row, pkg);
  } catch (err) {
    // Unique-constraint race: a second tab or double click generated first. Serve
    // whatever that request stored instead of generating (and paying for) a second
    // call — this is the one-call guarantee holding under concurrency.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      const winner = await prisma.monthlyReading.findUnique({
        where: { profileId_month: { profileId, month: monthSlug } },
      });
      if (winner) return toRecord(winner, pkg);
    }
    throw err;
  }
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
