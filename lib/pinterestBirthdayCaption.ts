import type { BirthdayBearingDay } from "./birthdayCampaignContent";
import { SITE_URL } from "./site";
import { truncateField, TITLE_MAX, DESCRIPTION_MAX, type PinterestPinCopy } from "./pinterestPinCopy";

// Niche, specific hashtags per Pinterest's current guidance (keywords do the real ranking
// work; hashtags are a light finishing touch, 2-5, placed at the end — never leading).
const HASHTAGS = "#birthdaytarot #tarotbearing #tarotcardmeanings";

export function pinterestBirthdayCopy(day: BirthdayBearingDay): PinterestPinCopy {
  const title = truncateField(`${day.dateLabel} Birthday Tarot Card: ${day.bearingName}`, TITLE_MAX);

  const openingPart = day.opening ? ` ${day.opening}` : "";
  const description = truncateField(
    `If your birthday is ${day.dateLabel}, your tarot bearing card is ${day.bearingName}.${openingPart} Everyone born on ${day.dateLabel} shares this lifelong tarot birthday card. Find your own birthday tarot card meaning at tarotalmanac.com. ${HASHTAGS}`,
    DESCRIPTION_MAX,
  );

  return {
    title,
    description,
    destinationUrl: `${SITE_URL}${day.birthdayPath}`,
    altText: `${day.dateLabel} birthday tarot card: ${day.bearingName}, the tarot bearing shared by everyone born on this date.`,
  };
}
