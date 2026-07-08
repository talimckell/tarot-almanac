"use server";

import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import { buildYearPackage, type YearPackage } from "@/lib/yearReading";
import { generateYearReading, type YearReadingResult } from "@/lib/yearReadingAI";

export interface PreviewResult {
  ok: boolean;
  error?: string;
  pkg?: YearPackage;
  result?: YearReadingResult;
  ms?: number;
}

// Owner-only preview generator (chunk 1): builds the deterministic package and runs the
// real AI generation so the reading can be judged in-app before any checkout or storage
// is wired. No DB writes.
export async function generateYearReadingPreview(formData: FormData): Promise<PreviewResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) {
    return { ok: false, error: "Not authorized." };
  }

  const name = String(formData.get("name") ?? "");
  const month = Number(formData.get("month"));
  const day = Number(formData.get("day"));
  const year = Number(formData.get("year"));
  if (!month || !day || !year || year < 1 || year > 3000) {
    return { ok: false, error: "Enter a month, a day, and a four-digit year." };
  }

  const pkg = buildYearPackage(name, year, month, day);
  const started = Date.now();
  const result = await generateYearReading(pkg);
  return { ok: true, pkg, result, ms: Date.now() - started };
}
