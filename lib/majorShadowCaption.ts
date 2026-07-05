import type { Card } from "./cards";
import { SITE_URL } from "./site";
import { truncateField, TITLE_MAX, DESCRIPTION_MAX, type PinterestPinCopy } from "./pinterestPinCopy";

const HASHTAGS = "#tarotcardmeanings #majorarcana #shadowwork";

export function majorShadowCopy(card: Card): PinterestPinCopy {
  const title = truncateField(`${card.name} Tarot Card Meaning: Shadow`, TITLE_MAX);

  // Unlike gift.body, shadow.body doesn't universally open with a matching lead word
  // (only 4/22 start with "Reversed,"), so this framing doesn't try to echo one.
  const description = truncateField(
    `${card.name} tarot card shadow meaning: ${card.shadow.body} Explore the full ${card.name} card meaning at tarotalmanac.com. ${HASHTAGS}`,
    DESCRIPTION_MAX,
  );

  return {
    title,
    description,
    destinationUrl: `${SITE_URL}/tarot/${card.slug}`,
    altText: `${card.name} tarot card shadow meaning: ${card.shadow.keywords.slice(0, 3).join(", ")}.`,
  };
}
