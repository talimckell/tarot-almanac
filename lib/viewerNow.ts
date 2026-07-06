import { headers } from "next/headers";
import type { YMD, YM } from "./today";

// Resolve "now" as the calendar date in the VIEWER's timezone, not the server's
// UTC. On Vercel every request carries `x-vercel-ip-timezone` — an IANA zone
// (e.g. "America/Los_Angeles") derived from the request IP — so we can format the
// current instant in the viewer's own day without any client JS or hydration
// dance. When the header is absent (local dev, or a non-Vercel host) or invalid,
// we fall back to UTC, which is exactly the prior behavior.
//
// This only changes WHICH date is "today" for a given viewer. The card<->date
// mapping is untouched and stays identical worldwide, so it doesn't conflict with
// the settled calculations. It mirrors what the homepage "You today" block already
// does client-side (today-entry.tsx uses the device's local calendar day).

function ymdInZone(tz: string | null | undefined): YMD {
  const now = new Date();
  if (tz) {
    try {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(now);
      const pick = (t: string) => Number(parts.find((p) => p.type === t)?.value);
      const y = pick("year");
      const m = pick("month");
      const d = pick("day");
      if (y && m && d) return { y, m, d };
    } catch {
      // Unrecognized time zone string — fall through to UTC.
    }
  }
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
}

export async function viewerNow(): Promise<YMD> {
  const tz = (await headers()).get("x-vercel-ip-timezone")?.trim();
  return ymdInZone(tz);
}

export async function viewerNowYM(): Promise<YM> {
  const { y, m } = await viewerNow();
  return { y, m };
}
