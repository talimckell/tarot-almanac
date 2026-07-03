// The natal chart: the daily engine fed the birth date as its "current" date.
// Six placements + Bearing, per /docs/TAROT_ALMANAC_CALCULATIONS.md's own table.
// Birth year is included here (unlike the personal daily/Bearing track) because the
// engine is being run on the birth date itself, not on "today."
//
// Correction: an earlier version of this file typed the Collective Day position as
// a Major, following the calculations doc's own table literally. The doc is wrong
// on this one point — every Minor card's data carries dedicated natalPersonalDay
// AND natalCollectiveDay copy (verified across all 56), which only makes sense if
// both Day positions resolve to a Minor. The mockups (pips on both sides of the Day
// row) had it right all along; this is the same kind of doc drift already known
// elsewhere (see the element-map memory) — verify against the actual content, not
// the doc, when they disagree.
import {
  MAJORS,
  MAJOR_SLUGS,
  ELEMENT_BY_MAJOR,
  collectiveYear,
  collectiveMonth,
  collectiveDayCard,
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
  collectiveDayMinor: DayCard;
  bearing: MajorPosition;
}

function majorPosition(major: number): MajorPosition {
  return { kind: "major", major, element: ELEMENT_BY_MAJOR[major], name: MAJORS[major], slug: MAJOR_SLUGS[major] };
}

// by/bm/bd = the birth year/month/day.
export function computeNatalChart(by: number, bm: number, bd: number): NatalChart {
  const CY = collectiveYear(by);
  const CM = collectiveMonth(by, bm);
  const PY = personalYear(by, bm, bd);
  const PM = personalMonth(by, bm, bm, bd);
  // The engine run on the birth date itself: y/m/d = the birth date, and the
  // birthday-fold params (for the personal side) are that same date's month/day
  // (it IS the birthday).
  const personalDayMinor = personalDayCard(by, bm, bd, bm, bd);
  const collectiveDayMinor = collectiveDayCard(by, bm, bd);
  const bIdx = bearingIndex(bm, bd);

  return {
    personalYear: majorPosition(PY),
    collectiveYear: majorPosition(CY),
    personalMonth: majorPosition(PM),
    collectiveMonth: majorPosition(CM),
    personalDayMinor,
    collectiveDayMinor,
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
  return `Because ${subjectPossessive} Bearing is the Fool, the gap to the world is zero: ${subjectPossessive} Year, Month, and Day cards match the world's exactly at every level. That's not a glitch; it's what a zero-distance Bearing means.`;
}

export interface RepeatedMajor {
  majorName: string;
  positions: string[]; // e.g. ["Bearing", "Personal Year", "Collective Day"]
}

// Across 22 Majors and 7 chart slots, the same Major landing in more than one
// slot is a real, occasional coincidence — not guaranteed, unlike the Fool-Bearing
// collapse (which is checked separately and excluded here, since that collapse is
// systemic rather than a notable one-off pattern).
export function findRepeatedMajor(chart: NatalChart): RepeatedMajor | null {
  if (isFoolBearing(chart)) return null;

  const slots: [string, number][] = [
    ["Bearing", chart.bearing.major],
    ["Personal Year", chart.personalYear.major],
    ["Collective Year", chart.collectiveYear.major],
    ["Personal Month", chart.personalMonth.major],
    ["Collective Month", chart.collectiveMonth.major],
    ["Personal Day", chart.personalDayMinor.major],
    ["Collective Day", chart.collectiveDayMinor.major],
  ];

  const byMajor = new Map<number, string[]>();
  for (const [label, major] of slots) {
    const list = byMajor.get(major) ?? [];
    list.push(label);
    byMajor.set(major, list);
  }

  let best: { major: number; positions: string[] } | null = null;
  for (const [major, positions] of byMajor) {
    if (positions.length < 2) continue;
    if (!best || positions.length > best.positions.length) {
      best = { major, positions };
    }
  }

  return best ? { majorName: MAJORS[best.major], positions: best.positions } : null;
}

export function repeatedMajorNote(repeat: RepeatedMajor, subjectPossessive: string): string {
  const where = repeat.positions
    .map((p) => p.toLowerCase())
    .join(", ")
    .replace(/, ([^,]*)$/, " and $1");
  return `${repeat.majorName} is a rare repeat in ${subjectPossessive} chart, appearing in ${where}. A card landing in more than one position almost never happens.`;
}
