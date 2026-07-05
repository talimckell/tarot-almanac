// Generates the ZIP for an EXACT set of Major slugs (already previewed client-side) and,
// on success, marks them used for this board. Owner-only.
import { ImageResponse } from "next/og";
import JSZip from "jszip";
import { getCardBySlug } from "@/lib/cards";
import { requireStudioOwner } from "@/lib/studioAuth";
import { majorGiftCopy } from "@/lib/majorGiftCaption";
import { renderMajorGift, WIDTH, HEIGHT } from "@/lib/majorGiftRender";
import { loadShareFonts } from "@/lib/ogFonts";
import { markPinterestUsed } from "@/lib/pinterestUsage";
import { MAJOR_GIFT_BOARD } from "@/lib/majorGiftBoard";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const slugs = (searchParams.get("slugs") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const cards = slugs.map(getCardBySlug).filter((c): c is NonNullable<typeof c> => !!c && c.arcana === "major");
  if (cards.length === 0) return new Response("Bad request", { status: 400 });

  const zip = new JSZip();
  // Column order/names match Pinterest's own official bulk-upload sample CSV exactly
  // (help.pinterest.com/sub/helpcenter/assets/pinterest-bulk-upload-sample.csv), verified
  // rather than assumed. Filename/Alt Text trail as extras for the owner's own reference —
  // they aren't part of Pinterest's spec, so harmless if the importer ignores them.
  const csvRows = ["Title,Media URL,Pinterest board,Description,Link,Keywords,Filename,Alt Text"];

  for (const card of cards) {
    const filename = `${card.slug}_major-gift.png`;
    const copy = majorGiftCopy(card);
    // The public, unauthenticated counterpart to this same render — Pinterest's bulk
    // uploader needs a real fetchable URL, and the studio's own routes are owner-gated.
    const mediaUrl = `${SITE_URL}/pin/${MAJOR_GIFT_BOARD}/${card.slug}`;
    const text = [
      "Tarot Card Meaning Upright",
      card.name,
      card.gift.keywords.join(" "),
      "tarotalmanac.com/tarot",
      "The Tarot Almanac",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    const image = new ImageResponse(renderMajorGift(card), { width: WIDTH, height: HEIGHT, fonts });
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

  await markPinterestUsed(MAJOR_GIFT_BOARD, cards.map((c) => c.slug));

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="pinterest-major-gift_${cards.length}pins.zip"`,
    },
  });
}
