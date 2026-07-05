// Clears usage tracking for the Major Shadow board only. POST since destructive. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetPinterestBoard, pinterestPoolStatus } from "@/lib/pinterestUsage";
import { MAJOR_SHADOW_BOARD, MAJOR_SHADOW_TOTAL } from "@/lib/majorShadowBoard";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetPinterestBoard(MAJOR_SHADOW_BOARD);
  const status = await pinterestPoolStatus(MAJOR_SHADOW_BOARD, MAJOR_SHADOW_TOTAL);
  return Response.json({ ok: true, status });
}
