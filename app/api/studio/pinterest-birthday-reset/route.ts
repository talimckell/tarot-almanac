// Clears usage tracking for the Birthday Tarot Card board ONLY — other Pinterest boards'
// progress is untouched, since PinterestPinUsage is shared and scoped by `board`.
// POST (not GET) since this is destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";

const BOARD = "birthday-tarot-card";
const TOTAL = 366;

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(BOARD);
  const status = await pinterestPoolStatus(BOARD, TOTAL);
  return Response.json({ ok: true, status });
}
