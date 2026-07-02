import type { Metadata } from "next";
import { cookies } from "next/headers";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import { parseBirthday, BIRTHDAY_COOKIE, type YMD } from "../../lib/today";
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
  const cookieStore = await cookies();
  const birthday = parseBirthday(b) ?? parseBirthday(cookieStore.get(BIRTHDAY_COOKIE)?.value);
  const now = serverNow();

  return (
    <>
      <SiteNav current="today" />
      <TodayView target={now} now={now} birthday={birthday} name={n?.trim() || undefined} />
      <SiteFooter />
    </>
  );
}
