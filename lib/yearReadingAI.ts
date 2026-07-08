// The one AI call in the year-ahead reading: takes the deterministic YearPackage and
// returns only the connective prose, forced through a tool call so it always parses.
// Mirrors lib/monthlyReadingAI.ts (retry-with-correction loop, key-matched arrays,
// voice gate). Client is lazy so importing never throws without ANTHROPIC_API_KEY.
import Anthropic from "@anthropic-ai/sdk";
import type { YearPackage } from "./yearReading";
import {
  YEAR_READING_SYSTEM_PROMPT,
  YEAR_READING_TOOL_NAME,
  YEAR_READING_OUTPUT_SCHEMA,
  buildYearReadingAIInput,
  flattenYearSections,
  sanitizeYearSections,
  findVoiceViolation,
  type YearReadingRawSections,
  type YearReadingSections,
} from "./yearReadingPrompt";

// The flagship paid reading: the weave is the product, so it defaults to the most
// capable model. Override with ANTHROPIC_YEAR_READING_MODEL.
const MODEL = process.env.ANTHROPIC_YEAR_READING_MODEL ?? "claude-opus-4-8";
const MAX_ATTEMPTS = 3;

let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  return client;
}

export type YearReadingResult =
  | { status: "ready"; sections: YearReadingSections }
  | { status: "failed"; failureReason: "api_error" | "parse_error" | "voice_gate"; held?: unknown };

export async function generateYearReading(pkg: YearPackage): Promise<YearReadingResult> {
  let lastResult: YearReadingResult = { status: "failed", failureReason: "api_error" };
  let correction: string | null = null;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = await attemptGeneration(pkg, correction);
    if (result.status === "ready") return result;

    lastResult = result;
    console.warn(
      `[year-reading] attempt ${attempt}/${MAX_ATTEMPTS} failed (${result.failureReason})${
        attempt < MAX_ATTEMPTS ? ", retrying" : ", giving up"
      }`
    );
    correction =
      result.failureReason === "voice_gate" && result.held
        ? voiceCorrection(flattenYearSections(result.held as YearReadingSections))
        : result.failureReason === "parse_error"
          ? SHAPE_CORRECTION
          : null;
  }
  return lastResult;
}

function voiceCorrection(text: string): string {
  const violation = findVoiceViolation(text);
  return `Your previous attempt violated a hard voice rule (${violation}). Rewrite from scratch avoiding it entirely; do not just delete the word, restructure the sentence.`;
}

const SHAPE_CORRECTION =
  "Your previous attempt was missing a required field or returned a section in the wrong shape. Return all of: framing, bearingMeetsYear, stagesAndArc, elementWeather (strings), and reflections (a JSON array of strings).";

async function attemptGeneration(
  pkg: YearPackage,
  correction: string | null
): Promise<YearReadingResult> {
  const input = buildYearReadingAIInput(pkg);
  const userContent = correction ? `${correction}\n\n${JSON.stringify(input)}` : JSON.stringify(input);

  let response;
  try {
    response = await getClient().messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: YEAR_READING_SYSTEM_PROMPT,
      tools: [
        {
          name: YEAR_READING_TOOL_NAME,
          description: "Return the year reading's woven prose, in the exact given shape.",
          input_schema: YEAR_READING_OUTPUT_SCHEMA as Anthropic.Tool.InputSchema,
        },
      ],
      tool_choice: { type: "tool", name: YEAR_READING_TOOL_NAME },
      messages: [{ role: "user", content: userContent }],
    });
  } catch (err) {
    console.error("[year-reading] AI call failed", err);
    return { status: "failed", failureReason: "api_error" };
  }

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );
  if (!toolUse) {
    console.error("[year-reading] no tool_use block", response.content);
    return { status: "failed", failureReason: "parse_error", held: response.content };
  }

  const raw = toolUse.input as YearReadingRawSections;

  const shapeOk =
    typeof raw.framing === "string" &&
    typeof raw.bearingMeetsYear === "string" &&
    typeof raw.stagesAndArc === "string" &&
    typeof raw.elementWeather === "string" &&
    Array.isArray(raw.reflections) &&
    raw.reflections.length > 0 &&
    raw.reflections.every((r) => typeof r === "string");

  if (!shapeOk) {
    console.error("[year-reading] tool output shape mismatch", { raw });
    return { status: "failed", failureReason: "parse_error", held: { raw } };
  }

  const sections: YearReadingSections = {
    framing: raw.framing,
    bearingMeetsYear: raw.bearingMeetsYear,
    stagesAndArc: raw.stagesAndArc,
    elementWeather: raw.elementWeather,
    reflections: raw.reflections,
  };

  const sanitized = sanitizeYearSections(sections);
  const violation = findVoiceViolation(flattenYearSections(sanitized));
  if (violation) {
    console.error(`[year-reading] voice gate rejected generation (${violation})`);
    return { status: "failed", failureReason: "voice_gate", held: sanitized };
  }

  return { status: "ready", sections: sanitized };
}
