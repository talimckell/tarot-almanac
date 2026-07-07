// Personal year card — compute + content layer.
// Deliberately free of node:fs so it can be imported into client components
// (the calculator). Content comes from content/year-cards.json (bundled), math
// from lib/almanac.ts. See docs/ROADMAP.md "Personal year card calculator".

import {
  MAJORS,
  MAJOR_SLUGS,
  ELEMENT_BY_MAJOR,
  mod22,
  personalYear,
  bearingIndex,
  type Element,
} from "./almanac";
import data from "../content/year-cards.json";

export const ELEMENT_LABEL: Record<Element, string> = {
  fire: "Fire",
  water: "Water",
  air: "Air",
  earth: "Earth",
};

export interface YearCardContent {
  index: number;
  blurb: string;
  whatToDo: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

const CARDS = data.cards as YearCardContent[];
export const YEAR_CARD_FAQ = data.faq as FaqItem[];

export function yearCardContent(index: number): YearCardContent {
  return CARDS[index];
}

// The Major index (0-21) of the personal year card. The birth YEAR is not used —
// only the birth month/day and the calendar year being read (same inputs as the
// Bearing, plus the year). yearCard = mod22(BM + BD + sumDigits(Y)).
export function yearCardIndex(y: number, bm: number, bd: number): number {
  return personalYear(y, bm, bd);
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

// The twelve months of a calendar year as Major indices. January = yearCard+1 …
// December = yearCard+12: twelve consecutive Majors, one step each month, no
// repeats. This is a pure function of the year card, so it's identical for any
// year that lands on the same card.
export function yearMonths(yearCardIdx: number): number[] {
  return Array.from({ length: 12 }, (_, i) => mod22(yearCardIdx + i + 1));
}

// The nine Majors the year never touches: not the year card, not one of the
// twelve months. 1 (year card) + 12 (months) + 9 (untouched) = 22.
export function restOfCycle(yearCardIdx: number): number[] {
  const walked = new Set<number>([yearCardIdx, ...yearMonths(yearCardIdx)]);
  const out: number[] = [];
  for (let i = 0; i < 22; i++) if (!walked.has(i)) out.push(i);
  return out;
}

// Element counts across a set of Major indices (e.g. the twelve months), ordered
// most-to-least for a stable "element weather" read.
export function elementTally(indices: number[]): { element: Element; count: number }[] {
  const t: Record<Element, number> = { fire: 0, water: 0, air: 0, earth: 0 };
  for (const i of indices) t[ELEMENT_BY_MAJOR[i]]++;
  return (Object.keys(t) as Element[])
    .map((element) => ({ element, count: t[element] }))
    .filter((e) => e.count > 0)
    .sort((a, b) => b.count - a.count);
}

// Thin accessors so pages/components don't reach into almanac directly.
export function majorName(i: number): string {
  return MAJORS[i];
}

// Name without the leading article, so we can build phrases like "a Tower year" or
// "The Emperor Year" without doubling "The" (the card names embed their article).
export function majorShortName(i: number): string {
  return MAJORS[i].replace(/^The /, "");
}

// "a" / "an" for a short name (only Emperor and Empress start with a vowel among
// the article-less Majors).
export function indefiniteArticle(shortName: string): string {
  return /^[aeiou]/i.test(shortName) ? "an" : "a";
}
export function majorSlug(i: number): string {
  return MAJOR_SLUGS[i];
}
export function majorElement(i: number): Element {
  return ELEMENT_BY_MAJOR[i];
}

// Phase 2 (Bearing×Year layer): yearCard = mod22(bearing + sumDigits(Y)), so the
// year card is the Bearing advanced by the year's own number. Kept here so the
// paid generation payload can surface the pairing.
export function bearingForBirthday(bm: number, bd: number): number {
  return bearingIndex(bm, bd);
}
