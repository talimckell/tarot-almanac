// The year-wheel share image: the full 22-Major cycle with the twelve months lit and the
// year card marked. Public and free-tier-safe (it shows structure and glyphs, never the
// paid reading text), so the birthday travels as query params like the chart share image.
import { ImageResponse } from "next/og";
import { MAJORS } from "@/lib/almanac";
import { yearCardIndex, yearMonths } from "@/lib/yearCard";
import { loadShareFonts } from "@/lib/ogFonts";
import { WIDTH, HEIGHT, COLORS, ShareCanvas } from "@/lib/shareRender";
import { YearWheel } from "@/lib/yearWheelRender";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bm = Number(searchParams.get("bm"));
  const bd = Number(searchParams.get("bd"));
  const y = Number(searchParams.get("y"));
  const name = searchParams.get("n")?.trim().slice(0, 32) || undefined;

  const valid =
    Number.isInteger(bm) && bm >= 1 && bm <= 12 &&
    Number.isInteger(bd) && bd >= 1 && bd <= 31 &&
    Number.isInteger(y) && y > 1000 && y < 3000;
  if (!valid) return new Response("Birthday and year required", { status: 400 });

  const yearCardIdx = yearCardIndex(y, bm, bd);
  const monthIndices = yearMonths(yearCardIdx);
  const yearCardName = MAJORS[yearCardIdx];
  const eyebrow = name ? `${name}'s ${y}` : `${y}`;

  const text = [eyebrow, yearCardName, "YEAR CARD", "The Tarot Almanac", "Find yours at tarotalmanac.com"].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(
    (
      <ShareCanvas footerLeft={eyebrow} cta="Find yours at tarotalmanac.com">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center" }}>
          <span
            style={{
              display: "flex",
              fontFamily: "Lato",
              fontSize: 24,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: COLORS.label,
              marginBottom: 10,
            }}
          >
            {eyebrow}
          </span>
          <YearWheel
            yearCardIdx={yearCardIdx}
            monthIndices={monthIndices}
            centerTitle={yearCardName}
            centerSub="Year Card"
          />
        </div>
      </ShareCanvas>
    ),
    { width: WIDTH, height: HEIGHT, fonts },
  );
}
