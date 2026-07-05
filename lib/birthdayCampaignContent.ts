// Assembles the content one "Birthday Bearings" post needs for a given calendar date.
// The Bearing depends only on month+day (bearingIndex = mod22(bm+bd)), never the year, so
// this campaign recurs forever — the same date always produces the same post.
import { bearingIndex, MAJORS, MAJOR_SLUGS, ELEMENT_BY_MAJOR, type Element } from "./almanac";
import type { YMD } from "./today";
import { getCardBySlug } from "./cards";
import { birthdaySlug, formatBirthdayLabel } from "./birthday";

export interface BirthdayBearingDay {
  m: number;
  d: number;
  dateLabel: string; // "July 5" — no year, birthdays recur
  major: number;
  bearingName: string;
  element: Element;
  slug: string; // the Bearing card's own slug, e.g. "star"
  birthdayPath: string; // "/birthday/july-5"
  opening: string; // the Bearing essay's first sentence, e.g. "You move with drive."
}

function firstSentence(text: string): string {
  const trimmed = text.trim();
  const m = /^.*?[.!?](?=\s|$)/.exec(trimmed);
  return (m ? m[0] : trimmed).trim();
}

export function assembleBirthdayBearingDay(target: YMD): BirthdayBearingDay {
  const major = bearingIndex(target.m, target.d);
  const slug = MAJOR_SLUGS[major];
  const card = getCardBySlug(slug);
  return {
    m: target.m,
    d: target.d,
    dateLabel: formatBirthdayLabel(target.m, target.d),
    major,
    bearingName: MAJORS[major],
    element: ELEMENT_BY_MAJOR[major],
    slug,
    birthdayPath: `/birthday/${birthdaySlug(target.m, target.d)}`,
    opening: card?.bearingReading ? firstSentence(card.bearingReading) : "",
  };
}
