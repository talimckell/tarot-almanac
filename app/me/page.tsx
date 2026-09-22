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
  searchParams: Promise<{ month?: string; view?: string; checkout?: string; subscribe?: string; gift?: string; next?: string }>;
}) {
  const { subscribe, gift, next: returnTo } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    // #subscribe never reaches the server (fragments aren't sent in requests), so a
    // signed-out click on a "/me?subscribe=1#subscribe" link needs the query param to
    // carry the intent here. Once decoded back out on the sign-in page, the fragment
    // rides along inside `next` as plain text and works on the final client-side
    // navigation after verifying the code, landing straight on the paywall instead of
    // the top of the page. Same idea for `next` itself (a gated page like /chart
    // sending someone here for a missing detail) — not normally hit signed-out in
    // practice (the gated page's own sign-in gate runs first), but a stale session
    // mid-flow shouldn't silently drop where they were headed either.
    const validReturnTo = returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : null;
    const next = validReturnTo
      ? `/me?next=${encodeURIComponent(validReturnTo)}#your-details`
      : subscribe === "1" || gift === "1"
        ? "/me#subscribe"
        : "/me";
    // A gift-chart link (e.g. the homepage FAQ) lands on the same #subscribe box, which
    // holds the $12 "just this chart" option, but the sign-in page should explain a
    // one-off chart, not pitch the subscription.
    const reason = !validReturnTo && gift === "1" ? "gift-chart" : "almanac";
    redirect(`/sign-in?next=${encodeURIComponent(next)}&reason=${reason}`);
  }

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
      <main>
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
        returnTo={returnTo && returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : undefined}
      />
      </main>
      <Footer />
    </>
  );
}
