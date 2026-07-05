import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import { poolStatus } from "@/lib/reclaimedReversals";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import ReclaimedReversalsStudio from "./ReclaimedReversalsStudio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reclaimed Reversals Campaign Studio",
  robots: { index: false },
};

export default async function ReclaimedReversalsStudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/studio/reclaimed-reversals");
  if (user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) notFound();

  const status = await poolStatus();

  return (
    <>
      <SiteNav current="me" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          Internal tool
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "6px 0 8px" }}>Reclaimed Reversals Campaign Studio</h1>
        <p style={{ color: "var(--label)", maxWidth: 640 }}>
          Random batches from all 78 cards (Major + Minor), each card&rsquo;s reversed
          reclaiming reading. Previewing costs nothing &mdash; a card is only marked
          &ldquo;done&rdquo; the moment you download its batch.
        </p>
        <p style={{ marginTop: 8, display: "flex", gap: 16 }}>
          <Link href="/studio/collective" style={{ color: "var(--indigo)" }}>Collective Campaign Studio &rarr;</Link>
          <Link href="/studio/birthday-bearings" style={{ color: "var(--indigo)" }}>Birthday Bearings Studio &rarr;</Link>
        </p>
        <ReclaimedReversalsStudio initialStatus={status} />
      </div>
      <Footer />
    </>
  );
}
