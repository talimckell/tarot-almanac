// Shared shape for a Pinterest pin's SEO copy — title, description, destination URL, and
// alt text are genuinely separate fields on Pinterest's own pin-creation form (unlike
// Bluesky, where everything is one text blob), so this is structured, not a flat string.
// Meant to be the pattern every future board's caption composer returns.
export interface PinterestPinCopy {
  title: string; // ideal 40-60 chars, hard max 100 — keyword first, Pinterest's own guidance
  description: string; // ideal 200-300 chars, hard max 500 — front-load the first 50-60
  destinationUrl: string;
  altText: string;
}

const TITLE_MAX = 100;
const DESCRIPTION_MAX = 500;

export function truncateField(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}

export { TITLE_MAX, DESCRIPTION_MAX };
