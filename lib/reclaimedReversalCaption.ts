import type { Card } from "./cards";
import { SITE_URL } from "./site";

const BLUESKY_MAX = 300;

function truncate(text: string, budget: number): string {
  if (text.length <= budget) return text;
  return `${text.slice(0, Math.max(0, budget - 1)).trimEnd()}…`;
}

// As much of the reclaiming reading as fits, headed by the card name and closed with the
// card's own /tarot/[slug] URL (full https:// so Bluesky reliably auto-links it) + #tarotsky.
export function captionForReclaimedReversal(card: Card): string {
  const headline = `${card.name} Reversed`;
  const url = `${SITE_URL}/tarot/${card.slug}`;
  const tail = `\n\n${url} #tarotsky`;
  const room = BLUESKY_MAX - headline.length - tail.length - 2; // 2 for the headline/body join
  const body = truncate(card.reclaiming.body, Math.max(room, 40));
  return `${headline}\n\n${body}${tail}`;
}
