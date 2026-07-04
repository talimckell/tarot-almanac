// The page a shared Bearing link points to. Link-preview crawlers read its metadata
// (og/twitter image point at the sibling /share/image route, absolute www host); humans
// who click through get the same image plus a CTA to find their own Bearing.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import Footer from "../../../components/Footer";
import { getCardBySlug } from "@/lib/cards";

const SITE = "https://www.tarotalmanac.com";

type ShareParams = { n?: string };

function imageQuery(sp: ShareParams): string {
  const qs = new URLSearchParams();
  if (sp.n) qs.set("n", sp.n);
  const q = qs.toString();
  return q ? `?${q}` : "";
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ShareParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card || card.majorIndex === undefined) return {};
  const sp = await searchParams;
  const title = sp.n ? `${sp.n}'s Bearing is ${card.name}` : `A Bearing of ${card.name}`;
  const description = "The one card you carry your whole life. The Tarot Almanac.";
  const img = `${SITE}/bearing/${slug}/share/image${imageQuery(sp)}`;
  return {
    title: `${title} | The Tarot Almanac`,
    description,
    robots: { index: false },
    openGraph: { title, description, url: `${SITE}/bearing/${slug}/share`, type: "website", images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export default async function BearingShareLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ShareParams>;
}) {
  const { slug } = await params;
  const card = getCardBySlug(slug);
  if (!card || card.majorIndex === undefined) notFound();
  const sp = await searchParams;
  const img = `/bearing/${slug}/share/image${imageQuery(sp)}`;

  return (
    <>
      <SiteNav current="bearing" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          {sp.n ? `${sp.n}'s Bearing` : "A shared Bearing"}
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, margin: "8px 0 24px" }}>{card.name}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={`The Bearing of ${card.name}`} width={1200} height={630} style={{ width: "100%", height: "auto", border: "1px solid var(--warm-stone)", borderRadius: 4 }} />
        <div style={{ marginTop: 32 }}>
          <Link href="/bearing" style={{ display: "inline-block", padding: "12px 28px", background: "var(--indigo)", color: "var(--stone)", textDecoration: "none", borderRadius: 4, fontFamily: "var(--sans)" }}>
            Find your Bearing
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
