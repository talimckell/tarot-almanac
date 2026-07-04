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
      heldSections?: MonthlyReadingSections;
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
        ? violationCorrection(flattenSections(result.heldSections))
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
  "Your previous attempt returned one or more array fields (weekTextures, circledNotes, or reflections) as a single string instead of a true JSON array of strings. Return each of those fields as an actual array with one string per element, not a string joined by newlines or wrapped in tags.";

// Observed in production: the model occasionally returns an array-of-strings field as
// one string instead, joined by newlines or wrapped in ad-hoc <item> tags — a tool-use
// formatting slip, not a content problem (the prose itself is usually fine). Coercing
// it back into a real array here means that slip costs nothing instead of burning a
// retry attempt; the length check right after this still catches genuinely wrong
// content, so this only rescues the formatting, not bad substance.
function coerceToArray(value: unknown): unknown {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;
  const tagged = [...value.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1].trim());
  if (tagged.length > 0) return tagged;
  const lines = value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.length > 0 ? lines : value;
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
    console.error("[monthly-reading] no tool_use block in response", response);
    return { status: "failed", failureReason: "parse_error" };
  }

  const rawSections = toolUse.input as MonthlyReadingSections;
  const sections: MonthlyReadingSections = {
    ...rawSections,
    weekTextures: coerceToArray(rawSections.weekTextures) as MonthlyReadingSections["weekTextures"],
    circledNotes: coerceToArray(rawSections.circledNotes) as MonthlyReadingSections["circledNotes"],
    reflections: coerceToArray(rawSections.reflections) as MonthlyReadingSections["reflections"],
  };
  const shapeOk =
    typeof sections.framing === "string" &&
    typeof sections.cycleLine === "string" &&
    typeof sections.woven === "string" &&
    typeof sections.evenMonthNote === "string" &&
    Array.isArray(sections.weekTextures) &&
    sections.weekTextures.length === pkg.weeks.length &&
    Array.isArray(sections.circledNotes) &&
    sections.circledNotes.length === pkg.circledDates.length &&
    Array.isArray(sections.reflections) &&
    sections.reflections.length > 0;
  if (!shapeOk) {
    console.error("[monthly-reading] tool output shape mismatch", sections);
    return { status: "failed", failureReason: "parse_error" };
  }

  const violation = findVoiceViolation(flattenSections(sections));
  if (violation) {
    console.error(`[monthly-reading] voice gate rejected generation (${violation})`);
    return { status: "failed", failureReason: "voice_gate", heldSections: sections };
  }

  return { status: "ready", sections };
}
