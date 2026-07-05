// A fresh random pick of unused cards — no side effects, safe to call repeatedly to
// reroll a batch before committing to it. Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { pickRandomUnused, poolStatus } from "@/lib/reclaimedReversals";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const count = Number(searchParams.get("count"));
  if (!Number.isInteger(count) || count < 1 || count > 30) {
    return new Response("Bad request", { status: 400 });
  }

  const [cards, status] = await Promise.all([pickRandomUnused(count), poolStatus()]);
  return Response.json({ slugs: cards.map((c) => c.slug), status });
}
