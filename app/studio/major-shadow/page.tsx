import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import { pinterestPoolStatus } from "@/lib/pinterestUsage";
import { MAJOR_SHADOW_BOARD, MAJOR_SHADOW_TOTAL } from "@/lib/majorShadowBoard";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import MajorShadowStudio from "./MajorShadowStudio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pinterest: Major Arcana Shadow Meanings Board Studio",
  robots: { index: false },
};

export default async function MajorShadowStudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/studio/major-shadow");
  if (user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) notFound();

  const status = await pinterestPoolStatus(MAJOR_SHADOW_BOARD, MAJOR_SHADOW_TOTAL);

  return (
    <>
      <SiteNav current="me" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          Internal tool &middot; Pinterest
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "6px 0 8px" }}>Major Arcana Shadow Meanings Board Studio</h1>
        <p style={{ color: "var(--label)", maxWidth: 640 }}>
          Batch-generate Pinterest pins for the &ldquo;Major Arcana Shadow Meanings&rdquo;
          board &mdash; one pin per Major, shadow meaning, 22 total. A dark, moodier
          treatment than Gift on purpose, so the two boards read as visually distinct.
        </p>
        <p style={{ marginTop: 8, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <Link href="/studio/collective" style={{ color: "var(--indigo)" }}>Collective Studio &rarr;</Link>
          <Link href="/studio/birthday-bearings" style={{ color: "var(--indigo)" }}>Birthday Bearings Studio &rarr;</Link>
          <Link href="/studio/reclaimed-reversals" style={{ color: "var(--indigo)" }}>Reclaimed Reversals Studio &rarr;</Link>
          <Link href="/studio/pinterest-birthday" style={{ color: "var(--indigo)" }}>Pinterest: Birthday Board &rarr;</Link>
          <Link href="/studio/major-gift" style={{ color: "var(--indigo)" }}>Pinterest: Major Gift Board &rarr;</Link>
          <Link href="/studio/major-reclaimed" style={{ color: "var(--indigo)" }}>Pinterest: Major Reclaimed Board &rarr;</Link>
        </p>
        <MajorShadowStudio initialStatus={status} />
      </div>
      <Footer />
    </>
  );
}
