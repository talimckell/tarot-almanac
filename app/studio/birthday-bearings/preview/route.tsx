// Single-image preview for the Birthday Bearings studio — owner-only.
import { ImageResponse } from "next/og";
import { parseDateSlug } from "@/lib/today";
import { requireStudioOwner } from "@/lib/studioAuth";
import { assembleBirthdayBearingDay } from "@/lib/birthdayCampaignContent";
import { renderBirthdayBearing, WIDTH, HEIGHT } from "@/lib/birthdayCampaignRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const target = parseDateSlug(searchParams.get("date") ?? "");
  if (!target) return new Response("Bad request", { status: 400 });

  const day = assembleBirthdayBearingDay(target);
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

  return new ImageResponse(renderBirthdayBearing(day), { width: WIDTH, height: HEIGHT, fonts });
}
