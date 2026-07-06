import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { parseBirthday, parseDateSlug, formatDateSlug, isPastOrToday, BIRTHDAY_COOKIE } from "../../../lib/today";
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

  // Future dates are gated (subscriber time-travel) and speculative, so they stay
  // out of the index. Past/today collective readings are public, so they're indexed
  // with a self-canonical and a card-specific description for the SERP snippet.
  // "now" is resolved once per request from the viewer's timezone (viewerNow), so
  // the robots decision here and the content gate below always agree within a
  // request. Future dates stay out of the index; past/today collective readings
  // are indexed. Sitemap coverage stays on a stable UTC clock (app/sitemap.ts).
  if (!isPastOrToday(target, await viewerNow())) {
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
