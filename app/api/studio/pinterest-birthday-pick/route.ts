// Walks forward day-by-day from `start`, collecting the next `count` birthdays (by
// month+day) that haven't been generated yet for this board. Zero side effects — safe to
// call repeatedly while deciding where to begin a batch. Owner-only.
import { parseDateSlug, addDays, formatDateSlug } from "@/lib/today";
import { birthdaySlug, formatBirthdayLabel } from "@/lib/birthday";
import { requireStudioOwner } from "@/lib/studioAuth";
import { pinterestUsedKeys, pinterestPoolStatus } from "@/lib/pinterestUsage";

const BOARD = "birthday-tarot-card";
const TOTAL = 366;
const MAX_WALK = 400; // a full cycle plus slack, so it terminates even if the pool is exhausted

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const start = parseDateSlug(searchParams.get("start") ?? "");
  const count = Number(searchParams.get("count"));
  if (!start || !Number.isInteger(count) || count < 1 || count > 60) {
    return new Response("Bad request", { status: 400 });
  }

  const used = await pinterestUsedKeys(BOARD);
  const seenThisWalk = new Set<string>();
  const items: { dateSlug: string; birthdaySlug: string; label: string }[] = [];

  for (let i = 0; i < MAX_WALK && items.length < count; i++) {
    const date = addDays(start, i);
    const slug = birthdaySlug(date.m, date.d);
    if (used.has(slug) || seenThisWalk.has(slug)) continue;
    seenThisWalk.add(slug);
    items.push({ dateSlug: formatDateSlug(date), birthdaySlug: slug, label: formatBirthdayLabel(date.m, date.d) });
  }

  const status = await pinterestPoolStatus(BOARD, TOTAL);
  return Response.json({ items, status });
}
