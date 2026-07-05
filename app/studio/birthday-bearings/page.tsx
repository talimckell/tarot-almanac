import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import StudioNav from "../components/StudioNav";
import BirthdayBearingsStudio from "./BirthdayBearingsStudio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Birthday Bearings Campaign Studio",
  robots: { index: false },
};

export default async function BirthdayBearingsStudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/studio/birthday-bearings");
  if (user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) notFound();

  return (
    <>
      <SiteNav current="me" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          Internal tool
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "6px 0 8px" }}>Birthday Bearings Campaign Studio</h1>
        <p style={{ color: "var(--label)", maxWidth: 640 }}>
          Batch-generate the daily &ldquo;born today?&rdquo; Bearing post for Bluesky. One
          visual treatment reused every day &mdash; the Bearing itself is what changes,
          and it recurs forever since it only depends on month and day.
        </p>
        <StudioNav except="/studio/birthday-bearings" />
        <BirthdayBearingsStudio />
      </div>
      <Footer />
    </>
  );
}
