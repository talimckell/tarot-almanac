// Generates the ZIP for an EXACT set of birthdays (already previewed client-side — this
// route never re-walks/re-randomizes) and, on success, marks those birthday slugs used
// for this board. Exports a CSV (not a flat captions.txt like the Bluesky campaigns) since
// Pinterest copy is genuinely multi-field — title, description, destination URL, alt text
// — matching Pinterest's own bulk-pin-upload column shape. Owner-only.
import { ImageResponse } from "next/og";
import JSZip from "jszip";
import { parseDateSlug, formatDateSlug } from "@/lib/today";
import { birthdaySlug } from "@/lib/birthday";
import { requireStudioOwner } from "@/lib/studioAuth";
import { assembleBirthdayBearingDay } from "@/lib/birthdayCampaignContent";
import { pinterestBirthdayCopy } from "@/lib/pinterestBirthdayCaption";
import { renderPinterestBirthday, WIDTH, HEIGHT } from "@/lib/pinterestBirthdayRender";
import { loadShareFonts } from "@/lib/ogFonts";
import { markPinterestUsed } from "@/lib/pinterestUsage";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

const BOARD = "birthday-tarot-card";

function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const dateSlugs = (searchParams.get("dates") ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const targets = dateSlugs.map(parseDateSlug).filter((t): t is NonNullable<typeof t> => !!t);
  if (targets.length === 0) return new Response("Bad request", { status: 400 });

  const zip = new JSZip();
  const csvRows = ["Filename,Title,Description,Destination URL,Alt Text,Image URL"];
  const usedSlugs: string[] = [];

  for (const target of targets) {
    const day = assembleBirthdayBearingDay(target);
    const slug = birthdaySlug(day.m, day.d);
    const filename = `${slug}_birthday-tarot-card.png`;
    const copy = pinterestBirthdayCopy(day);
    // The public, unauthenticated counterpart to this same render — Pinterest's bulk
    // uploader needs a real fetchable URL, and the studio's own routes are owner-gated.
    const imageUrl = `${SITE_URL}/pin/${BOARD}/${slug}`;

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
    const image = new ImageResponse(renderPinterestBirthday(day), { width: WIDTH, height: HEIGHT, fonts });
    const buffer = Buffer.from(await image.arrayBuffer());
    zip.file(filename, buffer);

    csvRows.push(
      [csvField(filename), csvField(copy.title), csvField(copy.description), csvField(copy.destinationUrl), csvField(copy.altText), csvField(imageUrl)].join(","),
    );
    usedSlugs.push(slug);
  }

  zip.file("pins.csv", csvRows.join("\n"));
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  await markPinterestUsed(BOARD, usedSlugs);

  return new Response(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="pinterest-birthday-tarot-card_${formatDateSlug(targets[0])}_${targets.length}pins.zip"`,
    },
  });
}
