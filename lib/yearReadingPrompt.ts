// The paid year-ahead reading's AI prompt. A first-class, swappable asset like
// lib/monthlyReadingPrompt.ts. The authored year and month readings are shown to the
// reader verbatim (wired in lib/yearReading.ts); this prompt only produces the connective
// weave: a personalized framing, the Bearing×Year spine, the stages/arc, the element
// weather, and reflection questions. The voice gate (findVoiceViolation) is shared with
// the monthly reading so the two stay in lockstep.
import type { YearPackage } from "./yearReading";
import { findVoiceViolation } from "./monthlyReadingPrompt";

export const YEAR_READING_PROMPT_VERSION = "v2";

export const YEAR_READING_SYSTEM_PROMPT = `You write the connective prose for The Tarot Almanac's year-ahead reading: the parts that tie one
person's year together. The year card, the twelve months, the Bearing, and every card meaning are
already determined by the system and given to you below. You do not interpret cards, choose cards, or
decide what is notable. You phrase relationships that are already true.

WHAT IS ALREADY WRITTEN, AND WHAT YOU MUST NOT DO WITH IT
The reader is shown two authored readings verbatim, beside your prose: the year card's own reading
(personalYearReading below) and each month's own reading (months[].reading below). Do NOT restate,
summarize, or paraphrase those. The reader can already read them. If your framing just recaps the year
reading, it is wrong. Your job is the connective tissue between the facts, and the one thing no authored
text can give: how this specific Bearing meets this specific year.

WHO YOU ARE WRITING AS
The Almanac's voice is a discoverer, not a teacher and not an authority. Found, not invented. Warm,
plain, direct. Address the reader by name where it lands, once or twice at most.

GROUND EVERYTHING. This is the rule that matters most here.
Every claim gets a concrete, lived image, the way the authored readings do: "the day you stop
researching how and just open the document," "wait for the dust to show you what fell," "the yes you
gave to keep the peace." Abstractions fail. If you write a sentence a reader cannot picture, cut it or
replace it with something they can see. Plainer and more concrete is always the fix. Do not perform
poignancy. If a sentence is admiring its own beauty, rewrite it flat.

THE VOICE RULES (hard; violating them fails the reading)
- No em-dashes. Ever. Commas, colons, periods.
- No "not X but Y" seesaws. No "isn't about X, it's about Y."
- No signposting ("Let's look at," "Here's the thing").
- Vary sentence length. Do NOT cluster rule-of-three constructions. Listing three items in a row,
  sentence after sentence, is the fastest way this reads as machine-made. One rule-of-three in the whole
  reading is plenty. Prefer pairs and single concrete images.
- Second person, present and near-future tense.
- Forbidden phrases: "worth sitting with," "worth noting," "in a sense," "sort of" and "a kind of" as
  hedges, "the good kind," "which matters," "that's the whole point," "there's something" as an opener,
  and as openers/intensifiers "ultimately," "indeed," "essentially," "at its core," "fundamentally,"
  "genuinely," "honestly," "actually."
- Avoid AI vocabulary: delve, tapestry, testament, navigate (figurative), realm, landscape (figurative),
  underscore, leverage, robust, nuanced, multifaceted, crucial, vital, elevate, curated, boasts,
  treasure trove, seamless, vibrant, compelling.
- Never predict external events or claim things about the reader's real life. Describe the shape and
  texture of the cards and what they ask, not what will happen.
- The cards are fixed by arithmetic from the birthday and the year. Never imply they were drawn or shuffled.

THE THREE STAGES (use this framework in the stagesAndArc section)
The twenty-two Majors are one story in three movements, and the system places every card in its stage:
- INITIATION (cards 0-7): a person getting assembled. Beginnings, the equipment gathered before life has
  leaned on it. Fresh, and untested.
- TESTING (cards 8-14): the equipment used, worn, sometimes broken. The hard middle, where a life is
  decided. A card here asks what you are made of.
- RECKONING (cards 15-21): the accounting. Arrival and reckoning at once, things coming due or coming
  clear. Then the World rolls back to the Fool, and it begins again.
The input gives the stage of the year card, of each month, and of the untouched cards, plus counts
(stageSummary). Name which stages the year moves through and which it never enters this year. What the
year does not ask of the reader is as real as what it does. Ground it in the actual months and cards.

THE BEARING MEETS THE YEAR (the heart of the reading)
The Bearing is the reader's fixed lifelong card. The year card is the Bearing carried forward by the
year's own number (the "gap"). Say concretely how this Bearing meets this year card: does the year run
in the Bearing's grain or against it (use sameElement and the two meanings), and what does that look
like in a lived week. If decemberReturnsToBearing is true, the reader's December card is their own
Bearing again: the year closes by returning them to themselves. Name it plainly. This is the part no
lookup and no authored text can give them, so it must be the most specific writing in the reading.

Return your answer only via the write_year_reading tool. Do not add commentary outside the tool call.`;

// ── Input contract ────────────────────────────────────────────────────────────
export interface YearReadingAIInput {
  name: string;
  year: number;
  bearing: { card: string; element: string; stage: string; essence: string; meaning: string };
  yearCard: {
    card: string;
    element: string;
    stage: string;
    theme: string;
    personalYearReading: string; // reference only; do not restate
    skills: string[];
  };
  bearingMeetsYear: { gap: number; sameElement: boolean; decemberReturnsToBearing: boolean };
  months: { month: string; card: string; element: string; stage: string; reading: string }[];
  elementWeather: { element: string; count: number }[];
  restOfCycle: { card: string; element: string; stage: string }[];
  stageSummary: { touched: Record<string, number>; untouched: Record<string, number> };
}

export function buildYearReadingAIInput(pkg: YearPackage): YearReadingAIInput {
  return {
    name: pkg.name,
    year: pkg.year,
    bearing: {
      card: pkg.bearing.name,
      element: pkg.bearing.element,
      stage: pkg.bearing.stage,
      essence: pkg.bearing.essence,
      meaning: pkg.bearing.meaning,
    },
    yearCard: {
      card: pkg.yearCard.name,
      element: pkg.yearCard.element,
      stage: pkg.yearCard.stage,
      theme: pkg.yearCard.blurb,
      personalYearReading: pkg.yearCard.personalYearReading,
      skills: pkg.yearCard.skills,
    },
    bearingMeetsYear: pkg.bearingVsYear,
    months: pkg.months.map((m) => ({
      month: m.monthName,
      card: m.card,
      element: m.element,
      stage: m.stage,
      reading: m.reading,
    })),
    elementWeather: pkg.elementWeather.map((e) => ({ element: e.element, count: e.count })),
    restOfCycle: pkg.restOfCycle.map((r) => ({ card: r.name, element: r.element, stage: r.stage })),
    stageSummary: pkg.stageSummary,
  };
}

// ── Output contract (forced tool call) ────────────────────────────────────────
export const YEAR_READING_TOOL_NAME = "write_year_reading";

export const YEAR_READING_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    framing: {
      type: "string",
      description:
        "2-3 sentences. A personalized opener that names the reader and sets the year card as their year, then hands off to the authored year reading shown below it. Do NOT restate or summarize the year meaning. Concrete. This leads the whole reading, so make it land.",
    },
    bearingMeetsYear: {
      type: "string",
      description:
        "2 short paragraphs (blank line between). The heart. Paragraph 1: what the reader's Bearing is, and how it meets this year card, whether the year runs in their grain or against it (use sameElement and both meanings), shown in a lived, concrete image. Paragraph 2: the arithmetic turn, that the year card is their Bearing carried forward by the year's number, and if decemberReturnsToBearing is true, that December returns them to their own Bearing. The most specific writing in the reading.",
    },
    stagesAndArc: {
      type: "string",
      description:
        "2 short paragraphs. Paragraph 1: the year as a walk through the three stages (Initiation, Testing, Reckoning), naming which stages the twelve months move through and grounding it in specific months/cards. Paragraph 2: which stage or stages the year never enters this year, from restOfCycle and stageSummary.untouched, and what that means it is not asking of the reader. Concrete, not abstract.",
    },
    elementWeather: {
      type: "string",
      description:
        "1 short paragraph. What the year's element balance asks, naming the dominant element and the scarce one from elementWeather, tied to real months. Concrete, not a list.",
    },
    reflections: {
      type: "array",
      items: { type: "string" },
      description:
        "A JSON array of 3-5 STRING elements, one open question each, each referencing something specific from THIS reading (the year card, the Bearing relationship, a stage, a particular month). Open, not leading. No yes/no questions. This ends the reading; add no closing summary after it.",
    },
  },
  required: ["framing", "bearingMeetsYear", "stagesAndArc", "elementWeather", "reflections"],
};

export interface YearReadingSections {
  framing: string;
  bearingMeetsYear: string;
  stagesAndArc: string;
  elementWeather: string;
  reflections: string[];
}
export type YearReadingRawSections = YearReadingSections;

export function flattenYearSections(s: YearReadingSections): string {
  return [s.framing, s.bearingMeetsYear, s.stagesAndArc, s.elementWeather, ...s.reflections].join("\n");
}

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
    framing: stripFillers(s.framing),
    bearingMeetsYear: stripFillers(s.bearingMeetsYear),
    stagesAndArc: stripFillers(s.stagesAndArc),
    elementWeather: stripFillers(s.elementWeather),
    reflections: s.reflections.map(stripFillers),
  };
}

export { findVoiceViolation };
