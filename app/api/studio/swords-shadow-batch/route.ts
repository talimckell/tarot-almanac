// Generates the ZIP for an EXACT set of Swords slugs (already previewed client-side) and, on
// success, marks them used for this board. Owner-only.
import { ImageResponse } from "next/og";
import JSZip from "jszip";
import { getCardBySlug } from "@/lib/cards";
import { requireStudioOwner } from "@/lib/studioAuth";
import { suitShadowCopy } from "@/lib/suitShadowCaption";
import { renderSuitShadow, WIDTH, HEIGHT } from "@/lib/suitShadowRender";
import { loadShareFonts } from "@/lib/ogFonts";
import { markPinterestUsed } from "@/lib/pinterestUsage";
import { SWORDS_SHADOW_BOARD } from "@/lib/swordsShadowBoard";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

const BOARD_NAME = "Tarot Minor Arcana Suit of Swords Shadow Meanings";

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
    .filter((c): c is NonNullable<typeof c> => !!c && c.arcana === "minor" && c.meta.suit === "Swords");
  if (cards.length === 0) return new Response("Bad request", { status: 400 });

  const zip = new JSZip();
  const csvRows = ["Title,Media URL,Pinterest board,Description,Link,Keywords,Filename,Alt Text"];

  for (const card of cards) {
    const filename = `${card.slug}_swords-shadow.png`;
    const copy = suitShadowCopy(card, BOARD_NAME);
    const mediaUrl = `${SITE_URL}/pin/${SWORDS_SHADOW_BOARD}/${card.slug}`;
    const text = [
      "Tarot Card Meaning Shadow",
      card.name,
      card.shadow.keywords.join(" "),
      "tarotalmanac.com/tarot",
      "The Tarot Almanac",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    const image = new ImageResponse(renderSuitShadow(card), { width: WIDTH, height: HEIGHT, fonts });
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

  await markPinterestUsed(SWORDS_SHADOW_BOARD, cards.map((c) => c.slug));

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="pinterest-swords-shadow_${cards.length}pins.zip"`,
    },
  });
}
