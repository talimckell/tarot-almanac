// Single-image preview for the collective-campaign studio — owner-only (this exists to
// let Tali preview a day/treatment combo before batching, and to serve the live preview
// grid in the studio UI), not a public share asset like app/today/[date]/share.
import { ImageResponse } from "next/og";
import { parseDateSlug } from "@/lib/today";
import { requireStudioOwner } from "@/lib/studioAuth";
import { assembleCampaignDay } from "@/lib/campaignContent";
import { renderCampaignTreatment, WIDTH, HEIGHT } from "@/lib/campaignRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const target = parseDateSlug(searchParams.get("date") ?? "");
  const treatment = Number(searchParams.get("treatment"));
  if (!target || !Number.isInteger(treatment) || treatment < 0 || treatment > 3) {
    return new Response("Bad request", { status: 400 });
  }

  const day = assembleCampaignDay(target);
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

  return new ImageResponse(renderCampaignTreatment(day, treatment), { width: WIDTH, height: HEIGHT, fonts });
}
