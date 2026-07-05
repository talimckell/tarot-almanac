import type { BirthdayBearingDay } from "./birthdayCampaignContent";
import { SITE_URL } from "./site";

// Bluesky's post limit is 300 graphemes. The full https:// URL (not a bare domain+path)
// so the composer reliably auto-links it. #birthday is the single highest-volume birthday
// tag (real people post it on their own birthday, unlike party/cake-themed variants), paired
// with the site's own #tarotsky.
const BLUESKY_MAX = 300;

function truncate(text: string, budget: number): string {
  if (text.length <= budget) return text;
  return `${text.slice(0, Math.max(0, budget - 1)).trimEnd()}…`;
}

export function captionForBirthdayBearing(day: BirthdayBearingDay): string {
  const url = `${SITE_URL}${day.birthdayPath}`;
  const tail = `\n\n${url} #tarotsky #birthday`;
  const headline = `${day.dateLabel} · Is today your birthday? Your Bearing is ${day.bearingName}.`;
  const fixed = `${headline}${tail}`;
  const room = BLUESKY_MAX - fixed.length - 2;
  if (room >= 20 && day.opening) {
    const body = truncate(day.opening, room);
    return `${headline} ${body}${tail}`;
  }
  return fixed;
}
