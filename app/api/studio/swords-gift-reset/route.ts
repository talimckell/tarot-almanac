// Clears usage tracking for the Swords Gift board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { SWORDS_GIFT_BOARD, SWORDS_GIFT_TOTAL } from "@/lib/swordsGiftBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(SWORDS_GIFT_BOARD);
  const status = await pinterestPoolStatus(SWORDS_GIFT_BOARD, SWORDS_GIFT_TOTAL);
  return Response.json({ ok: true, status });
}
