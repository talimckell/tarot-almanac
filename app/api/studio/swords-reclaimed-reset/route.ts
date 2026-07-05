// Clears usage tracking for the Swords Reclaimed board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { SWORDS_RECLAIMED_BOARD, SWORDS_RECLAIMED_TOTAL } from "@/lib/swordsReclaimedBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(SWORDS_RECLAIMED_BOARD);
  const status = await pinterestPoolStatus(SWORDS_RECLAIMED_BOARD, SWORDS_RECLAIMED_TOTAL);
  return Response.json({ ok: true, status });
}
