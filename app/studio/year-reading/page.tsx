import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";
import YearReadingPreview from "./YearReadingPreview";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Year Reading — Preview Studio",
  robots: { index: false },
};

// Owner-only preview for the paid year-ahead reading (phase 2, chunk 1). Generate real
// readings in-app to judge quality before checkout/storage exist.
export default async function YearReadingStudioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/studio/year-reading");
  if (user.email?.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) notFound();

  return (
    <>
      <SiteNav />
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "48px 24px 96px" }}>
        <p
          style={{
            fontFamily: "var(--serif-sc)",
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--label)",
          }}
        >
          Owner Preview
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontWeight: 500, fontSize: 40, margin: "8px 0 6px", color: "var(--ink)" }}>
          Year reading generator
        </h1>
        <p style={{ fontFamily: "var(--sans)", fontWeight: 300, color: "var(--charcoal)", maxWidth: "60ch" }}>
          Enter a birthday and a year. This runs the real generation (Opus by default, the voice
          gate, up to three attempts) so you can judge the woven reading before checkout or storage
          are wired. Nothing is saved.
        </p>
        <YearReadingPreview />
      </main>
      <Footer />
    </>
  );
}
