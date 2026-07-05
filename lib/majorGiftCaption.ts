import type { Card } from "./cards";
import { SITE_URL } from "./site";
import { truncateField, TITLE_MAX, DESCRIPTION_MAX, type PinterestPinCopy } from "./pinterestPinCopy";

const HASHTAGS = "#tarotcardmeanings #majorarcana #tarotmeaning";

// Must match the board's exact title in the owner's Pinterest account (case-sensitive) —
// this is how Pinterest's bulk-upload CSV routes a pin to the right board.
const BOARD_NAME = "Major Arcana Gift Meanings";

export function majorGiftCopy(card: Card): PinterestPinCopy {
  const title = truncateField(`${card.name} Tarot Card Meaning: Upright`, TITLE_MAX);

  // gift.body always opens with "Upright, ..." itself (verified across all 22 Majors), so
  // the lead-in here doesn't repeat the word — avoids "meaning, upright: Upright, ...".
  const description = truncateField(
    `${card.name} tarot card meaning: ${card.gift.body} Explore the full ${card.name} card meaning at tarotalmanac.com. ${HASHTAGS}`,
    DESCRIPTION_MAX,
  );

  return {
    title,
    description,
    destinationUrl: `${SITE_URL}/tarot/${card.slug}`,
    altText: `${card.name} tarot card meaning (upright/gift): ${card.gift.keywords.slice(0, 3).join(", ")}.`,
    boardName: BOARD_NAME,
    keywords: card.gift.keywords.join(", "),
  };
}
