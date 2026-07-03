// The natal chart: the daily engine fed the birth date as its "current" date.
// Six placements + Bearing, per /docs/TAROT_ALMANAC_CALCULATIONS.md's own table.
// Birth year is included here (unlike the personal daily/Bearing track) because the
// engine is being run on the birth date itself, not on "today."
//
// Known drift, resolved in favor of the calculations doc: the chart mockups
// (natal-chart-mockup.html etc.) render the World/Day position as a Minor (pips) on
// both sides of the Day row, but the doc's own table types "Collective Day Major" as
// a Major, matching every other collective-track Major elsewhere in the app. Built
// per the doc, not the mockup.
import {
  MAJORS,
  MAJOR_SLUGS,
  ELEMENT_BY_MAJOR,
  collectiveYear,
  collectiveMonth,
  collectiveDayMajor,
  personalYear,
  personalMonth,
  personalDayCard,
  bearingIndex,
  type Element,
  type DayCard,
} from "./almanac";

export interface MajorPosition {
  kind: "major";
  major: number;
  element: Element;
  name: string;
  slug: string;
}

export interface NatalChart {
  personalYear: MajorPosition;
  collectiveYear: MajorPosition;
  personalMonth: MajorPosition;
  collectiveMonth: MajorPosition;
  personalDayMinor: DayCard;
  collectiveDayMajor: MajorPosition;
  bearing: MajorPosition;
}

function majorPosition(major: number): MajorPosition {
  return { kind: "major", major, element: ELEMENT_BY_MAJOR[major], name: MAJORS[major], slug: MAJOR_SLUGS[major] };
}

// by/bm/bd = the birth year/month/day.
export function computeNatalChart(by: number, bm: number, bd: number): NatalChart {
  const CY = collectiveYear(by);
  const CM = collectiveMonth(by, bm);
  const CDMajor = collectiveDayMajor(by, bm, bd);
  const PY = personalYear(by, bm, bd);
  const PM = personalMonth(by, bm, bm, bd);
  // The engine run on the birth date itself: y/m/d = the birth date, and the
  // birthday-fold params are that same date's month/day (it IS the birthday).
  const personalDayMinor = personalDayCard(by, bm, bd, bm, bd);
  const bIdx = bearingIndex(bm, bd);

  return {
    personalYear: majorPosition(PY),
    collectiveYear: majorPosition(CY),
    personalMonth: majorPosition(PM),
    collectiveMonth: majorPosition(CM),
    personalDayMinor,
    collectiveDayMajor: majorPosition(CDMajor),
    bearing: majorPosition(bIdx),
  };
}

const STEP_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen",
  "eighteen", "nineteen", "twenty", "twenty-one",
];

// "Eighteen steps separate you from the world..." — the gap-note under the chart
// diagram. Uses the raw Bearing index (0-21), not the distance band (min(B, 22-B))
// used elsewhere for near/far categorization — matches the mockup's own example.
export function bearingStepsWord(bIdx: number): string {
  return STEP_WORDS[bIdx] ?? String(bIdx);
}

// A Fool Bearing (mod22(bm+bd) = 0) is a mathematical special case: it makes the
// Personal and Collective tracks identical at every level (Year, Month, and the
// Day position's underlying Major), since adding a zero-valued Bearing gap changes
// nothing. Real, not a bug — worth surfacing so it doesn't read as one.
export function isFoolBearing(chart: NatalChart): boolean {
  return chart.bearing.major === 0;
}

export function foolBearingNote(subjectPossessive: string): string {
  return `Because ${subjectPossessive} Bearing is the Fool, the gap to the world is zero — ${subjectPossessive} Year, Month, and Day cards match the world's exactly at every level. That's not a glitch; it's what a zero-distance Bearing means.`;
}
