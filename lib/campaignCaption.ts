import type { CampaignDay } from "./campaignContent";

// Bluesky's post limit is 300 graphemes; keep real margin under it since the CTA link
// must always survive intact even after truncating the excerpt. The full https:// URL
// (not the bare "tarotalmanac.com/today" text) so Bluesky's composer reliably auto-links
// it — a bare domain+path isn't guaranteed to be recognized as a link.
const CTA = "Find your personal card today → https://tarotalmanac.com/today #tarotsky";
const BLUESKY_MAX = 300;

function truncate(text: string, budget: number): string {
  if (text.length <= budget) return text;
  return `${text.slice(0, Math.max(0, budget - 1)).trimEnd()}…`;
}

function compose(headline: string, excerpt: string): string {
  const fixed = `${headline}\n\n${CTA}`;
  const room = BLUESKY_MAX - fixed.length - 4; // 4 for ".\n\n" joins between excerpt and headline
  const body = truncate(excerpt, Math.max(room, 40));
  return `${headline} — ${body}\n\n${CTA}`;
}

function excerptForTreatment(day: CampaignDay, treatment: number): string {
  switch (treatment) {
    case 0:
      return day.affirmation;
    case 1:
      return day.essence;
    case 2:
      return day.keywords.slice(0, 3).join(", ");
    case 3:
    default:
      return day.collectiveLine;
  }
}

// The caption deliberately pulls from a DIFFERENT content type than whatever's on the
// image, so the post doesn't just repeat itself in two places — a keywords-treatment
// image gets an essence caption, an essence image gets an affirmation caption, and so
// on. Offset by -1 (mod 4) through the same four treatments; since the offset is nonzero
// mod 4, no image treatment ever pairs with its own caption content.
export function captionForTreatment(day: CampaignDay, imageTreatment: number): string {
  const captionTreatment = (imageTreatment + 3) % 4;
  const headline = day.card.minorName;
  return compose(headline, excerptForTreatment(day, captionTreatment));
}
