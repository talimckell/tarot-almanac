// Pulls the actual authored text for every one of a natal chart's 7 positions —
// the Major essences already wired up for /tarot/[slug], the Minor's personal
// reading already wired up for /today, and the Bearing's own reading. No new copy
// written here, only assembled from what already exists.
import type { NatalChart } from "./natalChart";
import type { DayCard } from "./almanac";
import { getCardBySlug } from "./cards";
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

export function getChartReadings(chart: NatalChart, they: boolean): ChartReadingItem[] {
  const subj = they ? "they" : "you";
  const obj = they ? "them" : "you";

  const bearingData = bearings.find((b) => b.slug === chart.bearing.slug);

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
      label: "Sun · core self",
      name: chart.personalYear.name,
      href: `/tarot/${chart.personalYear.slug}`,
      text: getCardBySlug(chart.personalYear.slug)?.essence,
      element: chart.personalYear.element,
      major: chart.personalYear.major,
    },
    {
      key: "collectiveYear",
      label: `What ${subj} inherited`,
      name: chart.collectiveYear.name,
      href: `/tarot/${chart.collectiveYear.slug}`,
      text: getCardBySlug(chart.collectiveYear.slug)?.essence,
      element: chart.collectiveYear.element,
      major: chart.collectiveYear.major,
    },
    {
      key: "personalMonth",
      label: "Moon · inner life",
      name: chart.personalMonth.name,
      href: `/tarot/${chart.personalMonth.slug}`,
      text: getCardBySlug(chart.personalMonth.slug)?.essence,
      element: chart.personalMonth.element,
      major: chart.personalMonth.major,
    },
    {
      key: "collectiveMonth",
      label: `The climate ${subj} formed in`,
      name: chart.collectiveMonth.name,
      href: `/tarot/${chart.collectiveMonth.slug}`,
      text: getCardBySlug(chart.collectiveMonth.slug)?.essence,
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
