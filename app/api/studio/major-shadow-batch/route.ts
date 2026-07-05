// Generates the ZIP for an EXACT set of Major slugs (already previewed client-side) and,
// on success, marks them used for this board. Owner-only.
import { ImageResponse } from "next/og";
import JSZip from "jszip";
import { getCardBySlug } from "@/lib/cards";
import { requireStudioOwner } from "@/lib/studioAuth";
import { majorShadowCopy } from "@/lib/majorShadowCaption";
import { renderMajorShadow, WIDTH, HEIGHT } from "@/lib/majorShadowRender";
import { loadShareFonts } from "@/lib/ogFonts";
import { markPinterestUsed } from "@/lib/pinterestUsage";
import { MAJOR_SHADOW_BOARD } from "@/lib/majorShadowBoard";
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
  const csvRows = ["Filename,Title,Description,Destination URL,Alt Text,Image URL"];

  for (const card of cards) {
    const filename = `${card.slug}_major-shadow.png`;
    const copy = majorShadowCopy(card);
    // The public, unauthenticated counterpart to this same render — Pinterest's bulk
    // uploader needs a real fetchable URL, and the studio's own routes are owner-gated.
    const imageUrl = `${SITE_URL}/pin/${MAJOR_SHADOW_BOARD}/${card.slug}`;
    const text = [
      "Tarot Card Meaning Shadow",
      card.name,
      card.shadow.keywords.join(" "),
      "tarotalmanac.com/tarot",
      "The Tarot Almanac",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    const image = new ImageResponse(renderMajorShadow(card), { width: WIDTH, height: HEIGHT, fonts });
    const buffer = Buffer.from(await image.arrayBuffer());
    zip.file(filename, buffer);

    csvRows.push(
      [csvField(filename), csvField(copy.title), csvField(copy.description), csvField(copy.destinationUrl), csvField(copy.altText), csvField(imageUrl)].join(","),
    );
  }

  zip.file("pins.csv", csvRows.join("\n"));
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  await markPinterestUsed(MAJOR_SHADOW_BOARD, cards.map((c) => c.slug));

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="pinterest-major-shadow_${cards.length}pins.zip"`,
    },
  });
}
