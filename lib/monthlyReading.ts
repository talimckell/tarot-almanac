// The monthly reading's deterministic package: everything the almanac itself decides
// (cards, patterns, authored text), computed with zero AI involvement. Per
// MONTHLY_READING_BUILD_BRIEF.md, the AI only phrases the relationships this file
// already found — it never picks a card, detects a pattern, or chooses a date.
//
// Rule validated against the real engine (see DATES_TO_CIRCLE_RULESET.md): only two
// signals survived as meaningful and correctly scarce — exact-card repeats (circled
// dates) and Bearing-vs-month-element agreement/clash (the opening frame). Everything
// else in that doc was tried and rejected; don't re-add it here.
import {
  MAJORS,
  MAJOR_SLUGS,
  ELEMENT_BY_MAJOR,
  personalMonth,
  personalDayCard,
  bearingIndex,
  type DayCard,
  type Element,
} from "./almanac";
import { type YM, addMonths, daysInMonth, firstWeekday } from "./today";
import { getCardBySlug } from "./cards";

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export type BearingVsMonthRelation = "agree" | "clash" | "in-step-fool";

export interface MonthlyWeek {
  n: number;
  span: string; // "Jul 1–4"
  days: { d: number; card: DayCard }[];
  opens: DayCard;
  closes: DayCard;
  dominantSuit: string;
}

export interface CircledDate {
  card: string; // exact minor name, e.g. "King of Wands"
  dayNumbers: number[];
  dates: string; // formatted, e.g. "Jul 1 & 29"
}

export interface MonthlyPackage {
  month: YM;
  monthLabel: string; // "July 2026"
  monthCard: {
    major: number;
    name: string;
    slug: string;
    element: Element;
    tagline: string;
    numberLabel?: string;
    essence: string;
    thisMonthReading: string;
    skills: string[];
  };
  cycle: { prevName: string; prevSlug: string; nextName: string; nextSlug: string };
  bearing: { major: number; name: string; element: Element };
  bearingVsMonth: { relation: BearingVsMonthRelation; echoDayCount: number };
  weeks: MonthlyWeek[];
  circledDates: CircledDate[];
}

function majorFacts(major: number) {
  return { major, name: MAJORS[major], slug: MAJOR_SLUGS[major], element: ELEMENT_BY_MAJOR[major] };
}

function dominantSuit(days: { card: DayCard }[]): string {
  const counts = new Map<string, number>();
  for (const { card } of days) counts.set(card.suit, (counts.get(card.suit) ?? 0) + 1);
  let best = days[0].card.suit;
  let bestCount = 0;
  for (const [suit, count] of counts) {
    if (count > bestCount) {
      best = suit;
      bestCount = count;
    }
  }
  return best;
}

// Calendar (Sunday-start) weeks, matching /me's own calendar grid (lib/today.ts's
// firstWeekday) — the first and last week are partial exactly like that grid's blank
// cells, not fixed 7-day blocks from day 1.
function groupWeeks(month: YM, days: { d: number; card: DayCard }[]): MonthlyWeek[] {
  const rawWeeks: { d: number; card: DayCard }[][] = [];
  let current: { d: number; card: DayCard }[] = [];
  let dow = firstWeekday(month);
  for (const day of days) {
    current.push(day);
    dow++;
    if (dow % 7 === 0) {
      rawWeeks.push(current);
      current = [];
    }
  }
  if (current.length) rawWeeks.push(current);

  return rawWeeks.map((weekDays, i) => {
    const first = weekDays[0].d;
    const last = weekDays[weekDays.length - 1].d;
    const abbr = MONTH_ABBR[month.m - 1];
    return {
      n: i + 1,
      span: first === last ? `${abbr} ${first}` : `${abbr} ${first}–${last}`,
      days: weekDays,
      opens: weekDays[0].card,
      closes: weekDays[weekDays.length - 1].card,
      dominantSuit: dominantSuit(weekDays),
    };
  });
}

function formatCircleDates(month: YM, dayNumbers: number[]): string {
  const abbr = MONTH_ABBR[month.m - 1];
  const labels = dayNumbers.map((d) => `${abbr} ${d}`);
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} & ${labels[labels.length - 1]}`;
}

// Exact-card repeats only (rank AND suit) — Signal 1 from DATES_TO_CIRCLE_RULESET.md.
// Individuating because it depends on suit, which differs between people even when
// their rank rhythm is shared. ~2-3/month is normal; an empty result is a true,
// honest "even month," not a gap to paper over.
function findCircledDates(month: YM, days: { d: number; card: DayCard }[]): CircledDate[] {
  const byCard = new Map<string, number[]>();
  for (const { d, card } of days) {
    const list = byCard.get(card.minorName) ?? [];
    list.push(d);
    byCard.set(card.minorName, list);
  }
  const out: CircledDate[] = [];
  for (const [card, dayNumbers] of byCard) {
    if (dayNumbers.length < 2) continue;
    out.push({ card, dayNumbers, dates: formatCircleDates(month, dayNumbers) });
  }
  return out.sort((a, b) => a.dayNumbers[0] - b.dayNumbers[0]);
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function buildMonthlyPackage(month: YM, bm: number, bd: number): MonthlyPackage {
  const monthMajor = personalMonth(month.y, month.m, bm, bd);
  const monthCardData = getCardBySlug(MAJOR_SLUGS[monthMajor]);
  if (!monthCardData) throw new Error(`No card data for major ${monthMajor}`);
  const thisMonthReading = monthCardData.positionReadings?.ongoingPersonalMonth?.body;
  if (!thisMonthReading) {
    throw new Error(`Card ${monthCardData.slug} is missing its ongoingPersonalMonth reading`);
  }

  const prevYM = addMonths(month, -1);
  const nextYM = addMonths(month, 1);
  const prevMajor = personalMonth(prevYM.y, prevYM.m, bm, bd);
  const nextMajor = personalMonth(nextYM.y, nextYM.m, bm, bd);

  const bIdx = bearingIndex(bm, bd);
  const bearingElement = ELEMENT_BY_MAJOR[bIdx];
  const monthElement = ELEMENT_BY_MAJOR[monthMajor];

  const days: { d: number; card: DayCard }[] = [];
  for (let d = 1; d <= daysInMonth(month); d++) {
    days.push({ d, card: personalDayCard(month.y, month.m, d, bm, bd) });
  }

  const relation: BearingVsMonthRelation =
    bIdx === 0 ? "in-step-fool" : bearingElement === monthElement ? "agree" : "clash";
  const echoDayCount = days.filter(({ card }) => card.element === bearingElement).length;

  return {
    month,
    monthLabel: `${MONTH_NAMES[month.m - 1]} ${month.y}`,
    monthCard: {
      ...majorFacts(monthMajor),
      tagline: monthCardData.meta.tagline,
      numberLabel: monthCardData.numberLabel,
      essence: monthCardData.essence,
      thisMonthReading,
      skills: monthCardData.skills,
    },
    cycle: {
      prevName: MAJORS[prevMajor],
      prevSlug: MAJOR_SLUGS[prevMajor],
      nextName: MAJORS[nextMajor],
      nextSlug: MAJOR_SLUGS[nextMajor],
    },
    bearing: majorFacts(bIdx),
    bearingVsMonth: { relation, echoDayCount },
    weeks: groupWeeks(month, days),
    circledDates: findCircledDates(month, days),
  };
}
