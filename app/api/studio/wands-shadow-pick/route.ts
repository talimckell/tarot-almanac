// Returns the next N Wands ranks (canonical order) not yet generated for this board — zero
// side effects, safe to call repeatedly. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { pickNextUnusedWandsShadow, WANDS_SHADOW_BOARD, WANDS_SHADOW_TOTAL } from "@/lib/wandsShadowBoard";
import { pinterestPoolStatus } from "@/lib/pinterestUsage";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const count = Number(searchParams.get("count"));
  if (!Number.isInteger(count) || count < 1 || count > WANDS_SHADOW_TOTAL) {
    return new Response("Bad request", { status: 400 });
  }

  const [slugs, status] = await Promise.all([
    pickNextUnusedWandsShadow(count),
    pinterestPoolStatus(WANDS_SHADOW_BOARD, WANDS_SHADOW_TOTAL),
  ]);
  return Response.json({ slugs, status });
}
