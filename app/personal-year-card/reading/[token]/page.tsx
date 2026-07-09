import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "../../../components/SiteNav";
import Footer from "../../../components/Footer";
import { getYearReadingByToken } from "@/lib/yearReadingStore";
import YearReadingReport from "./YearReadingReport";

// Generated on first view and gated by possession of the token (giftable, no account
// required), so never statically cached and never indexed.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Your year-ahead reading | The Tarot Almanac",
  robots: { index: false },
};

export default async function YearReadingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const record = await getYearReadingByToken(token);
  if (!record) notFound();

  return (
    <>
      <SiteNav />
      <YearReadingReport
        pkg={record.pkg}
        sections={record.status === "ready" ? record.sections : null}
      />
      <Footer />
    </>
  );
}
