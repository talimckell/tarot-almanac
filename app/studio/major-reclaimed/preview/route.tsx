// Single-pin-image preview for a specific Major's reclaimed reversal meaning — owner-only.
import { ImageResponse } from "next/og";
import { getCardBySlug } from "@/lib/cards";
import { requireStudioOwner } from "@/lib/studioAuth";
import { renderMajorReclaimed, WIDTH, HEIGHT } from "@/lib/majorReclaimedRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const card = getCardBySlug(slug);
  if (!card || card.arcana !== "major") return new Response("Not found", { status: 404 });

  const text = [
    "Tarot Card Meaning Reclaimed Reversal",
    card.name,
    card.reclaiming.keywords.join(" "),
    "tarotalmanac.com/tarot",
    "The Tarot Almanac",
  ].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(renderMajorReclaimed(card), { width: WIDTH, height: HEIGHT, fonts });
}
