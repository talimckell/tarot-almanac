import { MAJORS, type DayCard, type Element } from "./almanac";

// ===== Birthday persistence =====
// No accounts exist yet. The homepage's reveal form (and any /today link) passes
// ?b=YYYY-MM-DD; middleware.ts stashes it in this cookie so navigating within
// /today/[date] (the stepper, month/year links) keeps the personal column without
// needing ?b= threaded through every link by hand.
export const BIRTHDAY_COOKIE = "bday";
export const BIRTHDAY_RE = /^\d{4}-\d{2}-\d{2}$/;

export interface Birthday {
  bm: number;
  bd: number;
}

// Minimum age to use the Almanac as yourself (Terms of Service section 2). Doesn't
// apply to a saved chart made for someone else in an account holder's library —
// that's the account holder's own information about another person (a minor in
// their care, say), not a new account being opened.
export const MIN_AGE = 16;

export function ageOn(by: number, bm: number, bd: number, now: YMD): number {
  let age = now.y - by;
  if (now.m < bm || (now.m === bm && now.d < bd)) age--;
  return age;
}

export function isOldEnough(by: number, bm: number, bd: number, now: YMD): boolean {
  return ageOn(by, bm, bd, now) >= MIN_AGE;
}

// A birthdate that computes to under 16 is treated exactly like no birthdate at
// all — it just doesn't unlock a personal reading, the same way an empty field
// wouldn't. `now` must come from the caller (request time on the server, the
// viewer's clock in the browser) since this file can't call Date.now() itself.
export function parseBirthday(raw: string | undefined | null, now: YMD): Birthday | null {
  if (!raw || !BIRTHDAY_RE.test(raw)) return null;
  const [byStr, bmStr, bdStr] = raw.split("-");
  const by = Number(byStr);
  const bm = Number(bmStr);
  const bd = Number(bdStr);
  if (!isOldEnough(by, bm, bd, now)) return null;
  return { bm, bd };
}

// ===== Time-travel access gate =====
// Product rule: past is fully open; future is capped at the current month plus one
// month ahead (anti-screenshot-harvest). Replaces the today-new-layout.html mockup's
// stub, which just popped a paywall on any Earlier/Later click with no real
// date-boundary check.
export interface YMD {
  y: number;
  m: number; // 1-indexed
  d: number;
}

export function isDateOpen(target: YMD, now: YMD): boolean {
  const targetMs = Date.UTC(target.y, target.m - 1, target.d);
  // Date.UTC(y, m+1, 0) = the last day of month (m+1), 1-indexed — JS normalizes the
  // month-13 case into January of the next year automatically.
  const boundaryMs = Date.UTC(now.y, now.m + 1, 0);
  return targetMs <= boundaryMs;
}

// Free tier: only the current month, day 1 through today. Subscribers get the full
// structural window above (isDateOpen). This is a business decision ("we can't give
// the almanac away for free"), not a technical constraint.
export function isDateOpenForViewer(target: YMD, now: YMD, subscribed: boolean): boolean {
  if (subscribed) return isDateOpen(target, now);
  if (target.y !== now.y || target.m !== now.m) return false;
  return target.d <= now.d;
}

// True when target is today or earlier (UTC day granularity).
export function isPastOrToday(target: YMD, now: YMD): boolean {
  return Date.UTC(target.y, target.m - 1, target.d) <= Date.UTC(now.y, now.m - 1, now.d);
}

// The COLLECTIVE (non-personal) track is public for every past/today date: this is
// the free, indexable "card of the day" archive that SEO rides on. Future dates
// stay on the same time-travel gate as the personal track (anti-screenshot-harvest;
// subscribers reach one month ahead). The personal track is unaffected — it always
// uses isDateOpenForViewer, so paid past readings stay paid.
export function isCollectiveOpenForViewer(target: YMD, now: YMD, subscribed: boolean): boolean {
  if (isPastOrToday(target, now)) return true;
  return isDateOpenForViewer(target, now, subscribed);
}

// A locked target's whole month unlocks in one shot, the day the calendar rolls
// into the month before it (that becomes the new "current month," making target's
// month the new one-ahead). Signed-in accounts get told this date directly instead
// of the anonymous-visitor pitch to sign up, since they already have an account.
export function monthUnlockDate(target: YMD): YMD {
  // Date.UTC normalizes month 0 into December of the previous year for us.
  const d = new Date(Date.UTC(target.y, target.m - 2, 1));
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: 1 };
}

// ===== Date helpers (UTC-based, so day arithmetic never trips on DST) =====
export function addDays(target: YMD, delta: number): YMD {
  const ms = Date.UTC(target.y, target.m - 1, target.d) + delta * 86400000;
  const d = new Date(ms);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate() };
}

export function formatDateSlug(target: YMD): string {
  const mm = String(target.m).padStart(2, "0");
  const dd = String(target.d).padStart(2, "0");
  return `${target.y}-${mm}-${dd}`;
}

export function parseDateSlug(slug: string): YMD | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(slug);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  // Reject calendar-invalid dates (e.g. 2026-02-30) by round-tripping through UTC.
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCFullYear() !== y || check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) {
    return null;
  }
  return { y, m, d };
}

// ===== Month helpers (for /me's calendar) =====
export interface YM {
  y: number;
  m: number; // 1-indexed
}

export function parseMonthSlug(slug: string): YM | null {
  const match = /^(\d{4})-(\d{2})$/.exec(slug);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  if (m < 1 || m > 12) return null;
  return { y, m };
}

export function formatMonthSlug(target: YM): string {
  return `${target.y}-${String(target.m).padStart(2, "0")}`;
}

// A single comparable integer so months can be ordered/diffed without re-deriving
// the day-boundary math isDateOpen uses.
export function monthIndex(target: YM): number {
  return target.y * 12 + (target.m - 1);
}

export function addMonths(target: YM, delta: number): YM {
  const idx = monthIndex(target) + delta;
  return { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
}

// Same product rule as isDateOpen (past fully open, future capped at current + one
// month ahead) but at month granularity, since /me pages a whole month at a time.
export function isMonthOpen(target: YM, now: YM): boolean {
  return monthIndex(target) <= monthIndex(now) + 1;
}

// Free tier: only the current month page is viewable at all. Subscribers get the
// full structural window above (isMonthOpen).
export function isMonthOpenForViewer(target: YM, now: YM, subscribed: boolean): boolean {
  if (subscribed) return isMonthOpen(target, now);
  return monthIndex(target) === monthIndex(now);
}

export function daysInMonth(target: YM): number {
  return new Date(Date.UTC(target.y, target.m, 0)).getUTCDate();
}

// 0 (Sunday) .. 6 (Saturday), for laying out the leading blank calendar cells.
export function firstWeekday(target: YM): number {
  return new Date(Date.UTC(target.y, target.m - 1, 1)).getUTCDay();
}

export function formatMonthLabel(target: YM): string {
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${MONTH_NAMES[target.m - 1]} ${target.y}`;
}

// ===== Between-you synthesis =====
// Fixed template copy from today-new-layout.html, ported verbatim — not new prose.
const HARMONY: Record<Element, Element[]> = {
  fire: ["fire", "air"],
  air: ["air", "fire"],
  water: ["water", "earth"],
  earth: ["earth", "water"],
};
const ELEMENT_VERB: Record<Element, string> = {
  fire: "moving through fire",
  water: "moving through water",
  air: "moving through air",
  earth: "moving through earth",
};
function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function synthesis(collective: DayCard, personal: DayCard): string {
  if (collective.suit === personal.suit) {
    return `You and the world share an element today, both ${ELEMENT_VERB[collective.element]}, at different points along it. The weather outside and the weather in you rhyme, even if they're not the same note.`;
  }
  if (collective.rank >= 11 && personal.rank >= 11) {
    return "Today is about selves and how they meet, the world showing up as one kind of figure, you as another. A day to notice the roles people are playing, including yours.";
  }
  if (HARMONY[collective.element].includes(personal.element)) {
    return `The world's element and yours sit easily together today. ${cap(ELEMENT_VERB[collective.element])} and ${ELEMENT_VERB[personal.element]} tend to feed each other. What's around you and what's in you are likely to support one another.`;
  }
  return `The world's element and yours pull different ways today, ${ELEMENT_VERB[collective.element]} against ${ELEMENT_VERB[personal.element]}. That friction isn't a problem to solve so much as a tension to feel honestly. The gap between the world's grain and your own is the reading.`;
}

// Shown in the personal column's synthesis slot when no birthday has been entered.
export const NO_BIRTHDAY_SYNTHESIS =
  "Your card and the world's, side by side, is the real reading. Add your birthday to see both.";

// The alignment-flag line, shown when the Bearing equals the collective day's Major.
export function alignmentText(bearingName: (typeof MAJORS)[number]): string {
  return `Your Bearing and the world's day major are both ${bearingName} today`;
}
