import { cookies, headers } from "next/headers";
import { TZ_COOKIE, TZ_RE, type YMD, type YM } from "./today";

// Resolve "now" as the calendar date in the VIEWER's timezone, not the server's
// UTC. Preference order: the `tz` cookie (the device's own `Intl` zone, written
// client-side by `TimezoneSync` — exact, but only present after a first page load
// sets it) → Vercel's `x-vercel-ip-timezone` header (IP-derived, present on every
// request but wrong on VPNs / some cellular routing) → UTC.
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
  const cookieTz = (await cookies()).get(TZ_COOKIE)?.value;
  const tz =
    (cookieTz && TZ_RE.test(cookieTz) ? cookieTz : null) ??
    (await headers()).get("x-vercel-ip-timezone")?.trim();
  return ymdInZone(tz);
}

export async function viewerNowYM(): Promise<YM> {
  const { y, m } = await viewerNow();
  return { y, m };
}
