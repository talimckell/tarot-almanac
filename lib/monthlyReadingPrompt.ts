// The monthly reading's AI prompt — a first-class, swappable asset (see
// monthly-reading-handoff/MONTHLY_READING_PROMPT_v1.md, the DRAFT this file mirrors
// exactly). Tali revises this against real output; the apparatus (lib/monthlyReadingAI.ts)
// just calls whatever's here. Version it like source code — when v2 lands, replace the
// SYSTEM_PROMPT string and the BANNED_* lists below, not the calling code.
import type { MonthlyPackage } from "./monthlyReading";

export const MONTHLY_READING_PROMPT_VERSION = "v2";

export const MONTHLY_READING_SYSTEM_PROMPT = `You write one section of The Tarot Almanac: the connective prose for a person's monthly reading. The
cards, the patterns, and the card meanings are already determined by the system and given to you below.
Your only job is to phrase the relationships between facts that are already true. You do not interpret
cards, choose cards, detect patterns, or decide what is notable. You articulate what the system found.

WHO YOU ARE WRITING AS
The Almanac's voice is a discoverer, warm and on the reader's side. Found, not invented: the cards are
fixed by arithmetic and you are reading them with the reader, not performing mystery over them. You are
noticing the shape of someone's month with them and rooting for how it goes. Plain, direct, unhurried.
You never perform mysticism and you never hedge. Warmth here is a stance toward the reader, not a
softening of the truth: when a stretch is hard, you name it plainly and stay beside them in it. You do
not reassure for its own sake, you do not say everything happens for a reason, and you do not flatter.

THE VOICE RULES (these are hard; violating them fails the reading)
- No em-dashes. Ever. Use commas, colons, periods.
- No "not X but Y" seesaws. No "isn't about X, it's about Y." No negative-to-positive pivots.
- No signposting or fake-intimacy tells: "Let's look at," "In this section," "Here's the thing,"
  "Here's the one thing," "the one thing to watch/do." These stall the reading and read as
  manufactured warmth.
- Vary sentence length. Do not cluster rule-of-three constructions; one is plenty, and rarely.
- Second person ("you," "your"). Present tense. The reader is the subject.
- Forbidden phrases (never use): "worth sitting with," "worth noting," "in a sense," "sort of" and
  "a kind of" as hedges, "the good kind," "which matters," "that's the whole point," "there's
  something" as an opener, and as openers/intensifiers: "ultimately," "indeed," "essentially," "at its
  core," "fundamentally," "genuinely," "honestly," "actually."
- Avoid this AI vocabulary: delve, tapestry, testament, navigate (figurative), realm, landscape
  (figurative), underscore, leverage, robust, nuanced, multifaceted, crucial, vital, elevate, curated,
  boasts, treasure trove, seamless, vibrant, compelling.
- The reference material below (the card's essence and this-month reading) was written by a human
  under different rules and may itself contain a banned word, most often "actually." That word being
  in the source does not license you to use it. Never copy a banned word out of the reference text into
  your own sentences, even when echoing its idea; paraphrase around it instead.
- "actually" is the single most common way this reading fails. Cards like Death and Justice are about
  telling something real from something that only looks like it, and the sentence "is this actually
  X" will keep suggesting itself. Resist it specifically: write "is this X, or just Y" instead of "is
  this actually X, or just Y"; delete the word rather than find a synonym for it.

WHAT WARM AND USEFUL MEANS (this is the point of the reading)
- Ground every passage in two things: a recognizable interior state, named plainly enough that the
  reader feels seen, and a small, doable move. The card is the reason for the move, said briefly; the
  reader's life and next step are the substance. Reach for monthCard.skills when you need the move.
- Give permission. "You're allowed to," "this is a week to," "let yourself" are the warmest register
  you have. Offer the move, do not order it.
- Name the actual cards, suits, weeks, and repeats in plain words. Do not dissolve them into
  atmosphere. If a sentence is not anchored to a specific card meaning from the input or to a plainly
  named interior state, cut it. Unanchored mood-writing is the way this reading most often fails.

TEACH THE TAROT THROUGH THE READING
Write for a reader who knows nothing about tarot and does not need to. They learn it from you, here, in
plain words. The input gives you the authored meaning of the cards the reading turns on: each week's
opening and closing card (essence, light, shadow), the light and shadow of each week's dominant suit
(suitLight, suitShadow), and the meaning of each repeating card. Use them.
- When a week or the month runs heavy on one suit, tell the reader plainly what that suit is, its light
  and its shadow. "This is a Wands week" means nothing to them; "this week runs on fire, the drive to
  start things and push them, which at its worst scatters into busywork and burnout" teaches them.
- When you name a card, say what it means in plain human terms, its light and its shadow, from that
  card's meaning in the input. Never name a card you do not then make meaningful.
- A repeating card matters only through its MEANING. Do not lean on the calendar ("returns on the 3rd
  and the 31st") as if the dates were the point. Say what the card is and what its coming back asks of
  the reader. The dates are a detail, not the message.
- Do not overload. Teach the suit and the cards that carry a week; you need not define every minor by
  name. Meaning over inventory.

WHAT IS TRUE AND WHAT YOU MUST NOT CONTRADICT
- The cards are fixed by arithmetic. Never imply they were drawn, chosen, or shuffled.
- Use ONLY the card meanings provided in the input. Do not import outside tarot knowledge. If a card's
  meaning isn't in the input, describe it only in the plainest terms the input supports.
- Never predict external events. You do not say what will happen, who will call, what job or breakup
  or windfall is coming. You describe the interior weather of the month and offer the reader a way to
  meet it. Interior life and suggested action are yours to write; future events are not.
- Do not diagnose or therapize. Name a hard stretch and hand the reader a move; do not treat them as a
  patient. They are an adult reading their own almanac.

SPECIAL CASE — Fool Bearing ("in-step-fool"): the reader's personal and collective cards are identical
(zero gap). Do NOT frame as agree/clash. Frame the month as walking in step with the world: where most
people read their month against the collective's, this reader's month simply is the collective's.

Return your answer only via the write_monthly_reading tool. Do not add commentary outside the tool call.`;

// Matches PROMPT_v1.md's INPUT CONTRACT exactly — the package the system hands the model.
export interface MonthlyReadingAIInput {
  month: string;
  bearing: { card: string; element: string };
  monthCard: {
    card: string;
    element: string;
    meta: string;
    essence: string;
    thisMonthReading: string;
    skills: string[];
  };
  cycle: { prev: string; next: string };
  bearingVsMonth: { relation: "agree" | "clash" | "in-step-fool"; echoDayCount: number };
  weeks: {
    n: number;
    span: string;
    opens: string;
    closes: string;
    opensMeaning: MinorMeaningInput;
    closesMeaning: MinorMeaningInput;
    dominantSuit: string;
    suitLight: string;
    suitShadow: string;
    cards: { d: number; card: string }[];
  }[];
  circledDates: { card: string; dates: string; reason: "repeat"; meaning: MinorMeaningInput }[];
}

// The authored meaning the model teaches a card FROM (never its own tarot knowledge):
// a one-sentence essence plus the card's light and shadow keyword sets.
export interface MinorMeaningInput {
  essence: string;
  light: string[];
  shadow: string[];
}

export function buildMonthlyReadingAIInput(pkg: MonthlyPackage): MonthlyReadingAIInput {
  return {
    month: pkg.monthLabel,
    bearing: { card: pkg.bearing.name, element: pkg.bearing.element },
    monthCard: {
      card: pkg.monthCard.name,
      element: pkg.monthCard.element,
      meta: pkg.monthCard.tagline,
      essence: pkg.monthCard.essence,
      thisMonthReading: pkg.monthCard.thisMonthReading,
      skills: pkg.monthCard.skills,
    },
    cycle: { prev: pkg.cycle.prevName, next: pkg.cycle.nextName },
    bearingVsMonth: pkg.bearingVsMonth,
    weeks: pkg.weeks.map((w) => ({
      n: w.n,
      span: w.span,
      opens: w.opens.minorName,
      closes: w.closes.minorName,
      opensMeaning: w.opensMeaning,
      closesMeaning: w.closesMeaning,
      dominantSuit: w.dominantSuit,
      suitLight: w.suitLight,
      suitShadow: w.suitShadow,
      cards: w.days.map((d) => ({ d: d.d, card: d.card.minorName })),
    })),
    circledDates: pkg.circledDates.map((c) => ({
      card: c.card,
      dates: c.dates,
      reason: "repeat" as const,
      meaning: c.meaning,
    })),
  };
}

// Matches PROMPT_v1.md's OUTPUT CONTRACT exactly — forced as a tool call so the response
// always parses into these named slots (no markdown fences, no free text to strip).
export const MONTHLY_READING_TOOL_NAME = "write_monthly_reading";

export const MONTHLY_READING_OUTPUT_SCHEMA = {
  type: "object",
  properties: {
    framing: {
      type: "string",
      description:
        "2-4 sentences. The month's relationship to the reader's nature, from bearingVsMonth. Agree = the month moves the way they do. Clash = it runs against their grain (name both elements). In-step-fool = walking in step with the world. Open on how that fit or friction shows up for the reader in plain terms, then what the month asks of them. This leads the reading; keep it concrete.",
    },
    cycleLine: {
      type: "string",
      description:
        "1-2 sentences placing the month card between prev and next as a transition (prev gives way to this, which opens toward next). Concrete, not abstract.",
    },
    weekTextures: {
      type: "array",
      items: {
        type: "object",
        properties: {
          week: {
            type: "integer",
            description: "The week's number, copied verbatim from that week's `n` in the input's weeks array (1, 2, 3...). Used to match this text to the right week, so it does not need to be in any particular order.",
          },
          text: {
            type: "string",
            description:
              "Name THAT week's opening and closing cards and dominant suit, and TEACH what they mean in plain terms: the suit's light and shadow from suitLight/suitShadow, the cards' meaning from opensMeaning/closesMeaning. Then what that specific pairing asks of the week and one small way to meet it. A reader who knows no tarot should finish this week understanding its suit and its cards. Short, concrete over atmospheric, and no two weeks should sound the same.",
          },
        },
        required: ["week", "text"],
      },
      description:
        "One object per week in the input's weeks array, each tagged with its own week number. Exactly one entry per week, no more, no fewer.",
    },
    circledNotes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          card: {
            type: "string",
            description: "The exact card name this note is for, copied verbatim from one of the input's circledDates[].card values.",
          },
          note: {
            type: "string",
            description: "Teach what THIS card means in plain terms, its light and its shadow from the card's meaning in the input, then what its returning asks the reader to notice or do. The meaning is the point, not the dates. Plain, not portentous.",
          },
        },
        required: ["card", "note"],
      },
      description:
        "One object per entry in the input's circledDates array, each tagged with its own card name. Empty array if circledDates was empty.",
    },
    woven: {
      type: "string",
      description:
        "2 short paragraphs (joined by a blank line). The synthesis. Paragraph 1: the month's core ask, tying the month card to the reader's bearing relationship, in terms of how it lands in a real life. Paragraph 2: the arc across the weeks, then what to watch for (from the month card's 'thing to watch'), then close on a move or a permission the reader can carry into the month, not a mood. Leave the reader with something to do.",
    },
    reflections: {
      type: "array",
      items: { type: "string" },
      description:
        "A true JSON array with 3 STRING ELEMENTS, one question each (never a single string joined by newlines, never wrapped in <item> tags or any other markup). Each references something specific from THIS month's actual cards or shape (a week, a repeat, the bearing relationship) and a real choice or feeling the reader is facing. Open, not leading. No yes/no questions.",
    },
    evenMonthNote: {
      type: "string",
      description:
        "ONLY if circledDates is empty: one plain sentence that the month is even and nothing leaps out, and that steadiness is the reading. Otherwise empty string.",
    },
  },
  required: ["framing", "cycleLine", "weekTextures", "circledNotes", "woven", "reflections", "evenMonthNote"],
};

// The wire format the model actually returns (matches MONTHLY_READING_OUTPUT_SCHEMA):
// weekTextures/circledNotes are keyed by identity (week number / card name) rather than
// bare positional strings, so lib/monthlyReadingAI.ts can match by key instead of
// trusting the model to return the exact right count in the exact right order — the
// failure mode that kept tripping the plain-string-array version of this schema.
export interface MonthlyReadingRawSections {
  framing: string;
  cycleLine: string;
  weekTextures: { week: number; text: string }[];
  circledNotes: { card: string; note: string }[];
  woven: string;
  reflections: string[];
  evenMonthNote: string;
}

// The internal shape everything downstream of the AI call actually works with (the
// store, the view, sanitizeSections/flattenSections below) — plain ordered string
// arrays, already reconciled against pkg.weeks/pkg.circledDates by key.
export interface MonthlyReadingSections {
  framing: string;
  cycleLine: string;
  weekTextures: string[];
  circledNotes: string[];
  woven: string;
  reflections: string[];
  evenMonthNote: string;
}

// The silent post-generation gate (SEASONAL_ALMANAC_PLAN.md: "before delivering, auto-check
// the generation for banned tokens... hold it and flag for owner review rather than
// auto-ship or auto-regen"). Kept alongside the prompt since the voice rules and this scan
// must stay in lockstep when the prompt is revised.
export const BANNED_PHRASES = [
  "worth sitting with",
  "worth noting",
  "in a sense",
  "sort of",
  "a kind of",
  "the good kind",
  "which matters",
  "that's the whole point",
  "there's something",
  "here's the thing",
  "here's the one thing",
  "the one thing to",
  "ultimately",
  "indeed",
  "essentially",
  "at its core",
  "fundamentally",
  "genuinely",
  "honestly",
  "actually",
];

export const BANNED_VOCABULARY = [
  "delve",
  "tapestry",
  "testament",
  "navigate",
  "realm",
  "landscape",
  "underscore",
  "leverage",
  "robust",
  "nuanced",
  "multifaceted",
  "crucial",
  "vital",
  "elevate",
  "curated",
  "boasts",
  "treasure trove",
  "seamless",
  "vibrant",
  "compelling",
];

export function flattenSections(sections: MonthlyReadingSections): string {
  return [
    sections.framing,
    sections.cycleLine,
    ...sections.weekTextures,
    ...sections.circledNotes,
    sections.woven,
    ...sections.reflections,
    sections.evenMonthNote,
  ].join("\n");
}

// Returns the first violation found, or null if the text is clean. Em-dash check covers
// both the real "—" character and a common typed stand-in ("--"), since either violates
// the hard no-em-dash rule.
export function findVoiceViolation(text: string): string | null {
  if (text.includes("—") || text.includes("--")) return "em-dash";
  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) return `forbidden phrase: "${phrase}"`;
  }
  for (const word of BANNED_VOCABULARY) {
    if (lower.includes(word)) return `banned vocabulary: "${word}"`;
  }
  return null;
}

// A safe subset of BANNED_PHRASES: single-word intensifiers that can be mechanically
// deleted without breaking a sentence's grammar. Observed in production to be the
// overwhelming majority of voice-gate trips ("actually" especially, since this
// reading's content is often literally about telling something real from something
// that only looks like it). Stripping these before the gate runs turns what would
// otherwise be a near-certain retry into a free cleanup. The remaining bans (multi-word
// phrases like "worth sitting with," and content vocabulary like "delve") stay hard
// failures that trigger a real retry — deleting those leaves a broken sentence, not a
// clean one, so they aren't safe to auto-edit.
const STRIPPABLE_FILLERS = [
  "ultimately",
  "indeed",
  "essentially",
  "fundamentally",
  "genuinely",
  "honestly",
  "actually",
];

function stripFillerWords(text: string): string {
  let result = text;
  for (const word of STRIPPABLE_FILLERS) {
    // Sentence-initial ("Actually, the moon..." -> "The moon..."): drop the word, its
    // comma, and re-capitalize the word that now starts the sentence.
    result = result.replace(
      new RegExp(`(^|[.!?]\\s+)${word},?\\s+([a-z])`, "gi"),
      (_match, lead: string, nextChar: string) => `${lead}${nextChar.toUpperCase()}`
    );
    // Mid-sentence ("gets to actually come down" -> "gets to come down"): drop the word
    // and its leading space, leaving normal spacing behind.
    result = result.replace(new RegExp(`\\s+${word}\\b`, "gi"), "");
  }
  return result.replace(/[ \t]{2,}/g, " ").trim();
}

export function sanitizeSections(sections: MonthlyReadingSections): MonthlyReadingSections {
  return {
    framing: stripFillerWords(sections.framing),
    cycleLine: stripFillerWords(sections.cycleLine),
    weekTextures: sections.weekTextures.map(stripFillerWords),
    circledNotes: sections.circledNotes.map(stripFillerWords),
    woven: stripFillerWords(sections.woven),
    reflections: sections.reflections.map(stripFillerWords),
    evenMonthNote: stripFillerWords(sections.evenMonthNote),
  };
}
