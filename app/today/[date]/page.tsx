import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { parseBirthday, parseDateSlug, formatDateSlug, isIndexableDate, BIRTHDAY_COOKIE } from "../../../lib/today";
import { formatLongDate, collectiveDayCard } from "../../../lib/almanac";
import { getSignedInBirthday } from "../../../lib/accountBirthday";
import { viewerNow } from "../../../lib/viewerNow";
import { SITE_URL } from "../../../lib/site";
import TodayView from "../TodayView";

// The gate depends on the request-time date, so this can never be statically cached.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const target = parseDateSlug(date);
  if (!target) return {};
  const label = formatLongDate(target.y, target.m, target.d);
  const title = `${label} Tarot Card | The Tarot Almanac`;

  // Only the trailing INDEXABLE_DATE_DAYS_BACK-day window is indexed, matching the
  // sitemap (both share the constant, so they can't drift). Future dates are gated
  // (subscriber time-travel) and speculative; dates older than the window stay fully
  // viewable for time-travellers but carry robots:noindex — otherwise the Earlier/Later
  // stepper exposes an unbounded past (every day back to year 1), a crawl trap that
  // dilutes crawl budget. Only indexability changes here; access stays open via the
  // collective gate. "now" is the viewer's-timezone day (viewerNow).
  if (!isIndexableDate(target, await viewerNow())) {
    return { title, robots: { index: false } };
  }

  const c = collectiveDayCard(target.y, target.m, target.d);
  const description = `The collective tarot card for ${label} is the ${c.minorName}, under ${c.majorName}. See the day's card and its major, and the personal card set by your own birthday.`;
  const url = `${SITE_URL}/today/${formatDateSlug(target)}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article" },
  };
}

export default async function TodayDatePage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ n?: string; b?: string; on?: string; ob?: string }>;
}) {
  const { date } = await params;
  const target = parseDateSlug(date);
  if (!target) notFound();

  const { n, b, on, ob } = await searchParams;
  const account = await getSignedInBirthday();

  let birthday = account?.birthday ?? null;
  const name = account ? account.name ?? undefined : n?.trim() || undefined;

  const now = await viewerNow();

  if (!account) {
    const cookieStore = await cookies();
    birthday = parseBirthday(b, now) ?? parseBirthday(cookieStore.get(BIRTHDAY_COOKIE)?.value, now);
  }

  // Signed-in-only lookup (?on/?ob, never persisted). Any age allowed for a lookup.
  const otherBirthday = account ? parseBirthday(ob, now, true) : null;
  const otherName = account ? on?.trim() || undefined : undefined;

  return (
    <>
      <SiteNav current="today" />
      <TodayView
        target={target}
        now={now}
        birthday={birthday}
        name={name}
        signedIn={!!account}
        subscribed={account?.subscribed ?? false}
        otherBirthday={otherBirthday}
        otherName={otherName}
        basePath={`/today/${formatDateSlug(target)}`}
      />
      <Footer />
    </>
  );
}
