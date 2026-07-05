// Generates the ZIP for an EXACT set of Pentacles slugs (already previewed client-side) and,
// on success, marks them used for this board. Owner-only.
import { ImageResponse } from "next/og";
import JSZip from "jszip";
import { getCardBySlug } from "@/lib/cards";
import { requireStudioOwner } from "@/lib/studioAuth";
import { suitGiftCopy } from "@/lib/suitGiftCaption";
import { renderSuitGift, WIDTH, HEIGHT } from "@/lib/suitGiftRender";
import { loadShareFonts } from "@/lib/ogFonts";
import { markPinterestUsed } from "@/lib/pinterestUsage";
import { PENTACLES_GIFT_BOARD } from "@/lib/pentaclesGiftBoard";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

const BOARD_NAME = "Tarot Minor Arcana Suit of Pentacles Gift Meanings";

function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const slugs = (searchParams.get("slugs") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const cards = slugs
    .map(getCardBySlug)
    .filter((c): c is NonNullable<typeof c> => !!c && c.arcana === "minor" && c.meta.suit === "Pentacles");
  if (cards.length === 0) return new Response("Bad request", { status: 400 });

  const zip = new JSZip();
  const csvRows = ["Title,Media URL,Pinterest board,Description,Link,Keywords,Filename,Alt Text"];

  for (const card of cards) {
    const filename = `${card.slug}_pentacles-gift.png`;
    const copy = suitGiftCopy(card, BOARD_NAME);
    const mediaUrl = `${SITE_URL}/pin/${PENTACLES_GIFT_BOARD}/${card.slug}`;
    const text = [
      "Tarot Card Meaning Upright",
      card.name,
      card.gift.keywords.join(" "),
      "tarotalmanac.com/tarot",
      "The Tarot Almanac",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    const image = new ImageResponse(renderSuitGift(card), { width: WIDTH, height: HEIGHT, fonts });
    const buffer = Buffer.from(await image.arrayBuffer());
    zip.file(filename, buffer);

    csvRows.push(
      [
        csvField(copy.title),
        csvField(mediaUrl),
        csvField(copy.boardName),
        csvField(copy.description),
        csvField(copy.destinationUrl),
        csvField(copy.keywords),
        csvField(filename),
        csvField(copy.altText),
      ].join(","),
    );
  }

  zip.file("pins.csv", csvRows.join("\n"));
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  await markPinterestUsed(PENTACLES_GIFT_BOARD, cards.map((c) => c.slug));

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="pinterest-pentacles-gift_${cards.length}pins.zip"`,
    },
  });
}
