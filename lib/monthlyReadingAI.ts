// The one AI call in the monthly reading: takes the deterministic package, returns only
// the connective prose (MONTHLY_READING_BUILD_BRIEF.md). Forced tool use means the
// response always parses into the named slots — no markdown fences, no free text to strip.
//
// Client is built lazily (same convention as lib/resend.ts) so importing this module
// never throws in contexts without ANTHROPIC_API_KEY set (e.g. a build step).
import Anthropic from "@anthropic-ai/sdk";
import type { MonthlyPackage } from "./monthlyReading";
import {
  MONTHLY_READING_SYSTEM_PROMPT,
  MONTHLY_READING_TOOL_NAME,
  MONTHLY_READING_OUTPUT_SCHEMA,
  buildMonthlyReadingAIInput,
  findVoiceViolation,
  flattenSections,
  sanitizeSections,
  type MonthlyReadingRawSections,
  type MonthlyReadingSections,
} from "./monthlyReadingPrompt";

const MODEL = process.env.ANTHROPIC_MONTHLY_READING_MODEL ?? "claude-sonnet-5";

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export type MonthlyReadingResult =
  | { status: "ready"; sections: MonthlyReadingSections }
  | {
      status: "failed";
      failureReason: "api_error" | "parse_error" | "voice_gate";
      // Whatever raw/partial output was available at the point of failure, for owner
      // diagnosis straight from the database — shape varies by failureReason (a
      // parse_error's held value won't conform to MonthlyReadingSections, since the
      // whole point is that it didn't parse). Absent for api_error: a failed network
      // call has no model output to hold.
      heldSections?: unknown;
    };

// Words like "actually" are a natural pull in exactly this reading's content (telling a
// real ending from a rough patch invites "is this actually finished"), so a single-shot
// voice-gate rejection is common, not rare. This is a bounded internal retry within the
// ONE generation event, not a user-facing regeneration: nothing is stored or shown to
// the reader until either a clean pass is found or every attempt is exhausted, so the
// "one reading, ever" contract in MONTHLY_READING_BUILD_BRIEF.md still holds — this just
// makes that one event resilient to an unlucky word choice instead of brittle to it.
const MAX_ATTEMPTS = 3;

export async function generateMonthlyReading(pkg: MonthlyPackage): Promise<MonthlyReadingResult> {
  let lastResult: MonthlyReadingResult = { status: "failed", failureReason: "api_error" };
  let correction: string | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = await attemptGeneration(pkg, correction);
    if (result.status === "ready") return result;

    lastResult = result;
    console.warn(
      `[monthly-reading] attempt ${attempt}/${MAX_ATTEMPTS} failed (${result.failureReason})${
        attempt < MAX_ATTEMPTS ? ", retrying" : ", giving up"
      }`
    );
    correction =
      result.failureReason === "voice_gate" && result.heldSections
        ? violationCorrection(flattenSections(result.heldSections as MonthlyReadingSections))
        : result.failureReason === "parse_error"
          ? SHAPE_CORRECTION
          : null;
  }

  return lastResult;
}

function violationCorrection(text: string): string {
  const violation = findVoiceViolation(text);
  return `Your previous attempt violated a hard voice rule (${violation}). Rewrite from scratch avoiding it entirely; do not just delete the word, restructure the sentence.`;
}

const SHAPE_CORRECTION =
  "Your previous attempt's weekTextures or circledNotes didn't match the required shape: an array of objects, each tagged with its week number (weekTextures) or exact card name (circledNotes), with exactly one entry per week/circled date given in the input. Return that exact keyed shape this time.";

// Matches the model's keyed output (an array of {key, text} objects, in any order)
// against the identities the deterministic package actually has (week numbers, or exact
// circled-card names), so a wrong count or wrong order is recoverable and diagnosable —
// "week 3 is missing" — rather than a bare "array length didn't match" failure that
// throws away otherwise-good content for a formatting slip.
function matchByKey<K>(
  raw: unknown,
  expectedKeys: K[],
  getKey: (item: Record<string, unknown>) => unknown,
  getText: (item: Record<string, unknown>) => unknown
): { values: string[]; missing: K[] } {
  const byKey = new Map<unknown, string>();
  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (item && typeof item === "object") {
        const text = getText(item as Record<string, unknown>);
        if (typeof text === "string") byKey.set(getKey(item as Record<string, unknown>), text);
      }
    }
  }
  const missing: K[] = [];
  const values = expectedKeys.map((key) => {
    const text = byKey.get(key);
    if (typeof text !== "string") {
      missing.push(key);
      return "";
    }
    return text;
  });
  return { values, missing };
}

async function attemptGeneration(
  pkg: MonthlyPackage,
  correction: string | null
): Promise<MonthlyReadingResult> {
  const input = buildMonthlyReadingAIInput(pkg);
  const userContent = correction ? `${correction}\n\n${JSON.stringify(input)}` : JSON.stringify(input);

  let response;
  try {
    response = await getClient().messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: MONTHLY_READING_SYSTEM_PROMPT,
      tools: [
        {
          name: MONTHLY_READING_TOOL_NAME,
          description: "Return the monthly reading's connective prose, in the exact given shape.",
          input_schema: MONTHLY_READING_OUTPUT_SCHEMA as Anthropic.Tool.InputSchema,
        },
      ],
      tool_choice: { type: "tool", name: MONTHLY_READING_TOOL_NAME },
      messages: [{ role: "user", content: userContent }],
    });
  } catch (err) {
    console.error("[monthly-reading] AI call failed", err);
    return { status: "failed", failureReason: "api_error" };
  }

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    console.error("[monthly-reading] no tool_use block in response", response.content);
    return { status: "failed", failureReason: "parse_error", heldSections: response.content };
  }

  const raw = toolUse.input as MonthlyReadingRawSections;
  const weekMatch = matchByKey(
    raw.weekTextures,
    pkg.weeks.map((w) => w.n),
    (item) => item.week,
    (item) => item.text
  );
  const circleMatch = matchByKey(
    raw.circledNotes,
    pkg.circledDates.map((c) => c.card),
    (item) => item.card,
    (item) => item.note
  );

  const shapeOk =
    typeof raw.framing === "string" &&
    typeof raw.cycleLine === "string" &&
    typeof raw.woven === "string" &&
    typeof raw.evenMonthNote === "string" &&
    weekMatch.missing.length === 0 &&
    circleMatch.missing.length === 0 &&
    Array.isArray(raw.reflections) &&
    raw.reflections.length > 0 &&
    raw.reflections.every((r) => typeof r === "string");

  if (!shapeOk) {
    console.error("[monthly-reading] tool output shape mismatch", {
      missingWeeks: weekMatch.missing,
      missingCards: circleMatch.missing,
      raw,
    });
    return {
      status: "failed",
      failureReason: "parse_error",
      heldSections: { raw, missingWeeks: weekMatch.missing, missingCards: circleMatch.missing },
    };
  }

  const sections: MonthlyReadingSections = {
    framing: raw.framing,
    cycleLine: raw.cycleLine,
    weekTextures: weekMatch.values,
    circledNotes: circleMatch.values,
    woven: raw.woven,
    reflections: raw.reflections,
    evenMonthNote: raw.evenMonthNote,
  };

  // Strip safe single-word fillers (mainly "actually") before the gate runs, so an
  // otherwise-clean generation doesn't burn a retry over one mechanically removable word.
  const sanitized = sanitizeSections(sections);
  const violation = findVoiceViolation(flattenSections(sanitized));
  if (violation) {
    console.error(`[monthly-reading] voice gate rejected generation (${violation})`);
    return { status: "failed", failureReason: "voice_gate", heldSections: sanitized };
  }

  return { status: "ready", sections: sanitized };
}
