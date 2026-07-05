// Clears usage tracking for the Major Reclaimed board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { MAJOR_RECLAIMED_BOARD, MAJOR_RECLAIMED_TOTAL } from "@/lib/majorReclaimedBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(MAJOR_RECLAIMED_BOARD);
  const status = await pinterestPoolStatus(MAJOR_RECLAIMED_BOARD, MAJOR_RECLAIMED_TOTAL);
  return Response.json({ ok: true, status });
}
