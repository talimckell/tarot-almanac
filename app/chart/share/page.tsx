// The page a shared natal-chart link points to. Public (no auth): the birth date travels
// as query params so crawlers and other devices render the same glyph-overview image.
// Only glyphs + the Bearing name are exposed, matching the free chart preview.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../components/SiteNav";
import Footer from "../../components/Footer";

const SITE = "https://www.tarotalmanac.com";

type ShareParams = { by?: string; bm?: string; bd?: string; n?: string };

function validBirth(sp: ShareParams): boolean {
  const by = Number(sp.by);
  const bm = Number(sp.bm);
  const bd = Number(sp.bd);
  return (
    Number.isInteger(by) && by > 1000 && by < 3000 &&
    Number.isInteger(bm) && bm >= 1 && bm <= 12 &&
    Number.isInteger(bd) && bd >= 1 && bd <= 31
  );
}

function imageQuery(sp: ShareParams): string {
  const qs = new URLSearchParams();
  if (sp.by) qs.set("by", sp.by);
  if (sp.bm) qs.set("bm", sp.bm);
  if (sp.bd) qs.set("bd", sp.bd);
  if (sp.n) qs.set("n", sp.n);
  const q = qs.toString();
  return q ? `?${q}` : "";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<ShareParams>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const title = sp.n ? `${sp.n}'s natal chart` : "A natal chart";
  const description = "The self you came in as, in seven cards. The Tarot Almanac.";
  const img = `${SITE}/chart/share/image${imageQuery(sp)}`;
  return {
    title: `${title} | The Tarot Almanac`,
    description,
    robots: { index: false },
    openGraph: { title, description, url: `${SITE}/chart/share`, type: "website", images: [{ url: img, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export default async function ChartShareLandingPage({
  searchParams,
}: {
  searchParams: Promise<ShareParams>;
}) {
  const sp = await searchParams;
  if (!validBirth(sp)) notFound();
  const title = sp.n ? `${sp.n}'s natal chart` : "A natal chart";
  const img = `/chart/share/image${imageQuery(sp)}`;

  return (
    <>
      <SiteNav current="me" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--serif-sc)", letterSpacing: 2, textTransform: "uppercase", color: "var(--label)", fontSize: 14 }}>
          A shared chart
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, margin: "8px 0 24px" }}>{title}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={title} width={1200} height={630} style={{ width: "100%", height: "auto", border: "1px solid var(--warm-stone)", borderRadius: 4 }} />
        <div style={{ marginTop: 32 }}>
          <Link href="/chart" style={{ display: "inline-block", padding: "12px 28px", background: "var(--indigo)", color: "var(--stone)", textDecoration: "none", borderRadius: 4, fontFamily: "var(--sans)" }}>
            Make your chart
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
