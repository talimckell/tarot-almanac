// Single-pin-image preview for a specific Swords card's shadow meaning — owner-only.
import { ImageResponse } from "next/og";
import { getCardBySlug } from "@/lib/cards";
import { requireStudioOwner } from "@/lib/studioAuth";
import { renderSuitShadow, WIDTH, HEIGHT } from "@/lib/suitShadowRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const card = getCardBySlug(slug);
  if (!card || card.arcana !== "minor" || card.meta.suit !== "Swords") return new Response("Not found", { status: 404 });

  const text = [
    "Tarot Card Meaning Shadow",
    card.name,
    card.shadow.keywords.join(" "),
    "tarotalmanac.com/tarot",
    "The Tarot Almanac",
  ].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(renderSuitShadow(card), { width: WIDTH, height: HEIGHT, fonts });
}
