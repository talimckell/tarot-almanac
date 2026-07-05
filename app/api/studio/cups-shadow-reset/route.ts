// Clears usage tracking for the Cups Shadow board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { CUPS_SHADOW_BOARD, CUPS_SHADOW_TOTAL } from "@/lib/cupsShadowBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(CUPS_SHADOW_BOARD);
  const status = await pinterestPoolStatus(CUPS_SHADOW_BOARD, CUPS_SHADOW_TOTAL);
  return Response.json({ ok: true, status });
}
