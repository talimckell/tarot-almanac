// Clears usage tracking for the Swords Shadow board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { SWORDS_SHADOW_BOARD, SWORDS_SHADOW_TOTAL } from "@/lib/swordsShadowBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(SWORDS_SHADOW_BOARD);
  const status = await pinterestPoolStatus(SWORDS_SHADOW_BOARD, SWORDS_SHADOW_TOTAL);
  return Response.json({ ok: true, status });
}
