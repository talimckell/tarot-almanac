// Clears usage tracking for the Wands Reclaimed board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { WANDS_RECLAIMED_BOARD, WANDS_RECLAIMED_TOTAL } from "@/lib/wandsReclaimedBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(WANDS_RECLAIMED_BOARD);
  const status = await pinterestPoolStatus(WANDS_RECLAIMED_BOARD, WANDS_RECLAIMED_TOTAL);
  return Response.json({ ok: true, status });
}
