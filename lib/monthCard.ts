// Personal month card — compute + content layer.
// Sister to lib/yearCard.ts. Deliberately free of node:fs so it can be imported
// into client components (the calculator). The per-Major month meanings are NOT
// duplicated here: they live in each card's JSON under
// positionReadings.positions.ongoingPersonalMonth and are read server-side via
// lib/cards.ts getPositionReading, then handed to the client as props. What lives
// here is the math wrapper, the FAQ (structural/SEO copy), and thin re-exports of
// the shared Major helpers so month pages don't reach into two libs.
// See docs/ROADMAP.md "Personal month post".

import { personalMonth } from "./almanac";
import data from "../content/month-cards.json";
import type { FaqItem } from "./yearCard";

export const MONTH_CARD_FAQ = data.faq as FaqItem[];

// The Major index (0-21) of the personal month card. The birth YEAR is not used —
// only birth month/day, the calendar year, and the month being read. It steps one
// place forward from the personal year card for each month:
// monthCard = mod22(personalYear + M) = mod22(BM + BD + sumDigits(Y) + M).
export function monthCardIndex(y: number, m: number, bm: number, bd: number): number {
  return personalMonth(y, m, bm, bd);
}

// Re-export the shared Major helpers so the month pages import from one place.
export {
  MONTH_NAMES,
  majorName,
  majorShortName,
  majorSlug,
  majorElement,
  indefiniteArticle,
  ELEMENT_LABEL,
} from "./yearCard";
export type { FaqItem } from "./yearCard";
