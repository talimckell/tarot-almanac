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
  const csvRows = ["Filename,Title,Description,Destination URL,Alt Text"];

  for (const card of cards) {
    const filename = `${card.slug}_major-gift.png`;
    const copy = majorGiftCopy(card);
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
      [csvField(filename), csvField(copy.title), csvField(copy.description), csvField(copy.destinationUrl), csvField(copy.altText)].join(","),
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
