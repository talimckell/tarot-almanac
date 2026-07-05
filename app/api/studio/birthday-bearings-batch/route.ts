// Batch ZIP export for the Birthday Bearings campaign — one image per calendar day (the
// Bearing depends only on month+day, so this recurs forever) plus a combined captions.txt.
// Owner-only.
import { ImageResponse } from "next/og";
import JSZip from "jszip";
import { parseDateSlug, addDays, formatDateSlug } from "@/lib/today";
import { requireStudioOwner } from "@/lib/studioAuth";
import { assembleBirthdayBearingDay } from "@/lib/birthdayCampaignContent";
import { captionForBirthdayBearing } from "@/lib/birthdayCampaignCaption";
import { renderBirthdayBearing, WIDTH, HEIGHT } from "@/lib/birthdayCampaignRender";
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
    const day = assembleBirthdayBearingDay(date);
    const filename = `${formatDateSlug(date)}_birthday-bearing_${day.slug}.png`;

    const text = [
      "Born today?",
      day.dateLabel,
      `Your Bearing is ${day.bearingName}`,
      day.opening,
      "Everyone born today shares this card. Find out what it means.",
      "The Tarot Almanac",
      "tarotalmanac.com/birthday",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    const image = new ImageResponse(renderBirthdayBearing(day), { width: WIDTH, height: HEIGHT, fonts });
    const buffer = Buffer.from(await image.arrayBuffer());
    zip.file(filename, buffer);

    captionLines.push(`${filename}\n${captionForBirthdayBearing(day)}\n`);
  }

  zip.file("captions.txt", captionLines.join("\n---\n\n"));

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  const zipName = `tarot-birthday-bearings_${formatDateSlug(start)}_${count}days.zip`;

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${zipName}"`,
    },
  });
}
