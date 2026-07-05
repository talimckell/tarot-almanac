// Shared caption composer for every suit's "Gift Meanings" board. boardName is passed in
// per-instantiation (e.g. "Tarot Minor Arcana Suit of Cups Gift Meanings") since it must
// match the owner's real Pinterest board title exactly.
import type { Card } from "./cards";
import { SITE_URL } from "./site";
import { truncateField, TITLE_MAX, DESCRIPTION_MAX, type PinterestPinCopy } from "./pinterestPinCopy";

const HASHTAGS = "#tarotcardmeanings #minorarcana #tarotmeaning";

// Unlike the Majors (verified 22/22 open with "Upright, "), minors are inconsistent —
// e.g. 12/14 Cups gift.body bodies open with it, 2 don't (Four/Five of Cups) — so this
// only strips the prefix when it's actually present, rather than assuming it universally.
const UPRIGHT_PREFIX = "Upright, ";
function giftBodyForCaption(card: Card): string {
  return card.gift.body.startsWith(UPRIGHT_PREFIX) ? card.gift.body.slice(UPRIGHT_PREFIX.length) : card.gift.body;
}

export function suitGiftCopy(card: Card, boardName: string): PinterestPinCopy {
  const title = truncateField(`${card.name} Tarot Card Meaning: Upright`, TITLE_MAX);

  const description = truncateField(
    `${card.name} tarot card meaning: Upright, ${giftBodyForCaption(card)} Explore the full ${card.name} card meaning at tarotalmanac.com. ${HASHTAGS}`,
    DESCRIPTION_MAX,
  );

  return {
    title,
    description,
    destinationUrl: `${SITE_URL}/tarot/${card.slug}`,
    altText: `${card.name} tarot card meaning (upright/gift): ${card.gift.keywords.slice(0, 3).join(", ")}.`,
    boardName,
    keywords: card.gift.keywords.join(", "),
  };
}
