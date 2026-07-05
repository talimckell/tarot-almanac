import type { Card } from "./cards";
import { SITE_URL } from "./site";
import { truncateField, TITLE_MAX, DESCRIPTION_MAX, type PinterestPinCopy } from "./pinterestPinCopy";

const HASHTAGS = "#tarotcardmeanings #majorarcana #reclaiming";

// Must match the board's exact title in the owner's Pinterest account (case-sensitive) —
// this is how Pinterest's bulk-upload CSV routes a pin to the right board.
const BOARD_NAME = "Major Arcana Reclaimed Reversal Meanings";

export function majorReclaimedCopy(card: Card): PinterestPinCopy {
  const title = truncateField(`${card.name} Tarot Card Meaning: Reclaimed Reversal`, TITLE_MAX);

  // Unlike gift.body, reclaiming.body has no universal leading word to echo (checked:
  // most open with "The [Name]...", a few with "[Name] reverses...") — no redundancy risk.
  const description = truncateField(
    `${card.name} tarot card reclaimed reversal meaning: ${card.reclaiming.body} Explore the full ${card.name} card meaning at tarotalmanac.com. ${HASHTAGS}`,
    DESCRIPTION_MAX,
  );

  return {
    title,
    description,
    destinationUrl: `${SITE_URL}/tarot/${card.slug}`,
    altText: `${card.name} tarot card reclaimed reversal meaning: ${card.reclaiming.keywords.slice(0, 3).join(", ")}.`,
    boardName: BOARD_NAME,
    keywords: card.reclaiming.keywords.join(", "),
  };
}
