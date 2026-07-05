// Clears usage tracking for the Cups Reclaimed board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { CUPS_RECLAIMED_BOARD, CUPS_RECLAIMED_TOTAL } from "@/lib/cupsReclaimedBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(CUPS_RECLAIMED_BOARD);
  const status = await pinterestPoolStatus(CUPS_RECLAIMED_BOARD, CUPS_RECLAIMED_TOTAL);
  return Response.json({ ok: true, status });
}
