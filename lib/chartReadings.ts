// Pulls the actual authored text for every one of a natal chart's 7 positions.
// Every position beyond the raw card essence has dedicated role-specific copy in
// the card data: Majors carry positionReadings.positions.natal* (e.g.
// natalPersonalYear) for the 4 Year/Month positions; Minors carry top-level
// natalPersonalDay/natalCollectiveDay fields for the 2 Day positions. Distinct from
// the generic essence, and distinct from the daily almanac's own personal/collective
// reading fields (same card, different context).
//
// This natal copy is written in second person ("you"), addressed to the chart's
// subject — which reads correctly whether the subject is the account holder or
// someone else's saved/gifted chart (a natal reading is naturally written "to" the
// person it's about, the way any horoscope addresses its subject). Used everywhere,
// not just the account holder's own chart.
import type { NatalChart } from "./natalChart";
import type { DayCard } from "./almanac";
import { getCardBySlug, getPositionReading } from "./cards";

function minorSlug(card: DayCard): string {
  return `${card.rankName.toLowerCase()}-of-${card.suit.toLowerCase()}`;
}

// The chart's Bearing readcard is a short teaser (matches the mockup's compact
// "free" card), not the full essay — that lives on /bearing/[slug], which this
// links out to. data/bearings.json's own `reading` field is a shorter placeholder,
// not the real content; the actual essay is each Major's own bearing.body, so this
// takes just its opening paragraph as the excerpt.
function bearingExcerpt(slug: string): string | undefined {
  const full = getCardBySlug(slug)?.bearingReading;
  return full?.split("\n\n")[0];
}

export interface ChartReadingItem {
  key: string;
  label: string;
  name: string;
  href: string;
  text: string | undefined;
  element: string;
  major?: number; // present for Major positions — glyph is #ma-{major}
  minorCard?: DayCard; // present for the two Day positions — glyph is suit pips
}

function majorReading(slug: string, natalKey: string, fallbackLabel: string): { label: string; text: string | undefined } {
  const pr = getPositionReading(slug, natalKey);
  if (pr) return { label: pr.label, text: pr.body };
  return { label: fallbackLabel, text: getCardBySlug(slug)?.essence };
}

export function getChartReadings(chart: NatalChart): ChartReadingItem[] {
  const personalYear = majorReading(chart.personalYear.slug, "natalPersonalYear", "Sun · core self");
  const collectiveYear = majorReading(chart.collectiveYear.slug, "natalCollectiveYear", "What you inherited");
  const personalMonth = majorReading(chart.personalMonth.slug, "natalPersonalMonth", "Moon · inner life");
  const collectiveMonth = majorReading(chart.collectiveMonth.slug, "natalCollectiveMonth", "The climate you formed in");

  const personalDayCardData = getCardBySlug(minorSlug(chart.personalDayMinor));
  const collectiveDayCardData = getCardBySlug(minorSlug(chart.collectiveDayMinor));

  return [
    {
      key: "bearing",
      label: "Bearing",
      name: chart.bearing.name,
      href: `/bearing/${chart.bearing.slug}`,
      text: bearingExcerpt(chart.bearing.slug),
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
      label: "Rising · how you meet a room",
      name: chart.personalDayMinor.minorName,
      href: `/tarot/${minorSlug(chart.personalDayMinor)}`,
      text: personalDayCardData?.natalPersonalDay,
      element: chart.personalDayMinor.element,
      minorCard: chart.personalDayMinor,
    },
    {
      key: "collectiveDayMinor",
      label: "The day that caught you",
      name: chart.collectiveDayMinor.minorName,
      href: `/tarot/${minorSlug(chart.collectiveDayMinor)}`,
      text: collectiveDayCardData?.natalCollectiveDay,
      element: chart.collectiveDayMinor.element,
      minorCard: chart.collectiveDayMinor,
    },
  ];
}
