// Generates the ZIP for an EXACT set of slugs (the batch already previewed client-side —
// this route never re-randomizes) and, on success, marks those slugs used. This is the
// only place usage gets written, matching the owner's call that idle previewing/rerolling
// should cost nothing; only an actual download commits the pool. Owner-only.
import { ImageResponse } from "next/og";
import JSZip from "jszip";
import { requireStudioOwner } from "@/lib/studioAuth";
import { getCardBySlugStrict, markUsed } from "@/lib/reclaimedReversals";
import { captionForReclaimedReversal } from "@/lib/reclaimedReversalCaption";
import { renderReclaimedReversal, WIDTH, HEIGHT } from "@/lib/reclaimedReversalRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const raw = (searchParams.get("slugs") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const cards = raw.map(getCardBySlugStrict).filter((c): c is NonNullable<typeof c> => !!c);
  if (cards.length === 0) return new Response("Bad request", { status: 400 });

  const zip = new JSZip();
  const captionLines: string[] = [];

  for (const card of cards) {
    const filename = `${card.slug}_reversed.png`;
    const text = [
      "Reclaimed Reversal",
      `${card.name} Reversed`,
      card.reclaiming.keywords.join(" "),
      "tarotalmanac.com/tarot",
      "The Tarot Almanac",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    const image = new ImageResponse(renderReclaimedReversal(card), { width: WIDTH, height: HEIGHT, fonts });
    const buffer = Buffer.from(await image.arrayBuffer());
    zip.file(filename, buffer);
    captionLines.push(`${filename}\n${captionForReclaimedReversal(card)}\n`);
  }

  zip.file("captions.txt", captionLines.join("\n---\n\n"));
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  await markUsed(cards.map((c) => c.slug));

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="tarot-reclaimed-reversals_${cards.length}cards.zip"`,
    },
  });
}
