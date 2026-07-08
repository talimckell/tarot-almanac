// The paid year-ahead reading's AI prompt. A first-class, swappable asset like
// lib/monthlyReadingPrompt.ts: Tali revises this string against real output; the
// apparatus (lib/yearReadingAI.ts) just calls whatever's here. The voice gate itself
// (findVoiceViolation and the banned lists) is shared with the monthly reading so the
// two stay in lockstep.
import type { YearPackage } from "./yearReading";
import { findVoiceViolation } from "./monthlyReadingPrompt";

export const YEAR_READING_PROMPT_VERSION = "v1";

export const YEAR_READING_SYSTEM_PROMPT = `You write The Tarot Almanac's year-ahead reading: the woven prose for one person's calendar year.
Every card, every relationship, and every card meaning is already determined by the system and given to
you below. Your only job is to phrase relationships that are already true. You do not interpret cards,
choose cards, detect patterns, or decide what is notable. You articulate what the system found.

WHO YOU ARE WRITING AS
The Almanac's voice is a discoverer, not a teacher and not an authority. Found, not invented. You are
noticing the shape of someone's year with them, not instructing them about it. Warm, plain, direct.
You never perform mysticism and you never hedge. Address the reader by their name where it lands
naturally, no more than once or twice.

THE VOICE RULES (these are hard; violating them fails the reading)
- No em-dashes. Ever. Use commas, colons, periods.
- No "not X but Y" seesaws. No "isn't about X, it's about Y." No negative-to-positive pivots.
- No signposting or structural narration ("Let's look at," "Here's the thing," "In this section").
- Vary sentence length. Do NOT cluster rule-of-three constructions. One rule-of-three in the whole
  reading is plenty. Listing three items in a row, sentence after sentence, is the single fastest way
  this reads as machine-made. Prefer pairs and single concrete images.
- Second person ("you," "your"). Present and near-future tense. The reader is the subject.
- Forbidden phrases (never use): "worth sitting with," "worth noting," "in a sense," "sort of" and
  "a kind of" as hedges, "the good kind," "which matters," "that's the whole point," "there's
  something" as an opener, and as openers/intensifiers: "ultimately," "indeed," "essentially," "at its
  core," "fundamentally," "genuinely," "honestly," "actually."
- Avoid this AI vocabulary: delve, tapestry, testament, navigate (figurative), realm, landscape
  (figurative), underscore, leverage, robust, nuanced, multifaceted, crucial, vital, elevate, curated,
  boasts, treasure trove, seamless, vibrant, compelling.
- The reference material below was written by a human under different rules and may itself contain a
  banned word, most often "actually." Never copy a banned word out of the reference into your own
  sentences. Paraphrase around it.

WHAT IS TRUE AND WHAT YOU MUST NOT CONTRADICT
- The cards are fixed by arithmetic from the reader's birthday and the year. Never imply they were
  drawn, chosen, or shuffled.
- Use ONLY the card meanings provided in the input. Do not import outside tarot knowledge.
- Never predict external events or make claims about the reader's real circumstances. You describe the
  shape and texture of the year's cards and what they ask, not what will happen.
- Do not console, diagnose, or counsel. If a stretch is hard, name it plainly and move on. The reader
  is an adult reading their own almanac.

THE STRUCTURE OF THIS READING (the input gives you the facts for each)
- The YEAR CARD is the theme of the whole year, the doorway the twelve months walk out from.
- The twelve MONTHS are the year card's card plus one, plus two, and so on: a single step forward
  through the cycle each month, no repeats. January is the first step, December the twelfth.
- The BEARING is the reader's fixed lifelong card. The year card is the Bearing carried forward by the
  year's own number (the "gap" in the input). This Bearing-meets-year relationship is the heart of the
  reading and cannot be looked up anywhere. Make it land. If decemberReturnsToBearing is true, the
  reader's December card is their own Bearing again: the year closes by returning them to themselves.
  Name that plainly when it is true.
- The REST OF THE CYCLE is the nine Majors the year never touches. What the year does not ask of the
  reader is as real as what it does.
- The ELEMENT WEATHER is how the twelve months balance across fire, water, air, and earth.

Return your answer only via the write_year_reading tool. Do not add commentary outside the tool call.`;

// ── Input contract ────────────────────────────────────────────────────────────
export interface YearReadingAIInput {
  name: string;
  year: number;
  bearing: { card: string; element: string; essence: string; meaning: string };
  yearCard: {
    card: string;
    element: string;
    essence: string;
    theme: string; // the free blurb
    personalYearReading: string; // authored ongoing-personal-year text
    skills: string[];
  };
  bearingMeetsYear: {
    gap: number;
    sameElement: boolean;
    decemberReturnsToBearing: boolean;
  };
  months: { month: string; card: string; element: string; reading: string }[];
  elementWeather: { element: string; count: number }[];
  restOfCycle: { card: string; element: string }[];
}

export function buildYearReadingAIInput(pkg: YearPackage): YearReadingAIInput {
  return {
    name: pkg.name,
    year: pkg.year,
    bearing: {
      card: pkg.bearing.name,
      element: pkg.bearing.element,
      essence: pkg.bearing.essence,
      meaning: pkg.bearing.meaning,
    },
    yearCard: {
      card: pkg.yearCard.name,
      element: pkg.yearCard.element,
      essence: pkg.yearCard.essence,
      theme: pkg.yearCard.blurb,
      personalYearReading: pkg.yearCard.personalYearReading,
      skills: pkg.yearCard.skills,
    },
    bearingMeetsYear: pkg.bearingVsYear,
    months: pkg.months.map((m) => ({
      month: m.monthName,
      card: m.card,
      element: m.element,
      reading: m.reading,
    })),
    elementWeather: pkg.elementWeather.map((e) => ({ element: e.element, count: e.count })),
    restOfCycle: pkg.restOfCycle.map((r) => ({ card: r.name, element: r.element })),
  };
}

// ── Output contract (forced tool call) ────────────────────────────────────────
export const YEAR_READING_TOOL_NAME = "write_year_reading";

export const YEAR_READING_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    yearOpening: {
      type: "string",
      description:
        "2-4 sentences. What this year card means as the reader's whole year, grounded in the year card's theme and personalYearReading. Frame it as the doorway the year walks out from. Lead the reading and make it land.",
    },
    bearingMeetsYear: {
      type: "string",
      description:
        "2 short paragraphs (joined by a blank line). The heart of the reading. Paragraph 1: what the reader's fixed Bearing is, and how it meets this year card (whether the year amplifies their nature or tests it, using sameElement and the two card meanings). Paragraph 2: the arithmetic turn, that the year card is their Bearing carried forward by the year's number, and if decemberReturnsToBearing is true, that December returns them to their own Bearing. This is the part no lookup can give them.",
    },
    arc: {
      type: "string",
      description:
        "1-2 short paragraphs. The twelve months as one continuous walk (name the shape of the year from its cards), then what the year never touches, drawn from restOfCycle: what it does NOT ask of the reader.",
    },
    elementWeather: {
      type: "string",
      description:
        "1 short paragraph. What the year's element balance asks, naming the dominant element and the scarce one from elementWeather. Concrete, not a list.",
    },
    months: {
      type: "array",
      items: {
        type: "object",
        properties: {
          month: {
            type: "string",
            description:
              "The month name, copied verbatim from one of the input's months[].month values. Used to match this text to the right month; order does not matter.",
          },
          text: {
            type: "string",
            description:
              "2-3 sentences reading THAT month, grounded in that month's card and its `reading`. Render the card, do not restate its name mechanically. Where a month rhymes with another (same element, or a return), you may connect them, but keep each month distinct in shape and length.",
          },
        },
        required: ["month", "text"],
      },
      description: "Exactly one object per month in the input's months array, tagged with its month name.",
    },
    skills: {
      type: "array",
      items: { type: "string" },
      description:
        "A JSON array of 3-5 STRING elements. Each is one concrete practice this year asks for, drawn from the year card and the reader's Bearing. No preamble.",
    },
    reflections: {
      type: "array",
      items: { type: "string" },
      description:
        "A JSON array of 3-5 STRING elements, one open question each. Each references something specific from THIS reading (the year card, the Bearing relationship, a particular month). Open, not leading. No yes/no questions. This ends the reading; do not add a closing summary after it.",
    },
  },
  required: ["yearOpening", "bearingMeetsYear", "arc", "elementWeather", "months", "skills", "reflections"],
};

export interface YearReadingRawSections {
  yearOpening: string;
  bearingMeetsYear: string;
  arc: string;
  elementWeather: string;
  months: { month: string; text: string }[];
  skills: string[];
  reflections: string[];
}

export interface YearReadingSections {
  yearOpening: string;
  bearingMeetsYear: string;
  arc: string;
  elementWeather: string;
  months: { month: string; text: string }[]; // reconciled to the 12 months, in order
  skills: string[];
  reflections: string[];
}

export function flattenYearSections(s: YearReadingSections): string {
  return [
    s.yearOpening,
    s.bearingMeetsYear,
    s.arc,
    s.elementWeather,
    ...s.months.map((m) => m.text),
    ...s.skills,
    ...s.reflections,
  ].join("\n");
}

// Same strippable single-word fillers as the monthly reading: mechanically removable
// without breaking grammar, and the overwhelming majority of voice-gate trips.
const STRIPPABLE_FILLERS = [
  "ultimately",
  "indeed",
  "essentially",
  "fundamentally",
  "genuinely",
  "honestly",
  "actually",
];

function stripFillers(text: string): string {
  let result = text;
  for (const word of STRIPPABLE_FILLERS) {
    result = result.replace(
      new RegExp(`(^|[.!?]\\s+)${word},?\\s+([a-z])`, "gi"),
      (_m, lead: string, next: string) => `${lead}${next.toUpperCase()}`
    );
    result = result.replace(new RegExp(`\\s+${word}\\b`, "gi"), "");
  }
  return result.replace(/[ \t]{2,}/g, " ").trim();
}

export function sanitizeYearSections(s: YearReadingSections): YearReadingSections {
  return {
    yearOpening: stripFillers(s.yearOpening),
    bearingMeetsYear: stripFillers(s.bearingMeetsYear),
    arc: stripFillers(s.arc),
    elementWeather: stripFillers(s.elementWeather),
    months: s.months.map((m) => ({ month: m.month, text: stripFillers(m.text) })),
    skills: s.skills.map(stripFillers),
    reflections: s.reflections.map(stripFillers),
  };
}

// Re-exported so the AI module has one import site for the gate.
export { findVoiceViolation };
