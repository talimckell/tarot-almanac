// Clears usage tracking for the Wands Shadow board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { WANDS_SHADOW_BOARD, WANDS_SHADOW_TOTAL } from "@/lib/wandsShadowBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(WANDS_SHADOW_BOARD);
  const status = await pinterestPoolStatus(WANDS_SHADOW_BOARD, WANDS_SHADOW_TOTAL);
  return Response.json({ ok: true, status });
}
