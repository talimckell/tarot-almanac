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

// Never throws — every failure mode (API error, malformed tool call, shape mismatch,
// voice-gate rejection) resolves to a "failed" result instead, so the caller can store
// the one terminal outcome and move on (no regeneration; see lib/monthlyReadingStore.ts).
export async function generateMonthlyReading(pkg: MonthlyPackage): Promise<MonthlyReadingResult> {
  const input = buildMonthlyReadingAIInput(pkg);

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
      messages: [{ role: "user", content: JSON.stringify(input) }],
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

  const sections = toolUse.input as MonthlyReadingSections;
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
