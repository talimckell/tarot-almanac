import type { Metadata } from "next";
import { cookies } from "next/headers";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import { parseBirthday, BIRTHDAY_COOKIE, type YMD } from "../../lib/today";
import { getSignedInBirthday } from "../../lib/accountBirthday";
import TodayView from "./TodayView";

// The gate depends on the request-time date, so this can never be statically cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Today | The Tarot Almanac",
  robots: { index: false },
};

function serverNow(): YMD {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
}

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; b?: string }>;
}) {
  const { n, b } = await searchParams;
  const account = await getSignedInBirthday();

  let birthday = account?.birthday ?? null;
  let name = account ? account.name ?? undefined : n?.trim() || undefined;

  // Only an anonymous (signed-out) visitor falls back to the cookie/query param —
  // a signed-in account's own birthday always wins, so a stray ?b= link (a gift
  // chart's funnel CTA, a test link, anything) can never silently override what a
  // real account shows on their own /today.
  if (!account) {
    const cookieStore = await cookies();
    birthday = parseBirthday(b) ?? parseBirthday(cookieStore.get(BIRTHDAY_COOKIE)?.value);
  }

  const now = serverNow();

  return (
    <>
      <SiteNav current="today" />
      <TodayView target={now} now={now} birthday={birthday} name={name} />
      <SiteFooter />
    </>
  );
}
