// Single-image preview for the Collective vs You studio — owner-only.
import { ImageResponse } from "next/og";
import { parseDateSlug } from "@/lib/today";
import { requireStudioOwner } from "@/lib/studioAuth";
import { assembleCollectiveVsYouDay } from "@/lib/collectiveVsYouContent";
import { renderCollectiveVsYou, collectiveVsYouText, WIDTH, HEIGHT } from "@/lib/collectiveVsYouRender";
import { loadShareFonts } from "@/lib/ogFonts";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const owner = await requireStudioOwner();
  if (!owner) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const target = parseDateSlug(searchParams.get("date") ?? "");
  if (!target) return new Response("Bad request", { status: 400 });

  const day = assembleCollectiveVsYouDay(target);
  const fonts = await loadShareFonts(collectiveVsYouText(day));

  return new ImageResponse(renderCollectiveVsYou(day), { width: WIDTH, height: HEIGHT, fonts });
}
