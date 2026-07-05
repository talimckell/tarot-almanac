// The "Birthday Tarot Card" Pinterest board — first of ~16 planned boards. Saturated
// element-color field (Pinterest rewards colorful, thumb-stopping pins) rather than the
// Reclaimed Reversals campaign's calm stone look, since this isn't trying to visually
// differentiate from anything else on Pinterest itself.
import type { BirthdayBearingDay } from "./birthdayCampaignContent";
import { majorGlyphId } from "./pips";
import { WIDTH, HEIGHT, COLORS, elementColor, Glyph, PinterestCanvasSaturated } from "./pinterestRender";

const CTA = "tarotalmanac.com/birthday";

export function renderPinterestBirthday(day: BirthdayBearingDay) {
  const color = elementColor(day.element);
  const light = COLORS.stone;

  return (
    <PinterestCanvasSaturated color={color} cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 32,
          textAlign: "center",
        }}
      >
        <span style={{ fontFamily: "Cormorant", fontSize: 52, color: light, opacity: 0.92 }}>
          {`If your birthday is ${day.dateLabel}`}
        </span>

        <span
          style={{
            fontFamily: "Lato",
            fontSize: 36,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: light,
            opacity: 0.85,
          }}
        >
          Your Tarot Bearing Card is
        </span>

        <Glyph id={majorGlyphId(day.major)} size={160} color={light} />

        <span style={{ fontFamily: "Cormorant", fontSize: 92, lineHeight: 1.05, color: light, whiteSpace: "nowrap" }}>
          {day.bearingName}
        </span>

        {day.opening ? (
          <span style={{ fontFamily: "Cormorant", fontSize: 44, fontStyle: "italic", color: light, opacity: 0.94, maxWidth: 800 }}>
            {day.opening}
          </span>
        ) : null}

        <span style={{ fontFamily: "Lato", fontSize: 32, color: light, opacity: 0.88, maxWidth: 800 }}>
          {`Everyone born on ${day.dateLabel} shares this Tarot Bearing.`}
        </span>
      </div>
    </PinterestCanvasSaturated>
  );
}

export { WIDTH, HEIGHT };
