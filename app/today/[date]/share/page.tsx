// The page a shared link actually points to. Link-preview crawlers read its metadata
// (openGraph/twitter images point at the sibling /share/image route) with no cookies
// and no JS, so the personalization has to travel as querystring, not session state.
// Humans who click through land here too, and get the same image plus the CTA.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import Footer from "../../../components/Footer";
import { parseDateSlug } from "@/lib/today";
import { formatLongDate } from "@/lib/almanac";

// www is the canonical host in production; the bare apex 308-redirects to it. OG/Twitter
// image URLs must be the direct 200 host — several link-preview crawlers (iMessage) won't
// follow a redirect for a preview image, which shows up as a broken share card.
const SITE = "https://www.tarotalmanac.com";

type ShareParams = { bm?: string; bd?: string; n?: string };

function imageQuery(sp: ShareParams): string {
  const qs = new URLSearchParams();
  if (sp.bm) qs.set("bm", sp.bm);
  if (sp.bd) qs.set("bd", sp.bd);
  if (sp.n) qs.set("n", sp.n);
  const query = qs.toString();
  return query ? `?${query}` : "";
}

// Relative for the on-page <img> (works on any host incl. local dev); absolute for the
// OG/Twitter meta, since link-preview crawlers require a fully-qualified image URL.
function imagePath(date: string, sp: ShareParams): string {
  return `/today/${date}/share/image${imageQuery(sp)}`;
}
function imageUrl(date: string, sp: ShareParams): string {
  return `${SITE}${imagePath(date, sp)}`;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<ShareParams>;
}): Promise<Metadata> {
  const { date } = await params;
  const target = parseDateSlug(date);
  if (!target) return {};
  const sp = await searchParams;
  const dateLabel = formatLongDate(target.y, target.m, target.d);
  const title = sp.n ? `${sp.n}'s reading for ${dateLabel}` : `A reading for ${dateLabel}`;
  const description = "The world's card and a personal one, side by side. The Tarot Almanac.";
  const img = imageUrl(date, sp);
  return {
    title: `${title} | The Tarot Almanac`,
    description,
    robots: { index: false },
    openGraph: {
      title,
      description,
      url: `${SITE}/today/${date}/share`,
      type: "website",
      images: [{ url: img, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [img] },
  };
}

export default async function TodayShareLandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ date: string }>;
  searchParams: Promise<ShareParams>;
}) {
  const { date } = await params;
  const target = parseDateSlug(date);
  if (!target) notFound();
  const sp = await searchParams;
  const dateLabel = formatLongDate(target.y, target.m, target.d);
  const img = imagePath(date, sp);

  return (
    <>
      <SiteNav current="today" />
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px", textAlign: "center" }}>
        <p
          style={{
            fontFamily: "var(--serif-sc)",
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "var(--label)",
            fontSize: 14,
          }}
        >
          {sp.n ? `${sp.n}'s reading` : "A shared reading"}
        </p>
        <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, margin: "8px 0 24px" }}>{dateLabel}</h1>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={`The reading for ${dateLabel}`}
          width={1200}
          height={630}
          style={{ width: "100%", height: "auto", border: "1px solid var(--warm-stone)", borderRadius: 4 }}
        />
        <div style={{ marginTop: 32 }}>
          <Link
            href="/today"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              background: "var(--indigo)",
              color: "var(--stone)",
              textDecoration: "none",
              borderRadius: 4,
              fontFamily: "var(--sans)",
            }}
          >
            Get your own daily reading
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
