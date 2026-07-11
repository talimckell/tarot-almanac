import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import StudioNav from "../components/StudioNav";
import CollectiveVsYouStudio from "./CollectiveVsYouStudio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collective vs You Studio",
  robots: { index: false },
};

export default async function CollectiveVsYouStudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/studio/collective-vs-you");
  if (user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) notFound();

  return (
    <>
      <SiteNav current="me" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          Internal tool
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "6px 0 8px" }}>Collective vs You Studio</h1>
        <p style={{ color: "var(--label)", maxWidth: 640 }}>
          Batch-generate the daily &ldquo;collective card vs your card&rdquo; image for Substack
          Notes. Portrait 1080&times;1350. The collective card of the day is real and shown; the
          &ldquo;your card&rdquo; side is the call to action to find yours at /today.
        </p>
        <StudioNav except="/studio/collective-vs-you" />
        <CollectiveVsYouStudio />
      </div>
      <Footer />
    </>
  );
}
