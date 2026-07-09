// Get-and-generate for the paid year reading: one AI call, ever, per purchased reading.
//
// The row is created by the Stripe webhook with status "pending". The reading page then
// generates lazily on first view: it claims the row (pending -> generating) with an atomic
// updateMany, so a second concurrent open sees "generating" and waits rather than paying
// for a duplicate call (same claim-before-generate guarantee as the monthly reading store).
// The row is terminal after — "ready" or "failed" — and never regenerates.
import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { buildYearPackage, type YearPackage } from "./yearReading";
import { generateYearReading } from "./yearReadingAI";
import type { YearReadingSections } from "./yearReadingPrompt";

export type YearReadingRecord =
  | { status: "ready"; sections: YearReadingSections; pkg: YearPackage }
  | { status: "failed"; pkg: YearPackage };

function toRecord(
  row: { status: string; sections: Prisma.JsonValue },
  pkg: YearPackage
): YearReadingRecord {
  if (row.status === "ready") {
    return { status: "ready", sections: row.sections as unknown as YearReadingSections, pkg };
  }
  return { status: "failed", pkg };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function getYearReadingByToken(token: string): Promise<YearReadingRecord | null> {
  const row = await prisma.yearReading.findUnique({ where: { shareToken: token } });
  if (!row) return null;

  // Cheap and pure, recomputed each request; only the woven prose lives in the DB.
  const pkg = buildYearPackage(row.name, row.readingYear, row.birthMonth, row.birthDay);

  if (row.status === "ready" || row.status === "failed") return toRecord(row, pkg);

  // Claim the pending row before generating, so concurrent opens don't double-call.
  const claimed = await prisma.yearReading.updateMany({
    where: { shareToken: token, status: "pending" },
    data: { status: "generating" },
  });
  if (claimed.count === 0) return waitForTerminal(token, pkg);

  const result = await generateYearReading(pkg);
  const updated = await prisma.yearReading.update({
    where: { shareToken: token },
    data:
      result.status === "ready"
        ? { status: "ready", sections: result.sections as unknown as Prisma.InputJsonValue }
        : {
            status: "failed",
            failureReason: result.failureReason,
            heldSections: result.held ? (result.held as unknown as Prisma.InputJsonValue) : undefined,
          },
  });
  return toRecord(updated, pkg);
}

// Another open already claimed generation. Poll until it lands. If it's still going after
// the window (a slow or crashed claimant), degrade to the failed fallback without writing;
// a reload picks up the claimant's own write independently.
async function waitForTerminal(token: string, pkg: YearPackage): Promise<YearReadingRecord> {
  for (let i = 0; i < 80; i++) {
    await sleep(750);
    const row = await prisma.yearReading.findUnique({ where: { shareToken: token } });
    if (row && (row.status === "ready" || row.status === "failed")) return toRecord(row, pkg);
  }
  return { status: "failed", pkg };
}
