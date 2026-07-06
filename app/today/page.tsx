import type { Metadata } from "next";
import { cookies } from "next/headers";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { parseBirthday, BIRTHDAY_COOKIE } from "../../lib/today";
import { getSignedInBirthday } from "../../lib/accountBirthday";
import { viewerNow } from "../../lib/viewerNow";
import TodayView from "./TodayView";

// The gate depends on the request-time date, so this can never be statically cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Today | The Tarot Almanac",
  robots: { index: false },
};

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ n?: string; b?: string; on?: string; ob?: string }>;
}) {
  const { n, b, on, ob } = await searchParams;
  const account = await getSignedInBirthday();

  let birthday = account?.birthday ?? null;
  const name = account ? account.name ?? undefined : n?.trim() || undefined;

  const now = await viewerNow();

  // Only an anonymous (signed-out) visitor falls back to the cookie/query param —
  // a signed-in account's own birthday always wins, so a stray ?b= link (a gift
  // chart's funnel CTA, a test link, anything) can never silently override what a
  // real account shows on their own /today.
  if (!account) {
    const cookieStore = await cookies();
    birthday = parseBirthday(b, now) ?? parseBirthday(cookieStore.get(BIRTHDAY_COOKIE)?.value, now);
  }

  // Looking someone up is a signed-in-only feature (?on/?ob, never persisted, so it
  // can't touch the cookie or the account). Any age is allowed for a lookup.
  const otherBirthday = account ? parseBirthday(ob, now, true) : null;
  const otherName = account ? on?.trim() || undefined : undefined;

  return (
    <>
      <SiteNav current="today" />
      <TodayView
        target={now}
        now={now}
        birthday={birthday}
        name={name}
        signedIn={!!account}
        subscribed={account?.subscribed ?? false}
        otherBirthday={otherBirthday}
        otherName={otherName}
        basePath="/today"
      />
      <Footer />
    </>
  );
}
