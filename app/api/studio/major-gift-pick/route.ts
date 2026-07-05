// Returns the next N Majors (in canonical order) not yet generated for this board — zero
// side effects, safe to call repeatedly. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { pickNextUnusedMajors, MAJOR_GIFT_BOARD, MAJOR_GIFT_TOTAL } from "@/lib/majorGiftBoard";
import { pinterestPoolStatus } from "@/lib/pinterestUsage";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const count = Number(searchParams.get("count"));
  if (!Number.isInteger(count) || count < 1 || count > 22) {
    return new Response("Bad request", { status: 400 });
  }

  const [slugs, status] = await Promise.all([
    pickNextUnusedMajors(count),
    pinterestPoolStatus(MAJOR_GIFT_BOARD, MAJOR_GIFT_TOTAL),
  ]);
  return Response.json({ slugs, status });
}
