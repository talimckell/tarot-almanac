// The PNG behind /me/reading/[month]/share. Public/unauthenticated (link previews fetch
// it with no cookies), so the birthday travels as query params, same as the today card.
// It renders only the Personal Month Major glyph + name + affirmation — deterministic,
// birth-derived, authored copy — NOT the subscriber-only AI-woven monthly reading, so it
// leaks nothing gated. That's also why it needn't be date-gated the way today's card is.
import { ImageResponse } from "next/og";
import { parseMonthSlug, formatMonthLabel } from "@/lib/today";
import { personalMonth, MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR } from "@/lib/almanac";
import { getCardBySlug } from "@/lib/cards";
import { majorGlyphId } from "@/lib/pips";
import { loadShareFonts } from "@/lib/ogFonts";
import { WIDTH, HEIGHT, elementColor, Glyph, ShareCanvas, FeaturedCard } from "@/lib/shareRender";

export const runtime = "nodejs";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export async function GET(request: Request, { params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const target = parseMonthSlug(month);
  if (!target) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const bm = Number(searchParams.get("bm"));
  const bd = Number(searchParams.get("bd"));
  const name = searchParams.get("n")?.trim().slice(0, 40) || undefined;
  const hasBirthday = Number.isInteger(bm) && Number.isInteger(bd) && bm >= 1 && bm <= 12 && bd >= 1 && bd <= 31;
  if (!hasBirthday) return new Response("Birthday required", { status: 400 });

  const major = personalMonth(target.y, target.m, bm, bd);
  const monthName = MONTH_NAMES[target.m - 1];
  const monthLabel = formatMonthLabel(target);
  const eyebrow = name ? `${name}'s card for ${monthName}` : `Your card for ${monthName}`;
  const card = getCardBySlug(MAJOR_SLUGS[major]);
  const affirmation = card?.gift.affirmation ?? "";
  const color = elementColor(ELEMENT_BY_MAJOR[major]);

  const text = [eyebrow, monthLabel, MAJORS[major], affirmation, "The Tarot Almanac", "See your month at tarotalmanac.com"].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(
    (
      <ShareCanvas footerLeft={monthLabel} cta="See your month at tarotalmanac.com">
        <FeaturedCard
          eyebrow={eyebrow}
          glyph={<Glyph id={majorGlyphId(major)} size={104} color={color} />}
          title={MAJORS[major]}
          body={affirmation}
        />
      </ShareCanvas>
    ),
    { width: WIDTH, height: HEIGHT, fonts },
  );
}
