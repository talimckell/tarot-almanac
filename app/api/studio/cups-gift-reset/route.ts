// Clears usage tracking for the Cups Gift board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { CUPS_GIFT_BOARD, CUPS_GIFT_TOTAL } from "@/lib/cupsGiftBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(CUPS_GIFT_BOARD);
  const status = await pinterestPoolStatus(CUPS_GIFT_BOARD, CUPS_GIFT_TOTAL);
  return Response.json({ ok: true, status });
}
