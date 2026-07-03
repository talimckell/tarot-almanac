// Pulls the actual authored text for every one of a natal chart's 7 positions.
// The 4 Year/Month Major positions each have dedicated role-specific copy in the
// card data (positionReadings.positions.natal*, e.g. natalPersonalYear) — separate
// from the card's general essence, the same way Minors already have distinct
// personal-reading vs collective-reading text at the day level. That natal copy is
// written in second person ("you"), so it's only correct for the account holder's
// own chart; a saved/gifted chart about someone else falls back to the
// person-neutral essence rather than misattributing "you" text to a third party.
import type { NatalChart } from "./natalChart";
import type { DayCard } from "./almanac";
import { getCardBySlug, getPositionReading } from "./cards";
import { getPersonalReading } from "./personalReadings";
import bearings from "../data/bearings.json";

function minorSlug(card: DayCard): string {
  return `${card.rankName.toLowerCase()}-of-${card.suit.toLowerCase()}`;
}

export interface ChartReadingItem {
  key: string;
  label: string;
  name: string;
  href: string;
  text: string | undefined;
  element: string;
  major?: number; // present for Major positions — glyph is #ma-{major}
  minorCard?: DayCard; // present only for personalDayMinor — glyph is suit pips
}

// they=false (the account holder's own chart) uses the real natal-role text and
// its authored label; they=true (someone else's saved/gifted chart) falls back to
// the card's general essence with a person-neutral label, since the natal text
// itself says "you".
function majorReading(
  slug: string,
  natalKey: string,
  they: boolean,
  fallbackLabel: string,
): { label: string; text: string | undefined } {
  if (!they) {
    const pr = getPositionReading(slug, natalKey);
    if (pr) return { label: pr.label, text: pr.body };
  }
  return { label: fallbackLabel, text: getCardBySlug(slug)?.essence };
}

export function getChartReadings(chart: NatalChart, they: boolean): ChartReadingItem[] {
  const subj = they ? "they" : "you";
  const obj = they ? "them" : "you";

  const bearingData = bearings.find((b) => b.slug === chart.bearing.slug);

  const personalYear = majorReading(chart.personalYear.slug, "natalPersonalYear", they, "Sun · core self");
  const collectiveYear = majorReading(chart.collectiveYear.slug, "natalCollectiveYear", they, `What ${subj} inherited`);
  const personalMonth = majorReading(chart.personalMonth.slug, "natalPersonalMonth", they, "Moon · inner life");
  const collectiveMonth = majorReading(
    chart.collectiveMonth.slug,
    "natalCollectiveMonth",
    they,
    `The climate ${subj} formed in`,
  );

  return [
    {
      key: "bearing",
      label: "Bearing",
      name: chart.bearing.name,
      href: `/bearing/${chart.bearing.slug}`,
      text: bearingData?.reading,
      element: chart.bearing.element,
      major: chart.bearing.major,
    },
    {
      key: "personalYear",
      label: personalYear.label,
      name: chart.personalYear.name,
      href: `/tarot/${chart.personalYear.slug}`,
      text: personalYear.text,
      element: chart.personalYear.element,
      major: chart.personalYear.major,
    },
    {
      key: "collectiveYear",
      label: collectiveYear.label,
      name: chart.collectiveYear.name,
      href: `/tarot/${chart.collectiveYear.slug}`,
      text: collectiveYear.text,
      element: chart.collectiveYear.element,
      major: chart.collectiveYear.major,
    },
    {
      key: "personalMonth",
      label: personalMonth.label,
      name: chart.personalMonth.name,
      href: `/tarot/${chart.personalMonth.slug}`,
      text: personalMonth.text,
      element: chart.personalMonth.element,
      major: chart.personalMonth.major,
    },
    {
      key: "collectiveMonth",
      label: collectiveMonth.label,
      name: chart.collectiveMonth.name,
      href: `/tarot/${chart.collectiveMonth.slug}`,
      text: collectiveMonth.text,
      element: chart.collectiveMonth.element,
      major: chart.collectiveMonth.major,
    },
    {
      key: "personalDayMinor",
      label: `Rising · how ${subj} meet a room`,
      name: chart.personalDayMinor.minorName,
      href: `/tarot/${minorSlug(chart.personalDayMinor)}`,
      text: getPersonalReading(chart.personalDayMinor),
      element: chart.personalDayMinor.element,
      minorCard: chart.personalDayMinor,
    },
    {
      key: "collectiveDayMajor",
      label: `The day that caught ${obj}`,
      name: chart.collectiveDayMajor.name,
      href: `/tarot/${chart.collectiveDayMajor.slug}`,
      text: getCardBySlug(chart.collectiveDayMajor.slug)?.essence,
      element: chart.collectiveDayMajor.element,
      major: chart.collectiveDayMajor.major,
    },
  ];
}
