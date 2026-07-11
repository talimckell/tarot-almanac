// The visual treatment for the daily "collective card vs your card" Substack Note. One
// design reused every day (like the Birthday Bearings campaign) — the collective card is
// what changes. Portrait 1080x1350, sized for the Notes feed. The two zones are contained
// cards (vellum on stone, hairline border, a top accent border like the calendar's "today"
// cell): the collective card is the day's real MINOR (pips + name + its authored collective
// reading), matching what /today and the today share image feature — the day Major is only
// context there, not the card, so it isn't shown. The lower card is the call to action,
// since a person's own card is set by their birthday and is the reason to visit the site.
import type { CollectiveVsYouDay } from "./collectiveVsYouContent";
import { COLORS, StarMark, SharePips, elementColor } from "./shareRender";

export const WIDTH = 1080;
export const HEIGHT = 1350;
export const CTA = "tarotalmanac.com/today";

// Every string the card renders, concatenated, so loadShareFonts() can subset Google's
// fonts to exactly the glyphs used (see lib/ogFonts.ts). Keep in sync with the JSX below.
export function collectiveVsYouText(day: CollectiveVsYouDay): string {
  return [
    "Card of the day",
    day.dateLabel,
    "The collective card",
    day.card.minorName,
    day.opening,
    "And you?",
    "Your card",
    "Yours is set by your birthday.",
    "Everyone shares the card above. Yours is your own.",
    "Find yours at " + CTA,
    "The Tarot Almanac",
    CTA,
  ].join(" ");
}

export function renderCollectiveVsYou(day: CollectiveVsYouDay) {
  const field = elementColor(day.card.element);
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        background: COLORS.stone,
        padding: "48px 56px",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <StarMark size={28} color={COLORS.indigo} />
        <span style={{ fontFamily: "Lato", fontSize: 21, letterSpacing: 4, textTransform: "uppercase", color: COLORS.label }}>
          Card of the day
        </span>
        <span style={{ fontFamily: "Cormorant", fontSize: 44, color: COLORS.ink }}>{day.dateLabel}</span>
      </div>

      {/* The two contained cards, centered in the space between header and footer */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", gap: 22 }}>
        {/* Collective card (the day's real Minor) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            gap: 16,
            background: COLORS.vellum,
            border: `1px solid ${COLORS.warmStone}`,
            borderTop: `3px solid ${field}`,
            padding: "34px 44px",
          }}
        >
          <span style={{ fontFamily: "Lato", fontSize: 21, letterSpacing: 4, textTransform: "uppercase", color: field }}>
            The collective card
          </span>
          <SharePips card={day.card} size={42} color={field} />
          <span
            style={{ fontFamily: "Cormorant", fontSize: 56, lineHeight: 1.04, color: COLORS.ink, textAlign: "center", maxWidth: 860 }}
          >
            {day.card.minorName}
          </span>
          {day.opening ? (
            <span
              style={{
                fontFamily: "Cormorant",
                fontSize: 31,
                lineHeight: 1.3,
                color: COLORS.charcoal,
                textAlign: "center",
                maxWidth: 820,
              }}
            >
              {day.opening}
            </span>
          ) : null}
        </div>

        {/* Bridge */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Lato", fontSize: 19, letterSpacing: 4, textTransform: "uppercase", color: COLORS.warmStone }}>
            And you?
          </span>
        </div>

        {/* Your card (the call to action) */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            width: "100%",
            gap: 14,
            background: COLORS.vellum,
            border: `1px solid ${COLORS.warmStone}`,
            borderTop: `3px solid ${COLORS.indigo}`,
            padding: "34px 44px",
          }}
        >
          <span style={{ fontFamily: "Lato", fontSize: 21, letterSpacing: 4, textTransform: "uppercase", color: COLORS.indigo }}>
            Your card
          </span>
          <StarMark size={72} color={COLORS.warmStone} />
          <span
            style={{ fontFamily: "Cormorant", fontSize: 44, lineHeight: 1.1, color: COLORS.ink, textAlign: "center", maxWidth: 800 }}
          >
            Yours is set by your birthday.
          </span>
          <span
            style={{ fontFamily: "Lato", fontSize: 23, lineHeight: 1.4, color: COLORS.charcoal, textAlign: "center", maxWidth: 720 }}
          >
            Everyone shares the card above. Yours is your own.
          </span>
          <div style={{ display: "flex", background: COLORS.indigo, borderRadius: 4, padding: "16px 30px", marginTop: 6 }}>
            <span style={{ fontFamily: "Lato", fontSize: 25, fontWeight: 700, color: COLORS.stone }}>Find yours at {CTA}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderTop: `1px solid ${COLORS.warmStone}`,
          paddingTop: 22,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <StarMark size={24} color={COLORS.indigo} />
          <span style={{ fontFamily: "Cormorant", fontSize: 29, color: COLORS.ink }}>The Tarot Almanac</span>
        </div>
        <span style={{ fontFamily: "Lato", fontSize: 21, color: COLORS.label }}>{CTA}</span>
      </div>
    </div>
  );
}
