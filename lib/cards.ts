import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { MAJOR_SLUGS, type Element } from "./almanac";

const CARDS_DIR = join(process.cwd(), "content", "cards");

export interface CardFace {
  keywords: string[];
  body: string;
  affirmation: string;
}

// Parsed from cardReading.cardMeta, which comes in two shapes:
//   Major: "Major Arcana XVIII · Water · the walk through the unclear"
//   Minor: "Minor Arcana · Wands · Three · Fire · the first ships come back"
export interface CardMeta {
  arcana: "major" | "minor";
  tagline: string;
  romanOrNumber?: string; // majors only — "XVIII", or "0" for the Fool (arabic, not roman)
  suit?: string; // minors only
  rankName?: string; // minors only
  element: string; // raw casing from the data, e.g. "Water"
}

// Majors only — the role-specific reading for each of the 8 slots a Major can
// appear in (natal chart position, or the living almanac's Year/Month links).
// Distinct authored text per role, same pattern as personal-readings.json /
// collective-readings.json already do for Minors at the day level.
export interface PositionReading {
  label: string;
  body: string;
}

export interface Card {
  arcana: "major" | "minor";
  name: string;
  slug: string;
  numberLabel?: string; // majors only, e.g. "XVIII" or "0"
  meta: CardMeta;
  essence: string;
  narrative: string;
  gift: CardFace;
  shadow: CardFace;
  reclaiming: CardFace;
  skills: string[];
  majorIndex?: number; // majors only — index into MAJOR_SLUGS/MAJORS, not parsed from
  // the roman numeral; looked up by slug against the already-verified fixed order.
  element: Element; // lowercase, for CSS var lookups and glyph color
  positionReadings?: Record<string, PositionReading>; // majors only
  natalPersonalDay?: string; // minors only — the natal chart's Rising position
  natalCollectiveDay?: string; // minors only — the natal chart's "day that caught you"
  bearingReading?: string; // majors only — the real, full Bearing essay. data/bearings.json
  // carries a much shorter placeholder under the same shape; this field (each card's own
  // top-level `bearing.body`) is the actual authored content.
}

interface RawCardReading {
  cardMeta: string;
  essence: string;
  narrative: string;
  gift: CardFace;
  shadow: CardFace;
  reclaiming: CardFace;
  skills: string[];
}

interface RawCard {
  arcana: "major" | "minor";
  name: string;
  slug: string;
  numberLabel?: string;
  cardReading: RawCardReading;
  positionReadings?: { positions: Record<string, PositionReading> };
  natalPersonalDay?: { body: string };
  natalCollectiveDay?: { body: string };
  bearing?: { body: string };
}

export function parseCardMeta(raw: string): CardMeta {
  const parts = raw.split("·").map((s) => s.trim());
  if (parts[0].startsWith("Major Arcana")) {
    return {
      arcana: "major",
      romanOrNumber: parts[0].replace(/^Major Arcana\s*/, ""),
      element: parts[1],
      tagline: parts[parts.length - 1],
    };
  }
  return {
    arcana: "minor",
    suit: parts[1],
    rankName: parts[2],
    element: parts[3],
    tagline: parts[parts.length - 1],
  };
}

let cache: Card[] | null = null;

export function getAllCards(): Card[] {
  if (cache) return cache;
  const files = readdirSync(CARDS_DIR).filter((f) => f.endsWith(".json"));
  cache = files.map((file) => {
    const raw: RawCard = JSON.parse(readFileSync(join(CARDS_DIR, file), "utf-8"));
    const cr = raw.cardReading;
    const meta = parseCardMeta(cr.cardMeta);
    const majorIndex =
      meta.arcana === "major"
        ? (MAJOR_SLUGS as readonly string[]).indexOf(raw.slug)
        : undefined;
    return {
      arcana: raw.arcana,
      name: raw.name,
      slug: raw.slug,
      numberLabel: raw.numberLabel,
      meta,
      essence: cr.essence,
      narrative: cr.narrative,
      gift: cr.gift,
      shadow: cr.shadow,
      reclaiming: cr.reclaiming,
      skills: cr.skills,
      majorIndex,
      element: meta.element.toLowerCase() as Element,
      positionReadings: raw.positionReadings?.positions,
      natalPersonalDay: raw.natalPersonalDay?.body,
      natalCollectiveDay: raw.natalCollectiveDay?.body,
      bearingReading: raw.bearing?.body,
    };
  });
  return cache;
}

export function getCardBySlug(slug: string): Card | undefined {
  return getAllCards().find((c) => c.slug === slug);
}

// A Major's reading for one specific role — e.g. "natalPersonalYear" for the
// natal chart's Personal Year position, or "ongoingPersonalMonth" for the
// living almanac's "Your Month" link. Falls back to the card's general essence
// if that specific position slot isn't authored (shouldn't happen for the 8
// natal/ongoing keys, but keeps this safe if the data ever changes shape).
export function getPositionReading(slug: string, position: string): PositionReading | undefined {
  const card = getCardBySlug(slug);
  return card?.positionReadings?.[position];
}

// Suit-mate/rank-mate for minors; neighbor-on-the-wheel/element-mate for majors.
// Deduped, capped at 3.
export function getRelated(card: Card): Card[] {
  const all = getAllCards();
  const out: Card[] = [];

  if (card.arcana === "minor") {
    const suitMates = all.filter(
      (c) => c.arcana === "minor" && c.meta.suit === card.meta.suit && c.slug !== card.slug
    );
    const rankMates = all.filter(
      (c) => c.arcana === "minor" && c.meta.rankName === card.meta.rankName && c.slug !== card.slug
    );
    out.push(...suitMates.slice(0, 2), ...rankMates.slice(0, 2));
  } else {
    const neighbors = all.filter(
      (c) =>
        c.arcana === "major" &&
        c.majorIndex !== undefined &&
        card.majorIndex !== undefined &&
        Math.abs(c.majorIndex - card.majorIndex) === 1
    );
    const elemMates = all.filter(
      (c) => c.arcana === "major" && c.element === card.element && c.slug !== card.slug
    );
    out.push(...neighbors, ...elemMates.slice(0, 2));
  }

  const seen = new Set<string>();
  return out.filter((c) => (seen.has(c.slug) ? false : (seen.add(c.slug), true))).slice(0, 3);
}
