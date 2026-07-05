// Clears usage tracking for the Pentacles Shadow board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { PENTACLES_SHADOW_BOARD, PENTACLES_SHADOW_TOTAL } from "@/lib/pentaclesShadowBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(PENTACLES_SHADOW_BOARD);
  const status = await pinterestPoolStatus(PENTACLES_SHADOW_BOARD, PENTACLES_SHADOW_TOTAL);
  return Response.json({ ok: true, status });
}
