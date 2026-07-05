// Clears usage tracking for the Major Gift board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { MAJOR_GIFT_BOARD, MAJOR_GIFT_TOTAL } from "@/lib/majorGiftBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(MAJOR_GIFT_BOARD);
  const status = await pinterestPoolStatus(MAJOR_GIFT_BOARD, MAJOR_GIFT_TOTAL);
  return Response.json({ ok: true, status });
}
