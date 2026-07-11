// Assembles the content for one Substack Notes "collective card vs your card" post for a
// given date. The collective side is the real computed card of the day (public, identical
// for everyone); the "your card" side is deliberately withheld — it's the call to action
// that sends people to the site to find the card their own birthday sets. Only authored
// copy is wired up here (the collective reading's opening line); no reading text is
// generated (see CLAUDE.md).
import { collectiveDayCard, formatLongDate, type DayCard } from "./almanac";
import { getCollectiveReading } from "./collectiveReadings";
import { formatDateSlug, type YMD } from "./today";

export interface CollectiveVsYouDay {
  slug: string; // "2026-07-11"
  dateLabel: string; // "July 11, 2026"
  card: DayCard; // the collective card of the day
  opening: string; // the collective reading's authored first sentence, or "" if none
}

function firstSentence(text: string): string {
  const trimmed = text.trim();
  const m = /^.*?[.!?](?=\s|$)/.exec(trimmed);
  return (m ? m[0] : trimmed).trim();
}

export function assembleCollectiveVsYouDay(target: YMD): CollectiveVsYouDay {
  const card = collectiveDayCard(target.y, target.m, target.d);
  const reading = getCollectiveReading(card);
  return {
    slug: formatDateSlug(target),
    dateLabel: formatLongDate(target.y, target.m, target.d),
    card,
    opening: reading ? firstSentence(reading) : "",
  };
}
