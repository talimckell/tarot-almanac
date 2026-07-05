// Single-pin-image preview for a specific Major — owner-only.
import { ImageResponse } from "next/og";
import { getCardBySlug } from "@/lib/cards";
import { requireStudioOwner } from "@/lib/studioAuth";
import { renderMajorGift, WIDTH, HEIGHT } from "@/lib/majorGiftRender";
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
    "Tarot Card Meaning Upright",
    card.name,
    card.gift.keywords.join(" "),
    "tarotalmanac.com/tarot",
    "The Tarot Almanac",
  ].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(renderMajorGift(card), { width: WIDTH, height: HEIGHT, fonts });
}
