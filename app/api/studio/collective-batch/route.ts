// Generates a batch of collective-card social images (rotating through the four
// treatments) plus one combined captions file, zipped for a single download. Owner-only —
// this produces real branded marketing assets, not something any signed-in account
// should be able to trigger.
import { ImageResponse } from "next/og";
import JSZip from "jszip";
import { parseDateSlug, addDays, formatDateSlug } from "@/lib/today";
import { requireStudioOwner } from "@/lib/studioAuth";
import { assembleCampaignDay } from "@/lib/campaignContent";
import { captionForTreatment } from "@/lib/campaignCaption";
import { renderCampaignTreatment, TREATMENT_COUNT, TREATMENT_NAMES, WIDTH, HEIGHT } from "@/lib/campaignRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

const MAX_COUNT = 60; // a generous couple of months in one batch; guards against abuse/timeouts

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
    const treatment = i % TREATMENT_COUNT;
    const day = assembleCampaignDay(date);
    const slug = formatDateSlug(date);
    const treatmentName = TREATMENT_NAMES[treatment];
    const filename = `${slug}_${treatmentName}.png`;

    const text = [
      day.dateLabel,
      day.card.minorName,
      day.essence,
      day.affirmation,
      day.keywords.join(" "),
      day.collectiveLine,
      "Today's card The card of the day The Tarot Almanac Find your personal card today at tarotalmanac.com/today",
    ].join(" ");
    const fonts = await loadShareFonts(text);
    const image = new ImageResponse(renderCampaignTreatment(day, treatment), { width: WIDTH, height: HEIGHT, fonts });
    const buffer = Buffer.from(await image.arrayBuffer());
    zip.file(filename, buffer);

    captionLines.push(`${filename}\n${captionForTreatment(day, treatment)}\n`);
  }

  zip.file("captions.txt", captionLines.join("\n---\n\n"));

  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
  const zipName = `tarot-collective_${formatDateSlug(start)}_${count}days.zip`;

  // Response's BodyInit type doesn't accept Node's Buffer directly (even though it works
  // fine at runtime) — an explicit Uint8Array view satisfies the type checker.
  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${zipName}"`,
    },
  });
}
