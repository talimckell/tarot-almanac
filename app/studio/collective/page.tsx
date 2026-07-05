import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import StudioNav from "../components/StudioNav";
import CollectiveStudio from "./CollectiveStudio";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Collective Campaign Studio",
  robots: { index: false },
};

export default async function CollectiveStudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/studio/collective");
  if (user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) notFound();

  return (
    <>
      <SiteNav current="me" />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          Internal tool
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, margin: "6px 0 8px" }}>Collective Campaign Studio</h1>
        <p style={{ color: "var(--label)", maxWidth: 640 }}>
          Batch-generate &ldquo;card of the day&rdquo; images for Bluesky. Every four days cycles
          through four visual treatments &mdash; affirmation, essence, keywords, and the
          collective reading &mdash; so the feed doesn&rsquo;t look the same post to post.
        </p>
        <StudioNav except="/studio/collective" />
        <CollectiveStudio />
      </div>
      <Footer />
    </>
  );
}
