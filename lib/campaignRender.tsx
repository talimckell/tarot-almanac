// The four rotating visual treatments for the collective "card of the day" campaign.
// Each pulls a different already-authored field (never new copy) and looks distinct —
// not just a recolor — so a run of daily posts doesn't read as the same template on
// repeat. Treatments 0/1 share the personal-share look (FeaturedCard); 2/3 are bespoke.
import type { CampaignDay } from "./campaignContent";
import { WIDTH, HEIGHT, COLORS, elementColor, SharePips, StarMark, ShareCanvas, FeaturedCard } from "./shareRender";
import { TREATMENT_COUNT } from "./campaignTreatments";

export { TREATMENT_COUNT, TREATMENT_NAMES } from "./campaignTreatments";

// Kept short (~35 chars) — the shared footer's flex-row layout overlaps once the CTA
// text runs much past this, as happened when the per-user share footer tried a longer
// line (see lib/shareRender.tsx's ShareFooter usage elsewhere).
const CTA = "Your card at tarotalmanac.com/today";

function AffirmationTreatment({ day }: { day: CampaignDay }) {
  const color = elementColor(day.card.element);
  return (
    <ShareCanvas footerLeft={day.dateLabel} cta={CTA}>
      <FeaturedCard
        eyebrow="Today's card"
        glyph={<SharePips card={day.card} size={46} color={color} />}
        title={day.card.minorName}
        body={day.affirmation}
      />
    </ShareCanvas>
  );
}

function EssenceTreatment({ day }: { day: CampaignDay }) {
  const color = elementColor(day.card.element);
  return (
    <ShareCanvas footerLeft={day.dateLabel} cta={CTA}>
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
            color: COLORS.label,
          }}
        >
          The card of the day
        </span>
        <SharePips card={day.card} size={46} color={color} />
        <span style={{ fontFamily: "Cormorant", fontSize: 54, lineHeight: 1.02, color: COLORS.ink, whiteSpace: "nowrap" }}>
          {day.card.minorName}
        </span>
        <span style={{ fontFamily: "Cormorant", fontSize: 29, lineHeight: 1.32, color: COLORS.charcoal, textAlign: "center", maxWidth: 980 }}>
          {day.essence}
        </span>
      </div>
    </ShareCanvas>
  );
}

// Full-bleed element-color field — the one treatment that isn't stone-background, for
// real visual contrast across a week of posts.
function KeywordsTreatment({ day }: { day: CampaignDay }) {
  const field = elementColor(day.card.element);
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
          gap: 26,
          textAlign: "center",
        }}
      >
        <span style={{ fontFamily: "Lato", fontSize: 26, letterSpacing: 3, textTransform: "uppercase", color: light, opacity: 0.85 }}>
          Today&rsquo;s card
        </span>
        <SharePips card={day.card} size={50} color={light} />
        <span style={{ fontFamily: "Cormorant", fontSize: 60, lineHeight: 1.02, color: light, whiteSpace: "nowrap" }}>
          {day.card.minorName}
        </span>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 900 }}>
          {day.keywords.slice(0, 3).map((k) => (
            <span
              key={k}
              style={{
                display: "flex",
                fontFamily: "Lato",
                fontSize: 22,
                color: light,
                padding: "8px 22px",
                border: `1px solid ${light}`,
                borderRadius: 999,
                opacity: 0.92,
              }}
            >
              {k}
            </span>
          ))}
        </div>
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

// The collective reading's own line, quote-styled — text is the star, the card name
// drops to a small attribution instead of a headline (the inverse emphasis of the
// affirmation/essence treatments).
function CollectiveTreatment({ day }: { day: CampaignDay }) {
  const color = elementColor(day.card.element);
  return (
    <ShareCanvas footerLeft={day.dateLabel} cta={CTA}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          gap: 28,
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: "Cormorant",
            fontSize: 38,
            fontStyle: "italic",
            lineHeight: 1.36,
            color: COLORS.ink,
            textAlign: "center",
            maxWidth: 1000,
          }}
        >
          &ldquo;{day.collectiveLine}&rdquo;
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <SharePips card={day.card} size={26} color={color} />
          <span style={{ fontFamily: "Lato", fontSize: 22, color: COLORS.label }}>
            &mdash; the card of the day, {day.card.minorName}
          </span>
        </div>
      </div>
    </ShareCanvas>
  );
}

export function renderCampaignTreatment(day: CampaignDay, treatment: number) {
  switch (treatment % TREATMENT_COUNT) {
    case 0:
      return <AffirmationTreatment day={day} />;
    case 1:
      return <EssenceTreatment day={day} />;
    case 2:
      return <KeywordsTreatment day={day} />;
    case 3:
    default:
      return <CollectiveTreatment day={day} />;
  }
}

export { WIDTH, HEIGHT };
