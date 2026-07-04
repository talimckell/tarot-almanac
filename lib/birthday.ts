// Birthday-page layer: one static page per calendar birthday (month + day), each
// resolving to its Tarot Bearing. The Bearing is birth-fixed and year-independent
// (bearingIndex = mod22(bm+bd)), so these pages are public, evergreen SEO surfaces
// that target "[month] [day] tarot card" queries and funnel into /bearing + /chart.
import { bearingIndex } from "./almanac";

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

// February gets 29 so leap-day birthdays get a page. 1-indexed via [m-1].
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export interface MonthDay {
  m: number; // 1-indexed
  d: number;
}

export function birthdaySlug(m: number, d: number): string {
  return `${MONTH_NAMES[m - 1].toLowerCase()}-${d}`;
}

export function formatBirthdayLabel(m: number, d: number): string {
  return `${MONTH_NAMES[m - 1]} ${d}`;
}

export function parseBirthdaySlug(slug: string): MonthDay | null {
  const match = /^([a-z]+)-(\d{1,2})$/.exec(slug);
  if (!match) return null;
  const m = MONTH_NAMES.findIndex((n) => n.toLowerCase() === match[1]) + 1;
  if (m === 0) return null;
  const d = Number(match[2]);
  if (d < 1 || d > DAYS_IN_MONTH[m - 1]) return null;
  return { m, d };
}

// All 366 valid month/day pairs in calendar order (Feb 29 included).
export function allBirthdays(): MonthDay[] {
  const out: MonthDay[] = [];
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= DAYS_IN_MONTH[m - 1]; d++) out.push({ m, d });
  }
  return out;
}

// Bearing Major index for a birthday. Thin re-export so pages don't reach past this
// module into the almanac internals.
export function birthdayBearing(m: number, d: number): number {
  return bearingIndex(m, d);
}
