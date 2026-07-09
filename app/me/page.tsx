import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteNav from "../components/SiteNav";
import Footer from "../components/Footer";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { isSubscribed } from "@/lib/compAccounts";
import {
  parseMonthSlug,
  formatMonthSlug,
  isMonthOpenForViewer,
  monthIndex,
} from "@/lib/today";
import { viewerNow } from "@/lib/viewerNow";
import MeView from "./MeView";

// Depends on the signed-in session and the request-time date — never statically cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Almanac | The Tarot Almanac",
  robots: { index: false },
};

export default async function MePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; view?: string; checkout?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/me");

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email ?? user.id },
    include: {
      savedCharts: { orderBy: { createdAt: "asc" } },
      yearReadings: { orderBy: { createdAt: "desc" } },
    },
  });

  const { month, view, checkout } = await searchParams;
  const now = await viewerNow();
  const nowYM = { y: now.y, m: now.m };
  const requestedMonth = (month && parseMonthSlug(month)) || nowYM;
  const subscribed = isSubscribed(profile);

  // No data leak: a locked month is never fetched or rendered, just bounced to
  // the current month (same discipline as /today/[date]'s per-day gate).
  if (!isMonthOpenForViewer(requestedMonth, nowYM, subscribed)) {
    redirect("/me");
  }

  const hasBirthday = profile.birthDate !== null;
  const resolvedView: "personal" | "collective" =
    hasBirthday && view === "collective" ? "collective" : hasBirthday ? "personal" : "collective";

  const birthDate = profile.birthDate;
  const birthday = birthDate
    ? { bm: birthDate.getUTCMonth() + 1, bd: birthDate.getUTCDate() }
    : null;

  const forwardLimitIndex = subscribed ? monthIndex(nowYM) + 1 : monthIndex(nowYM);
  const nextLocked = monthIndex(requestedMonth) >= forwardLimitIndex;
  const prevLocked = !subscribed; // non-subscribers only ever reach the current month page

  return (
    <>
      <SiteNav current="me" />
      <MeView
        profile={{
          name: profile.name,
          email: profile.email,
          birthDate: birthDate ? birthDate.toISOString().slice(0, 10) : null,
          subscribed,
        }}
        savedCharts={profile.savedCharts.map((c) => ({
          id: c.id,
          name: c.name,
          birthDate: c.birthDate.toISOString().slice(0, 10),
        }))}
        yearReadings={profile.yearReadings.map((r) => ({
          token: r.shareToken,
          name: r.name,
          year: r.readingYear,
          yearCardIndex: r.yearCardIndex,
          status: r.status,
        }))}
        month={requestedMonth}
        monthSlug={formatMonthSlug(requestedMonth)}
        isCurrentMonth={monthIndex(requestedMonth) === monthIndex(nowYM)}
        nextLocked={nextLocked}
        prevLocked={prevLocked}
        today={now}
        birthday={birthday}
        view={resolvedView}
        checkout={checkout}
      />
      <Footer />
    </>
  );
}
