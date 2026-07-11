// The Substack Note caption that ships alongside each image (captions.txt in the batch
// ZIP). Orientation/marketing copy, not reading text (see CLAUDE.md): it names the
// collective card in words for the feed and points to the site.
import type { CollectiveVsYouDay } from "./collectiveVsYouContent";

export function captionForCollectiveVsYou(day: CollectiveVsYouDay): string {
  const { card } = day;
  return [
    day.dateLabel,
    "",
    `The collective card today is ${card.majorName}, carried by the ${card.minorName}. Everyone shares it.`,
    "Your own card is set by your birthday. Find yours at tarotalmanac.com/today.",
  ].join("\n");
}
