// Clears usage tracking for the Pentacles Gift board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { PENTACLES_GIFT_BOARD, PENTACLES_GIFT_TOTAL } from "@/lib/pentaclesGiftBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(PENTACLES_GIFT_BOARD);
  const status = await pinterestPoolStatus(PENTACLES_GIFT_BOARD, PENTACLES_GIFT_TOTAL);
  return Response.json({ ok: true, status });
}
