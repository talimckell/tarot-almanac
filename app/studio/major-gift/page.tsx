import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import { pinterestPoolStatus } from "@/lib/pinterestUsage";
import { MAJOR_GIFT_BOARD, MAJOR_GIFT_TOTAL } from "@/lib/majorGiftBoard";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import StudioNav from "../components/StudioNav";
import MajorGiftStudio from "./MajorGiftStudio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pinterest: Major Arcana Gift Meanings Board Studio",
  robots: { index: false },
};

export default async function MajorGiftStudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/studio/major-gift");
  if (user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) notFound();

  const status = await pinterestPoolStatus(MAJOR_GIFT_BOARD, MAJOR_GIFT_TOTAL);

  return (
    <>
      <SiteNav current="me" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          Internal tool &middot; Pinterest
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "6px 0 8px" }}>Major Arcana Gift Meanings Board Studio</h1>
        <p style={{ color: "var(--label)", maxWidth: 640 }}>
          Batch-generate Pinterest pins for the &ldquo;Major Arcana Gift Meanings&rdquo;
          board &mdash; one pin per Major, upright/gift meaning, 22 total. Previewing
          costs nothing; a pin is only marked done the moment you download its batch.
        </p>
        <StudioNav except="/studio/major-gift" />
        <MajorGiftStudio initialStatus={status} />
      </div>
      <Footer />
    </>
  );
}
