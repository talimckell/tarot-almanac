// The PNG behind /bearing/[slug]/share. The Bearing is a Major and every Major carries
// an authored first-person affirmation, so this reuses the same featured-card template as
// the today card. Public/unauthenticated: it renders only the Major glyph, its name, and
// its affirmation — the same fixed, birth-derived card that /bearing/[slug] already shows
// openly — so there's nothing gated to leak.
import { ImageResponse } from "next/og";
import { getCardBySlug } from "@/lib/cards";
import { majorGlyphId } from "@/lib/pips";
import { loadShareFonts } from "@/lib/ogFonts";
import { WIDTH, HEIGHT, elementColor, Glyph, ShareCanvas, FeaturedCard } from "@/lib/shareRender";

export const runtime = "nodejs";

// The opening line of the Bearing essay — e.g. "You move with drive." for the Chariot —
// which names the orientation in the reading's own voice, unlike the general affirmation.
function firstSentence(text: string): string {
  const trimmed = text.trim();
  const m = /^.*?[.!?](?=\s|$)/.exec(trimmed);
  return (m ? m[0] : trimmed).trim();
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card || card.majorIndex === undefined || !card.bearingReading) {
    return new Response("Not found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("n")?.trim().slice(0, 40) || undefined;
  const eyebrow = name ? `${name}'s Bearing` : "Bearing";
  const opening = firstSentence(card.bearingReading);
  const color = elementColor(card.element);

  const text = [eyebrow, card.name, opening, "The Tarot Almanac", "Find your Bearing at tarotalmanac.com"].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(
    (
      <ShareCanvas cta="Find your Bearing at tarotalmanac.com">
        <FeaturedCard
          eyebrow={eyebrow}
          glyph={<Glyph id={majorGlyphId(card.majorIndex)} size={104} color={color} />}
          title={card.name}
          body={opening}
        />
      </ShareCanvas>
    ),
    { width: WIDTH, height: HEIGHT, fonts },
  );
}
