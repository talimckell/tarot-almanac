import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import Footer from "../../../components/Footer";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { type YM, parseMonthSlug, isMonthOpenForViewer } from "@/lib/today";
import { getOrCreateMonthlyReading } from "@/lib/monthlyReadingStore";
import MonthlyReadingView from "./MonthlyReadingView";

// Generation (on first request for this month) and the access gate both depend on the
// signed-in session and the request-time date — never statically cached.
export const dynamic = "force-dynamic";

function serverNowYM(): YM {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1 };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ month: string }>;
}): Promise<Metadata> {
  const { month } = await params;
  const target = parseMonthSlug(month);
  if (!target) return {};
  const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return {
    title: `Your ${MONTH_NAMES[target.m - 1]} ${target.y} | The Tarot Almanac`,
    robots: { index: false },
  };
}

export default async function MonthlyReadingPage({
  params,
}: {
  params: Promise<{ month: string }>;
}) {
  const { month } = await params;
  const target = parseMonthSlug(month);
  if (!target) redirect("/me");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/sign-in?next=/me/reading/${month}`);

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  // No profile row yet, or no birthday on file: nothing personal to compute. Bounce to
  // /me, which upserts the profile and prompts for a birthday.
  if (!profile || !profile.birthDate) redirect("/me");

  // The monthly reading is a subscriber perk (bundled with the subscription, same as
  // /me's pricing copy already advertises) — unlike /today's per-day gate, there is no
  // free/preview tier here, since a month's reading necessarily covers days that
  // haven't happened yet even within the "free" current-month window.
  const subscribed = profile.subscriptionStatus === "active";
  if (!subscribed) redirect("/me#subscribe");

  const nowYM = serverNowYM();
  // Same discipline as /me and /today/[date]: a locked month is never fetched or
  // rendered, just bounced back, so no data leak past the access rule.
  if (!isMonthOpenForViewer(target, nowYM, subscribed)) redirect("/me");

  const bm = profile.birthDate.getUTCMonth() + 1;
  const bd = profile.birthDate.getUTCDate();

  const record = await getOrCreateMonthlyReading(profile.id, target, bm, bd);

  return (
    <>
      <SiteNav current="me" />
      <MonthlyReadingView
        name={profile.name}
        monthSlug={month}
        bm={bm}
        bd={bd}
        pkg={record.pkg}
        status={record.status}
        sections={record.status === "ready" ? record.sections : null}
      />
      <Footer />
    </>
  );
}
