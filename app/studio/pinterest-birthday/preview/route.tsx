// Single-pin-image preview — owner-only.
import { ImageResponse } from "next/og";
import { parseDateSlug } from "@/lib/today";
import { requireStudioOwner } from "@/lib/studioAuth";
import { assembleBirthdayBearingDay } from "@/lib/birthdayCampaignContent";
import { renderPinterestBirthday, WIDTH, HEIGHT } from "@/lib/pinterestBirthdayRender";
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
    `If your birthday is ${day.dateLabel}`,
    "Your Tarot Bearing Card is",
    day.bearingName,
    day.opening,
    `Everyone born on ${day.dateLabel} shares this Tarot Bearing.`,
    "The Tarot Almanac",
    "tarotalmanac.com/birthday",
  ].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(renderPinterestBirthday(day), { width: WIDTH, height: HEIGHT, fonts });
}
