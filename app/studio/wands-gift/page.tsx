import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import { pinterestPoolStatus } from "@/lib/pinterestUsage";
import { WANDS_GIFT_BOARD, WANDS_GIFT_TOTAL } from "@/lib/wandsGiftBoard";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import StudioNav from "../components/StudioNav";
import SuitBoardStudio from "../components/SuitBoardStudio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pinterest: Wands Gift Meanings Board Studio",
  robots: { index: false },
};

export default async function WandsGiftStudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/studio/wands-gift");
  if (user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) notFound();

  const status = await pinterestPoolStatus(WANDS_GIFT_BOARD, WANDS_GIFT_TOTAL);

  return (
    <>
      <SiteNav current="me" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          Internal tool &middot; Pinterest
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "6px 0 8px" }}>Suit of Wands Gift Meanings Board Studio</h1>
        <p style={{ color: "var(--label)", maxWidth: 640 }}>
          Batch-generate Pinterest pins for the &ldquo;Tarot Minor Arcana Suit of Wands Gift
          Meanings&rdquo; board &mdash; one pin per rank, upright/gift meaning, 14 total.
          Same bright saturated-field treatment as Major Gift and Cups Gift.
        </p>
        <StudioNav except="/studio/wands-gift" />
        <SuitBoardStudio
          boardSlug={WANDS_GIFT_BOARD}
          boardLabel="Wands Gift"
          total={WANDS_GIFT_TOTAL}
          initialStatus={status}
        />
      </div>
      <Footer />
    </>
  );
}
