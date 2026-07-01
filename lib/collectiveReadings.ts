import readings from "./data/collective-readings.json";
import type { DayCard } from "./almanac";

// The collective ("world's today") reading for each Minor, authored in the card content
// database (tarot-content-database/content/cards/*.json, field collectiveReading.body,
// status BLESSED). Not generated here — only wired up. Keyed by card slug, e.g. "four-of-cups".
const READINGS: Record<string, string> = readings;

export function getCollectiveReading(card: DayCard): string | undefined {
  const slug = `${card.rankName.toLowerCase()}-of-${card.suit.toLowerCase()}`;
  return READINGS[slug];
}
