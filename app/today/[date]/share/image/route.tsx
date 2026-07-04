// The PNG behind /today/[date]/share — a public, unauthenticated asset URL (link
// previews fetch it with no cookies), so it can't lean on a signed-in subscription
// check. It's held to the same window an anonymous visitor gets on the live page
// (today, and anything earlier this month) so it can never be used to scrape a future
// collective reading the subscription is supposed to gate.
import { ImageResponse } from "next/og";
import { parseDateSlug, isDateOpenForViewer, type YMD } from "@/lib/today";
import { collectiveDayCard, personalDayCard, formatLongDate, type DayCard } from "@/lib/almanac";
import { loadShareFonts } from "@/lib/ogFonts";
import { COLORS, elementColor, SharePips, ShareFooter } from "@/lib/shareRender";

export const runtime = "nodejs";

const WIDTH = 1200;
const HEIGHT = 630;

function serverNow(): YMD {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
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

function Column({ label, card }: { label: string; card: DayCard }) {
  const color = elementColor(card.element);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 14 }}>
      <span
        style={{
          fontFamily: "Lato",
          fontSize: 20,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: COLORS.label,
        }}
      >
        {label}
      </span>
      <SharePips card={card} size={30} color={color} />
      <span style={{ fontFamily: "Cormorant", fontSize: 40, color: COLORS.ink }}>{card.minorName}</span>
      <span style={{ fontFamily: "Lato", fontSize: 20, color: COLORS.label }}>
        {card.suit} &middot; {cap(card.element)}
      </span>
    </div>
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

  const cCard = collectiveDayCard(target.y, target.m, target.d);
  const pCard = hasBirthday ? personalDayCard(target.y, target.m, target.d, bm, bd) : null;
  const personalLabel = name ? `${name} today` : "You today";

  const text = [
    dateLabel,
    "The world today",
    cCard.minorName,
    cCard.suit,
    cap(cCard.element),
    pCard ? personalLabel : "Add your birthday to see your own card beside the world's",
    pCard?.minorName ?? "",
    pCard?.suit ?? "",
    pCard ? cap(pCard.element) : "",
    "The Tarot Almanac",
    "Get your own daily reading at tarotalmanac.com",
  ].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(
    (
      <div
        style={{
          width: WIDTH,
          height: HEIGHT,
          display: "flex",
          flexDirection: "column",
          background: COLORS.stone,
          padding: "56px 64px",
        }}
      >
        <div style={{ display: "flex" }}>
          <span style={{ fontFamily: "Cormorant", fontSize: 30, color: COLORS.ink }}>{dateLabel}</span>
        </div>
        <div style={{ display: "flex", flex: 1, alignItems: "center", marginTop: 24 }}>
          <Column label="The world today" card={cCard} />
          <div style={{ display: "flex", width: 1, alignSelf: "stretch", background: COLORS.warmStone, margin: "0 40px" }} />
          {pCard ? (
            <Column label={personalLabel} card={pCard} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, gap: 10 }}>
              <span style={{ fontFamily: "Cormorant", fontSize: 30, color: COLORS.label }}>Add your birthday</span>
              <span style={{ fontFamily: "Lato", fontSize: 18, color: COLORS.label, textAlign: "center" }}>
                to see your own card beside the world&rsquo;s
              </span>
            </div>
          )}
        </div>
        <ShareFooter cta="Get your own daily reading at tarotalmanac.com" />
      </div>
    ),
    { width: WIDTH, height: HEIGHT, fonts },
  );
}
