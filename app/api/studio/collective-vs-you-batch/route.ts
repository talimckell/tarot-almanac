// Batch ZIP export for the Collective vs You campaign — one image per date (the daily
// Substack Note) plus a combined captions.txt. Owner-only.
import { ImageResponse } from "next/og";
import JSZip from "jszip";
import { parseDateSlug, addDays, formatDateSlug } from "@/lib/today";
import { requireStudioOwner } from "@/lib/studioAuth";
import { assembleCollectiveVsYouDay } from "@/lib/collectiveVsYouContent";
import { captionForCollectiveVsYou } from "@/lib/collectiveVsYouCaption";
import { renderCollectiveVsYou, collectiveVsYouText, WIDTH, HEIGHT } from "@/lib/collectiveVsYouRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

const MAX_COUNT = 60;

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const start = parseDateSlug(searchParams.get("start") ?? "");
  const count = Number(searchParams.get("count"));
  if (!start || !Number.isInteger(count) || count < 1 || count > MAX_COUNT) {
    return new Response("Bad request", { status: 400 });
  }

  const zip = new JSZip();
  const captionLines: string[] = [];

  for (let i = 0; i < count; i++) {
    const date = addDays(start, i);
    const day = assembleCollectiveVsYouDay(date);
    const filename = `${formatDateSlug(date)}_collective-vs-you_${day.card.majorName.toLowerCase().replace(/[^a-z]+/g, "-").replace(/^-|-$/g, "")}.png`;

    const fonts = await loadShareFonts(collectiveVsYouText(day));
    const image = new ImageResponse(renderCollectiveVsYou(day), { width: WIDTH, height: HEIGHT, fonts });
    const buffer = Buffer.from(await image.arrayBuffer());
    zip.file(filename, buffer);

    captionLines.push(`${filename}\n${captionForCollectiveVsYou(day)}\n`);
  }

  zip.file("captions.txt", captionLines.join("\n---\n\n"));

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  const zipName = `tarot-collective-vs-you_${formatDateSlug(start)}_${count}days.zip`;

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${zipName}"`,
    },
  });
}
