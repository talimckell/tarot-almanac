// The page a shared monthly-card link points to. Public (no auth): the birthday travels
// as query params so link-preview crawlers and other devices can render the same image.
// Shows the card image + a CTA into the almanac. Only the deterministic month Major is
// exposed here, never the subscriber-only woven reading.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../../../components/SiteNav";
import Footer from "../../../../components/Footer";
import { parseMonthSlug, formatMonthLabel } from "@/lib/today";

const SITE = "https://www.tarotalmanac.com";

type ShareParams = { bm?: string; bd?: string; n?: string };

function imageQuery(sp: ShareParams): string {
  const qs = new URLSearchParams();
  if (sp.bm) qs.set("bm", sp.bm);
  if (sp.bd) qs.set("bd", sp.bd);
  if (sp.n) qs.set("n", sp.n);
  const q = qs.toString();
  return q ? `?${q}` : "";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ month: string }>;
  searchParams: Promise<ShareParams>;
}): Promise<Metadata> {
  const { month } = await params;
  const target = parseMonthSlug(month);
  if (!target) return {};
  const sp = await searchParams;
  const monthLabel = formatMonthLabel(target);
  const title = sp.n ? `${sp.n}'s card for ${monthLabel}` : `A month card for ${monthLabel}`;
  const description = "The card the month sets for you. The Tarot Almanac.";
  const img = `${SITE}/me/reading/${month}/share/image${imageQuery(sp)}`;
  return {
    title: `${title} | The Tarot Almanac`,
    description,
    robots: { index: false },
    openGraph: { title, description, url: `${SITE}/me/reading/${month}/share`, type: "website", images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export default async function MonthlyShareLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ month: string }>;
  searchParams: Promise<ShareParams>;
}) {
  const { month } = await params;
  const target = parseMonthSlug(month);
  if (!target) notFound();
  const sp = await searchParams;
  const monthLabel = formatMonthLabel(target);
  const img = `/me/reading/${month}/share/image${imageQuery(sp)}`;

  return (
    <>
      <SiteNav current="me" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          {sp.n ? `${sp.n}'s month card` : "A shared month card"}
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, margin: "8px 0 24px" }}>{monthLabel}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={`A month card for ${monthLabel}`} width={1200} height={630} style={{ width: "100%", height: "auto", border: "1px solid var(--warm-stone)", borderRadius: 4 }} />
        <div style={{ marginTop: 32 }}>
          <Link href="/me" style={{ display: "inline-block", padding: "12px 28px", background: "var(--indigo)", color: "var(--stone)", textDecoration: "none", borderRadius: 4, fontFamily: "var(--sans)" }}>
            See your month
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
