// Clears usage tracking for the Pentacles Reclaimed board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { PENTACLES_RECLAIMED_BOARD, PENTACLES_RECLAIMED_TOTAL } from "@/lib/pentaclesReclaimedBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(PENTACLES_RECLAIMED_BOARD);
  const status = await pinterestPoolStatus(PENTACLES_RECLAIMED_BOARD, PENTACLES_RECLAIMED_TOTAL);
  return Response.json({ ok: true, status });
}
