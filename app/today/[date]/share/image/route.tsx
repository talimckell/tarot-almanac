// The PNG behind /today/[date]/share — a public, unauthenticated asset URL (link
// previews fetch it with no cookies), so it can't lean on a signed-in subscription
// check. It's held to the same window an anonymous visitor gets on the live page
// (today, and anything earlier this month) so it can never be used to scrape a future
// collective reading the subscription is supposed to gate.
import { ImageResponse } from "next/og";
import { parseDateSlug, isDateOpenForViewer, type YMD } from "@/lib/today";
import { collectiveDayCard, personalDayCard, formatLongDate, type DayCard } from "@/lib/almanac";
import { getCardBySlug } from "@/lib/cards";
import { loadShareFonts } from "@/lib/ogFonts";
import { WIDTH, HEIGHT, COLORS, elementColor, SharePips, ShareCanvas, FeaturedCard } from "@/lib/shareRender";

export const runtime = "nodejs";

function serverNow(): YMD {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
}

function minorSlug(card: DayCard): string {
  return `${card.rankName.toLowerCase()}-of-${card.suit.toLowerCase()}`;
}

// The card's authored first-person affirmation (the "gift"/upright one) — the piece a
// person would actually want to post. Every minor carries one; fall back to the neutral
// essence if the data ever changes shape. This is wired-up authored copy, not new prose.
function cardAffirmation(card: DayCard): string {
  const c = getCardBySlug(minorSlug(card));
  return c?.gift.affirmation ?? c?.essence ?? "";
}

async function lockedImage(dateLabel: string): Promise<ImageResponse> {
  const fonts = await loadShareFonts(`${dateLabel} This date is not open yet The Tarot Almanac`);
  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.stone,
        }}
      >
        <span style={{ fontFamily: "Cormorant", fontSize: 44, color: COLORS.ink }}>{dateLabel}</span>
        <span style={{ marginTop: 16, fontFamily: "Lato", fontSize: 22, color: COLORS.label }}>
          This date isn&rsquo;t open yet.
        </span>
      </div>
    ),
    { width: WIDTH, height: HEIGHT, fonts },
  );
}

export async function GET(request: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const target = parseDateSlug(date);
  if (!target) return new Response("Not found", { status: 404 });

  const { searchParams } = new URL(request.url);
  const bm = Number(searchParams.get("bm"));
  const bd = Number(searchParams.get("bd"));
  const name = searchParams.get("n")?.trim().slice(0, 40) || undefined;
  const hasBirthday = Number.isInteger(bm) && Number.isInteger(bd) && bm >= 1 && bm <= 12 && bd >= 1 && bd <= 31;

  const now = serverNow();
  const dateLabel = formatLongDate(target.y, target.m, target.d);

  if (!isDateOpenForViewer(target, now, false)) {
    return lockedImage(dateLabel);
  }

  // One featured card: your card when a birthday is given, otherwise the day's
  // collective card framed as "Today's card." The affirmation reads first-person
  // either way, so a single card avoids attributing an "I can..." line to "the world."
  const card = hasBirthday
    ? personalDayCard(target.y, target.m, target.d, bm, bd)
    : collectiveDayCard(target.y, target.m, target.d);
  const label = hasBirthday ? (name ? `${name}'s card` : "Your card") : "Today's card";
  const affirmation = cardAffirmation(card);
  const color = elementColor(card.element);

  const text = [dateLabel, label, card.minorName, affirmation, "The Tarot Almanac", "Get your own at tarotalmanac.com"].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(
    (
      <ShareCanvas footerLeft={dateLabel} cta="Get your own at tarotalmanac.com">
        <FeaturedCard
          eyebrow={label}
          glyph={<SharePips card={card} size={46} color={color} />}
          title={card.minorName}
          body={affirmation}
        />
      </ShareCanvas>
    ),
    { width: WIDTH, height: HEIGHT, fonts },
  );
}
