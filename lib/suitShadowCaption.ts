// Shared caption composer for every suit's "Shadow Meanings" board. boardName is passed in
// per-instantiation, same reasoning as lib/suitGiftCaption.ts.
import type { Card } from "./cards";
import { SITE_URL } from "./site";
import { truncateField, TITLE_MAX, DESCRIPTION_MAX, type PinterestPinCopy } from "./pinterestPinCopy";

const HASHTAGS = "#tarotcardmeanings #minorarcana #shadowwork";

export function suitShadowCopy(card: Card, boardName: string): PinterestPinCopy {
  const title = truncateField(`${card.name} Tarot Card Meaning: Shadow`, TITLE_MAX);

  const description = truncateField(
    `${card.name} tarot card shadow meaning: ${card.shadow.body} Explore the full ${card.name} card meaning at tarotalmanac.com. ${HASHTAGS}`,
    DESCRIPTION_MAX,
  );

  return {
    title,
    description,
    destinationUrl: `${SITE_URL}/tarot/${card.slug}`,
    altText: `${card.name} tarot card shadow meaning: ${card.shadow.keywords.slice(0, 3).join(", ")}.`,
    boardName,
    keywords: card.shadow.keywords.join(", "),
  };
}
