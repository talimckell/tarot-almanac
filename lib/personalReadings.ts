import readings from "./data/personal-readings.json";
import type { DayCard } from "./almanac";

// The personal ("your day") reading for each Minor, authored in the card content database
// (tarot-content-database/content/cards/*.json, field personalReading.body, status DRAFT —
// draft is the confirmed authoritative text for now, not a placeholder to override). Not
// generated here — only wired up. Keyed by card slug, e.g. "four-of-cups".
const READINGS: Record<string, string> = readings;

export function getPersonalReading(card: DayCard): string | undefined {
  const slug = `${card.rankName.toLowerCase()}-of-${card.suit.toLowerCase()}`;
  return READINGS[slug];
}
