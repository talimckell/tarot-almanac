import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { renderMarkdown } from "./markdown";

// Authored collective-month readings, in Tali's voice, one markdown file per month at
// content/collective-months/<YYYY-MM>.md. When a file exists, /month/[ym] renders it in
// place of the auto-generated card-intro + calculation prose (the reading covers both, in
// voice, including the year+month math). Absent = the page keeps its templated fallback.
// This is authored content, never generated — wire it, don't rewrite it.
export async function getCollectiveMonthReadingHtml(ymSlug: string): Promise<string | null> {
  try {
    const source = await readFile(
      join(process.cwd(), "content", "collective-months", `${ymSlug}.md`),
      "utf-8",
    );
    return await renderMarkdown(source);
  } catch {
    // No authored reading for this month — fall back to the templated sections.
    return null;
  }
}
