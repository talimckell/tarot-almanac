// Deterministic package for the paid year-ahead reading. Everything the AI is allowed
// to phrase is computed here first (same contract as lib/monthlyReading.ts): the year
// card, the twelve months and their authored readings, the Bearing, the Bearing×Year
// facts, the element weather, and the untouched part of the cycle. The AI weaves; it
// never chooses cards or imports outside meaning. Server-only (reads card JSON via
// lib/cards).

import { getCardBySlug } from "./cards";
import { MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR, sumDigits, type Element } from "./almanac";
import {
  yearCardIndex,
  yearMonths,
  restOfCycle,
  elementTally,
  bearingForBirthday,
  yearCardContent,
  MONTH_NAMES,
} from "./yearCard";

export interface YearMonthEntry {
  monthName: string; // "January" … "December"
  card: string;
  element: Element;
  reading: string; // authored ongoingPersonalMonth body (grounding, not final copy)
}

export interface YearPackage {
  name: string;
  year: number;
  birth: { month: number; day: number };
  bearing: { name: string; element: Element; essence: string; meaning: string };
  yearCard: {
    name: string;
    element: Element;
    essence: string;
    blurb: string; // the free-tier authored year blurb
    personalYearReading: string; // authored ongoingPersonalYear body
    whatToDo: string;
    skills: string[];
  };
  // The Bearing×Year relationship, all pre-computed so the AI only phrases it.
  bearingVsYear: {
    gap: number; // sumDigits(year): steps from the Bearing to the year card
    sameElement: boolean; // does the Bearing share the year card's element
    decemberReturnsToBearing: boolean; // true when December's month card == the Bearing
  };
  months: YearMonthEntry[]; // 12, January → December
  elementWeather: { element: Element; count: number }[];
  restOfCycle: { name: string; element: Element }[]; // the 9 Majors the year never touches
}

function major(idx: number) {
  return getCardBySlug(MAJOR_SLUGS[idx]);
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

  const yc = major(ycIdx);
  const bearing = major(bIdx);
  const content = yearCardContent(ycIdx);

  const months: YearMonthEntry[] = monthsIdx.map((mi, i) => {
    const c = major(mi);
    return {
      monthName: MONTH_NAMES[i],
      card: MAJORS[mi],
      element: ELEMENT_BY_MAJOR[mi],
      reading: c?.positionReadings?.ongoingPersonalMonth?.body ?? c?.essence ?? "",
    };
  });

  return {
    name: name.trim() || "you",
    year,
    birth: { month: bm, day: bd },
    bearing: {
      name: MAJORS[bIdx],
      element: ELEMENT_BY_MAJOR[bIdx],
      essence: bearing?.essence ?? "",
      meaning: bearing?.gift.body ?? "",
    },
    yearCard: {
      name: MAJORS[ycIdx],
      element: ELEMENT_BY_MAJOR[ycIdx],
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
    restOfCycle: restOfCycle(ycIdx).map((ri) => ({
      name: MAJORS[ri],
      element: ELEMENT_BY_MAJOR[ri],
    })),
  };
}
