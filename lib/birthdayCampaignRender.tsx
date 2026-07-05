// The single visual treatment for the "Birthday Bearings" campaign — one design reused
// every day (unlike the collective campaign's four rotating treatments), since the post
// itself already changes daily (a different Bearing lands on a different birthday) and
// the same look builds recognition for a daily recurring feature.
import type { BirthdayBearingDay } from "./birthdayCampaignContent";
import { WIDTH, HEIGHT, COLORS, elementColor, Glyph, StarMark } from "./shareRender";
import { majorGlyphId } from "./pips";

const CTA = "tarotalmanac.com/birthday";

export function renderBirthdayBearing(day: BirthdayBearingDay) {
  const field = elementColor(day.element);
  const light = COLORS.stone;
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        background: field,
        padding: "44px 60px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 22,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Lato",
            fontSize: 26,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: light,
            opacity: 0.85,
          }}
        >
          Born today?
        </span>
        <Glyph id={majorGlyphId(day.major)} size={92} color={light} />
        <span style={{ fontFamily: "Cormorant", fontSize: 30, color: light, opacity: 0.9 }}>{day.dateLabel}</span>
        <span style={{ fontFamily: "Cormorant", fontSize: 60, lineHeight: 1.05, color: light, whiteSpace: "nowrap" }}>
          {`Your Bearing is ${day.bearingName}`}
        </span>
        {day.opening ? (
          <span style={{ fontFamily: "Cormorant", fontSize: 30, fontStyle: "italic", color: light, opacity: 0.92 }}>
            {day.opening}
          </span>
        ) : null}
        <span style={{ fontFamily: "Lato", fontSize: 22, color: light, opacity: 0.85 }}>
          Everyone born today shares this card. Find out what it means.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderTop: `1px solid ${light}`,
          opacity: 0.9,
          paddingTop: 22,
        }}
      >
        <span style={{ display: "flex", flex: 1, fontFamily: "Lato", fontSize: 22, color: light }}>{day.dateLabel}</span>
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", gap: 12 }}>
          <StarMark size={28} color={light} />
          <span style={{ fontFamily: "Cormorant", fontSize: 30, color: light, whiteSpace: "nowrap" }}>The Tarot Almanac</span>
        </div>
        <span style={{ display: "flex", flex: 1, justifyContent: "flex-end", fontFamily: "Lato", fontSize: 22, color: light, whiteSpace: "nowrap" }}>
          {CTA}
        </span>
      </div>
    </div>
  );
}

export { WIDTH, HEIGHT };
