// Manually clears all usage tracking, starting a fresh cycle through all 78 cards.
// POST (not GET) since this is destructive and shouldn't fire from a prefetch/crawler.
// Owner-only.
import { requireStudioOwner } from "@/lib/studioAuth";
import { resetAllUsage, poolStatus } from "@/lib/reclaimedReversals";

export async function POST() {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  await resetAllUsage();
  const status = await poolStatus();
  return Response.json({ ok: true, status });
}
