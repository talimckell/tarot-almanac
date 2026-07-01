// The Tarot Almanac engine.
// Every formula here matches /docs/TAROT_ALMANAC_CALCULATIONS.md exactly.
// The math is settled; do not reinvent it. When in doubt, verify against that doc.

export const MAJORS = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged One", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun", "Judgement", "The World",
] as const;

export type Element = "fire" | "water" | "air" | "earth";

// Element per Major (index 0-21). Follows Golden Dawn correspondences: zodiacal Majors
// by triplicity, planetary Majors by the standard modern derivation.
// Source of truth: tarotalmanacMASTER.xlsx (Majors tab, Element column), verified
// against Golden Dawn sources. See /docs/TAROT_ALMANAC_CALCULATIONS.md.
// TODO(card-data-pipeline): replace this hardcoded table with a read from card data.
// Each card JSON's `cardMeta` already carries the element ("... · Air · ..."); the export
// step should parse it into a clean `element` field that this file reads. No xlsx needed.
// This table drifted once (the doc had 8 Majors wrong); data-driving it prevents a repeat.
export const ELEMENT_BY_MAJOR: readonly Element[] = [
  "air",   //  0 The Fool
  "air",   //  1 The Magician
  "water", //  2 The High Priestess
  "earth", //  3 The Empress
  "fire",  //  4 The Emperor
  "earth", //  5 The Hierophant
  "air",   //  6 The Lovers
  "water", //  7 The Chariot
  "fire",  //  8 Strength
  "earth", //  9 The Hermit
  "fire",  // 10 Wheel of Fortune
  "air",   // 11 Justice
  "water", // 12 The Hanged One
  "water", // 13 Death
  "fire",  // 14 Temperance
  "earth", // 15 The Devil
  "fire",  // 16 The Tower
  "air",   // 17 The Star
  "water", // 18 The Moon
  "fire",  // 19 The Sun
  "fire",  // 20 Judgement
  "earth", // 21 The World
];

export const SUIT_BY_ELEMENT: Record<Element, string> = {
  fire: "Wands",
  water: "Cups",
  air: "Swords",
  earth: "Pentacles",
};

export const RANKS = [
  "Ace", "Two", "Three", "Four", "Five", "Six", "Seven",
  "Eight", "Nine", "Ten", "Page", "Knight", "Queen", "King",
] as const;

export function mod22(n: number): number {
  return ((n % 22) + 22) % 22;
}

export function sumDigits(n: number): number {
  return String(Math.abs(n)).split("").reduce((a, c) => a + Number(c), 0);
}

// Collective track: same for everyone on a given date.
export function collectiveYear(y: number): number {
  return mod22(sumDigits(y));
}
export function collectiveMonth(y: number, m: number): number {
  return mod22(collectiveYear(y) + m);
}
export function collectiveDayMajor(y: number, m: number, d: number): number {
  return mod22(collectiveMonth(y, m) + d);
}

// The day's Minor rank, free within the suit. dateSeed = YYYYMMDD.
// Rank = ((dateSeed * 11) mod 14) + 1  ->  1..14 (Ace..King).
export function dayRank(y: number, m: number, d: number): number {
  const dateSeed = y * 10000 + m * 100 + d;
  return ((dateSeed * 11) % 14) + 1;
}

export interface DayCard {
  major: number;
  majorName: string;
  element: Element;
  suit: string;
  rank: number;      // 1..14
  rankName: string;
  minorName: string; // e.g. "Three of Cups"
}

export function collectiveDayCard(y: number, m: number, d: number): DayCard {
  const major = collectiveDayMajor(y, m, d);
  const element = ELEMENT_BY_MAJOR[major];
  const suit = SUIT_BY_ELEMENT[element];
  const rank = dayRank(y, m, d);
  const rankName = RANKS[rank - 1];
  return {
    major,
    majorName: MAJORS[major],
    element,
    suit,
    rank,
    rankName,
    minorName: `${rankName} of ${suit}`,
  };
}

// The three phase bands of the cycle, read off the day's Major.
export function phaseBand(major: number): "Initiation" | "Testing" | "Reckoning" {
  if (major <= 7) return "Initiation";
  if (major <= 14) return "Testing";
  return "Reckoning";
}

// Moon phase from the mean synodic month, referenced to the 2000-01-06 new moon.
const SYNODIC_MONTH = 29.530588853;
const NEW_MOON_EPOCH = Date.UTC(2000, 0, 6, 18, 14) / 86400000;
const MOON_PHASES = [
  "New moon", "Waxing crescent", "First quarter", "Waxing gibbous",
  "Full moon", "Waning gibbous", "Last quarter", "Waning crescent",
] as const;

export function moonPhase(y: number, m: number, d: number): string {
  const days = Date.UTC(y, m - 1, d, 12, 0) / 86400000 - NEW_MOON_EPOCH;
  let frac = (days % SYNODIC_MONTH) / SYNODIC_MONTH;
  if (frac < 0) frac += 1;
  return MOON_PHASES[Math.floor(frac * 8 + 0.5) % 8];
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function formatLongDate(y: number, m: number, d: number): string {
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}
