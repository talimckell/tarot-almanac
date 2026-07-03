import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import { parseBirthday, parseDateSlug, BIRTHDAY_COOKIE, type YMD } from "../../../lib/today";
import { formatLongDate } from "../../../lib/almanac";
import { getSignedInBirthday } from "../../../lib/accountBirthday";
import TodayView from "../TodayView";

// The gate depends on the request-time date, so this can never be statically cached.
export const dynamic = "force-dynamic";

function serverNow(): YMD {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const target = parseDateSlug(date);
  if (!target) return {};
  return {
    title: `${formatLongDate(target.y, target.m, target.d)} | The Tarot Almanac`,
    robots: { index: false },
  };
}

export default async function TodayDatePage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ n?: string; b?: string }>;
}) {
  const { date } = await params;
  const target = parseDateSlug(date);
  if (!target) notFound();

  const { n, b } = await searchParams;
  const account = await getSignedInBirthday();

  let birthday = account?.birthday ?? null;
  let name = account ? account.name ?? undefined : n?.trim() || undefined;

  const now = serverNow();

  if (!account) {
    const cookieStore = await cookies();
    birthday = parseBirthday(b, now) ?? parseBirthday(cookieStore.get(BIRTHDAY_COOKIE)?.value, now);
  }

  return (
    <>
      <SiteNav current="today" />
      <TodayView target={target} now={now} birthday={birthday} name={name} signedIn={!!account} />
      <Footer />
    </>
  );
}
