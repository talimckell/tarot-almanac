// Shared frame arithmetic for the DailyCard composition. Root.tsx's calculateMetadata
// and DailyCard.tsx both call this, so the video's total duration and the scene
// boundaries inside it can never drift apart. Durations scale with the featured text:
// a longer line holds on screen longer (~3 words/second reading pace).
import type { ShortProps } from "./types";

export const FPS = 30;

export interface ShortTiming {
  /** Frame the card reveal (pips + name + featured text fade-in) is fully done. */
  revealEnd: number;
  /** Frame the end card starts crossfading in. */
  endStart: number;
  /** Total composition length in frames. */
  total: number;
}

// The text the viewer actually reads on a given treatment — what the hold time
// should scale with. Mirrors lib/campaignRender.tsx's field-per-treatment mapping.
export function featuredText(props: Pick<ShortProps, "treatment" | "essence" | "affirmation" | "keywords" | "collectiveLine">): string {
  switch (props.treatment % 4) {
    case 0:
      return props.affirmation;
    case 1:
      return props.essence;
    case 2:
      return props.keywords.slice(0, 3).join(", ");
    case 3:
    default:
      return props.collectiveLine;
  }
}

export function shortTiming(text: string): ShortTiming {
  const words = text.split(/\s+/).filter(Boolean).length;
  const revealEnd = 150; // 5s: intro + pip draw-on + name + featured-text entrance
  const hold = Math.max(210, Math.round((words / 3) * FPS));
  const endLength = 105; // 3.5s end card
  const endStart = revealEnd + hold;
  return { revealEnd, endStart, total: endStart + endLength };
}

export function timingForProps(props: Parameters<typeof featuredText>[0]): ShortTiming {
  return shortTiming(featuredText(props));
}
