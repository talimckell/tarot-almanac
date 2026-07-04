// The PNG behind /chart/share. Public/unauthenticated: the birth date travels as query
// params and the image shows exactly what the free chart preview shows — all seven
// positions as GLYPHS, but a NAME only for the Bearing. The six other positions are glyph
// + position label, no name, so the paid reading's card identities never leak (matches
// the /chart and /gift preview rule in CLAUDE.md).
import { ImageResponse } from "next/og";
import { computeNatalChart, type NatalChart } from "@/lib/natalChart";
import { formatLongDate, type DayCard } from "@/lib/almanac";
import type { MajorPosition } from "@/lib/natalChart";
import { majorGlyphId } from "@/lib/pips";
import { loadShareFonts } from "@/lib/ogFonts";
import { WIDTH, HEIGHT, COLORS, elementColor, Glyph, SharePips, ShareCanvas } from "@/lib/shareRender";

export const runtime = "nodejs";

const ROW_W = 660;
const LABEL_W = 120;

function MajorMark({ pos, size }: { pos: MajorPosition; size: number }) {
  return <Glyph id={majorGlyphId(pos.major)} size={size} color={elementColor(pos.element)} />;
}

function Cell({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>{children}</div>;
}

function Row({ label, left, right }: { label: string; left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", width: ROW_W }}>
      <span
        style={{
          display: "flex",
          width: LABEL_W,
          fontFamily: "Lato",
          fontSize: 20,
          letterSpacing: 1,
          textTransform: "uppercase",
          color: COLORS.label,
        }}
      >
        {label}
      </span>
      <Cell>{left}</Cell>
      <Cell>{right}</Cell>
    </div>
  );
}

function colHead(text: string) {
  return (
    <span style={{ fontFamily: "Lato", fontSize: 18, letterSpacing: 2, textTransform: "uppercase", color: COLORS.label }}>
      {text}
    </span>
  );
}

function ChartGrid({ chart }: { chart: NatalChart }) {
  const pip = (card: DayCard) => <SharePips card={card} size={22} color={elementColor(card.element)} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1, justifyContent: "center", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", width: ROW_W }}>
        <span style={{ display: "flex", width: LABEL_W }} />
        <Cell>{colHead("You")}</Cell>
        <Cell>{colHead("The World")}</Cell>
      </div>
      <Row label="Year" left={<MajorMark pos={chart.personalYear} size={50} />} right={<MajorMark pos={chart.collectiveYear} size={50} />} />
      <Row label="Month" left={<MajorMark pos={chart.personalMonth} size={50} />} right={<MajorMark pos={chart.collectiveMonth} size={50} />} />
      <Row label="Day" left={pip(chart.personalDayMinor)} right={pip(chart.collectiveDayMinor)} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          marginTop: 8,
          paddingTop: 18,
          borderTop: `1px solid ${COLORS.warmStone}`,
          width: 420,
        }}
      >
        <span style={{ fontFamily: "Lato", fontSize: 18, letterSpacing: 3, textTransform: "uppercase", color: COLORS.label }}>
          Bearing
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <MajorMark pos={chart.bearing} size={56} />
          <span style={{ fontFamily: "Cormorant", fontSize: 48, color: COLORS.ink }}>{chart.bearing.name}</span>
        </div>
      </div>
    </div>
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const by = Number(searchParams.get("by"));
  const bm = Number(searchParams.get("bm"));
  const bd = Number(searchParams.get("bd"));
  const name = searchParams.get("n")?.trim().slice(0, 40) || undefined;
  const valid =
    Number.isInteger(by) && by > 1000 && by < 3000 &&
    Number.isInteger(bm) && bm >= 1 && bm <= 12 &&
    Number.isInteger(bd) && bd >= 1 && bd <= 31;
  if (!valid) return new Response("Birth date required", { status: 400 });

  const chart = computeNatalChart(by, bm, bd);
  const eyebrow = name ? `${name}'s natal chart` : "A natal chart";
  const bornLine = `Born ${formatLongDate(by, bm, bd)}`;

  const text = [eyebrow, bornLine, "You The World Year Month Day Bearing", chart.bearing.name, "The Tarot Almanac", "Make your chart at tarotalmanac.com"].join(" ");
  const fonts = await loadShareFonts(text);

  return new ImageResponse(
    (
      <ShareCanvas footerLeft={bornLine} cta="Make your chart at tarotalmanac.com">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
          <span
            style={{
              fontFamily: "Lato",
              fontSize: 26,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: COLORS.label,
              marginBottom: 6,
            }}
          >
            {eyebrow}
          </span>
          <ChartGrid chart={chart} />
        </div>
      </ShareCanvas>
    ),
    { width: WIDTH, height: HEIGHT, fonts },
  );
}
