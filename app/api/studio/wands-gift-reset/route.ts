// Clears usage tracking for the Wands Gift board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { WANDS_GIFT_BOARD, WANDS_GIFT_TOTAL } from "@/lib/wandsGiftBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(WANDS_GIFT_BOARD);
  const status = await pinterestPoolStatus(WANDS_GIFT_BOARD, WANDS_GIFT_TOTAL);
  return Response.json({ ok: true, status });
}
