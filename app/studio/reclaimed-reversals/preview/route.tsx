// Single-image preview for a specific card — owner-only.
import { ImageResponse } from "next/og";
import { requireStudioOwner } from "@/lib/studioAuth";
import { getCardBySlugStrict } from "@/lib/reclaimedReversals";
import { renderReclaimedReversal, WIDTH, HEIGHT } from "@/lib/reclaimedReversalRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const card = getCardBySlugStrict(slug);
  if (!card) return new Response("Not found", { status: 404 });

  const text = [
    "Reclaimed Reversal",
    `${card.name} Reversed`,
    card.reclaiming.keywords.join(" "),
    "tarotalmanac.com/tarot",
    "The Tarot Almanac",
  ].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(renderReclaimedReversal(card), { width: WIDTH, height: HEIGHT, fonts });
}
