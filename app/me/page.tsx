import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteNav from "../components/SiteNav";
import SiteFooter from "../components/SiteFooter";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  type YM,
  parseMonthSlug,
  formatMonthSlug,
  isMonthOpen,
  monthIndex,
} from "@/lib/today";
import MeView from "./MeView";

// Depends on the signed-in session and the request-time date — never statically cached.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "My Almanac | The Tarot Almanac",
  robots: { index: false },
};

function serverNowYM(): YM {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1 };
}

function serverToday(): { y: number; m: number; d: number } {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
}

export default async function MePage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; view?: string }>;
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
    include: { savedCharts: { orderBy: { createdAt: "asc" } } },
  });

  const { month, view } = await searchParams;
  const nowYM = serverNowYM();
  const requestedMonth = (month && parseMonthSlug(month)) || nowYM;

  // No data leak: a locked month is never fetched or rendered, just bounced to
  // the current month (same discipline as /today/[date]'s per-day gate).
  if (!isMonthOpen(requestedMonth, nowYM)) {
    redirect("/me");
  }

  const hasBirthday = profile.birthDate !== null;
  const resolvedView: "personal" | "collective" =
    hasBirthday && view === "collective" ? "collective" : hasBirthday ? "personal" : "collective";

  const birthDate = profile.birthDate;
  const birthday = birthDate
    ? { bm: birthDate.getUTCMonth() + 1, bd: birthDate.getUTCDate() }
    : null;

  const forwardLimitIndex = monthIndex(nowYM) + 1;
  const nextLocked = monthIndex(requestedMonth) >= forwardLimitIndex;

  return (
    <>
      <SiteNav current="me" />
      <MeView
        profile={{
          name: profile.name,
          email: profile.email,
          birthDate: birthDate ? birthDate.toISOString().slice(0, 10) : null,
        }}
        savedCharts={profile.savedCharts.map((c) => ({
          id: c.id,
          name: c.name,
          birthDate: c.birthDate.toISOString().slice(0, 10),
        }))}
        month={requestedMonth}
        monthSlug={formatMonthSlug(requestedMonth)}
        isCurrentMonth={monthIndex(requestedMonth) === monthIndex(nowYM)}
        nextLocked={nextLocked}
        today={serverToday()}
        birthday={birthday}
        view={resolvedView}
      />
      <SiteFooter />
    </>
  );
}
