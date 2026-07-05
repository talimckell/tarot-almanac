// Assembles the authored content one collective-card social post needs, for a given
// date — nothing here is new copy, it's all pulled from what already exists (essence,
// gift.affirmation, gift.keywords, the day's collectiveReading line).
import { collectiveDayCard, formatLongDate, type DayCard } from "./almanac";
import type { YMD } from "./today";
import { getCardBySlug } from "./cards";
import { getCollectiveReading } from "./collectiveReadings";

function minorSlug(card: DayCard): string {
  return `${card.rankName.toLowerCase()}-of-${card.suit.toLowerCase()}`;
}

export interface CampaignDay {
  date: YMD;
  dateLabel: string;
  card: DayCard;
  slug: string;
  essence: string;
  affirmation: string;
  keywords: string[];
  collectiveLine: string;
}

export function assembleCampaignDay(date: YMD): CampaignDay {
  const card = collectiveDayCard(date.y, date.m, date.d);
  const slug = minorSlug(card);
  const full = getCardBySlug(slug);
  return {
    date,
    dateLabel: formatLongDate(date.y, date.m, date.d),
    card,
    slug,
    essence: full?.essence ?? "",
    affirmation: full?.gift.affirmation ?? "",
    keywords: full?.gift.keywords ?? [],
    collectiveLine: (getCollectiveReading(card) ?? "").trim(),
  };
}
