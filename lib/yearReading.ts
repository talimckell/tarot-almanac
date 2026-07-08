// Deterministic package for the paid year-ahead reading. Everything the reader sees that
// was already authored is wired here verbatim (the year card's ongoingPersonalYear text,
// each month's ongoingPersonalMonth text, the year card's skills). The AI only writes the
// connective weave: a personalized framing, the Bearing×Year spine, the stages/arc, the
// element weather, and reflection questions. It never rewrites the authored readings.
// Server-only (reads card JSON via lib/cards).

import { getCardBySlug } from "./cards";
import {
  MAJORS,
  MAJOR_SLUGS,
  ELEMENT_BY_MAJOR,
  sumDigits,
  phaseBand,
  type Element,
} from "./almanac";
import {
  yearCardIndex,
  yearMonths,
  restOfCycle,
  elementTally,
  bearingForBirthday,
  yearCardContent,
  MONTH_NAMES,
} from "./yearCard";

export type Stage = "Initiation" | "Testing" | "Reckoning";

export interface YearMonthEntry {
  monthName: string; // "January" … "December"
  card: string;
  element: Element;
  stage: Stage;
  reading: string; // authored ongoingPersonalMonth body — shown verbatim, never rewritten
}

export interface YearPackage {
  name: string;
  year: number;
  birth: { month: number; day: number };
  bearing: { name: string; element: Element; stage: Stage; essence: string; meaning: string };
  yearCard: {
    name: string;
    element: Element;
    stage: Stage;
    essence: string;
    blurb: string; // the free-tier authored year blurb
    personalYearReading: string; // authored ongoingPersonalYear body — shown verbatim
    whatToDo: string;
    skills: string[]; // authored skills — shown verbatim
  };
  bearingVsYear: {
    gap: number; // sumDigits(year): steps from the Bearing to the year card
    sameElement: boolean;
    decemberReturnsToBearing: boolean; // December's month card == the Bearing
  };
  months: YearMonthEntry[]; // 12, January → December
  elementWeather: { element: Element; count: number }[];
  restOfCycle: { name: string; element: Element; stage: Stage }[]; // the 9 untouched Majors
  // How the year moves through the Fool's-Journey stages (blog-07): month counts per stage
  // for the twelve months, and which stages the untouched cards sit in.
  stageSummary: {
    touched: Record<Stage, number>;
    untouched: Record<Stage, number>;
  };
}

function major(idx: number) {
  return getCardBySlug(MAJOR_SLUGS[idx]);
}

function emptyStages(): Record<Stage, number> {
  return { Initiation: 0, Testing: 0, Reckoning: 0 };
}

export function buildYearPackage(
  name: string,
  year: number,
  bm: number,
  bd: number
): YearPackage {
  const ycIdx = yearCardIndex(year, bm, bd);
  const bIdx = bearingForBirthday(bm, bd);
  const monthsIdx = yearMonths(ycIdx);
  const restIdx = restOfCycle(ycIdx);

  const yc = major(ycIdx);
  const bearing = major(bIdx);
  const content = yearCardContent(ycIdx);

  const months: YearMonthEntry[] = monthsIdx.map((mi, i) => {
    const c = major(mi);
    return {
      monthName: MONTH_NAMES[i],
      card: MAJORS[mi],
      element: ELEMENT_BY_MAJOR[mi],
      stage: phaseBand(mi),
      reading: c?.positionReadings?.ongoingPersonalMonth?.body ?? c?.essence ?? "",
    };
  });

  const touched = emptyStages();
  for (const mi of monthsIdx) touched[phaseBand(mi)]++;
  const untouched = emptyStages();
  for (const ri of restIdx) untouched[phaseBand(ri)]++;

  return {
    name: name.trim() || "you",
    year,
    birth: { month: bm, day: bd },
    bearing: {
      name: MAJORS[bIdx],
      element: ELEMENT_BY_MAJOR[bIdx],
      stage: phaseBand(bIdx),
      essence: bearing?.essence ?? "",
      meaning: bearing?.gift.body ?? "",
    },
    yearCard: {
      name: MAJORS[ycIdx],
      element: ELEMENT_BY_MAJOR[ycIdx],
      stage: phaseBand(ycIdx),
      essence: yc?.essence ?? "",
      blurb: content.blurb,
      personalYearReading: yc?.positionReadings?.ongoingPersonalYear?.body ?? "",
      whatToDo: content.whatToDo,
      skills: yc?.skills ?? [],
    },
    bearingVsYear: {
      gap: sumDigits(year),
      sameElement: ELEMENT_BY_MAJOR[bIdx] === ELEMENT_BY_MAJOR[ycIdx],
      decemberReturnsToBearing: monthsIdx[11] === bIdx,
    },
    months,
    elementWeather: elementTally(monthsIdx),
    restOfCycle: restIdx.map((ri) => ({
      name: MAJORS[ri],
      element: ELEMENT_BY_MAJOR[ri],
      stage: phaseBand(ri),
    })),
    stageSummary: { touched, untouched },
  };
}
