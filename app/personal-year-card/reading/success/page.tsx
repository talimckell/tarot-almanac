import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import SiteNav from "../../../components/SiteNav";
import Footer from "../../../components/Footer";
import "../../styles.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Your reading | The Tarot Almanac", robots: { index: false } };

// Landing after a successful year-reading purchase. Resolves the Checkout Session to its
// PaymentIntent, waits briefly for the webhook to create the row, then sends the buyer
// straight into their reading (which generates on that first view). For a gift, the buyer
// lands here and can copy the reading's URL to send on.
export default async function YearReadingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let paymentIntentId: string | null = null;
  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      paymentIntentId = (session.payment_intent as string | null) ?? null;
    } catch {
      paymentIntentId = null;
    }
  }
  if (!paymentIntentId) redirect("/personal-year-card");

  for (let i = 0; i < 12; i++) {
    const row = await prisma.yearReading.findUnique({
      where: { purchasedPaymentIntentId: paymentIntentId },
    });
    if (row) redirect(`/personal-year-card/reading/${row.shareToken}`);
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Payment succeeded but the webhook hasn't created the row yet (rare). Don't error.
  return (
    <>
      <SiteNav />
      <main className="pyc-wrap" style={{ textAlign: "center", paddingTop: 100 }}>
        <p className="pyc-eyebrow">Payment received</p>
        <h1 className="pyc-h1" style={{ marginBottom: 16 }}>Setting up your reading</h1>
        <p className="pyc-lede" style={{ margin: "0 auto" }}>
          Thank you. Your reading is being prepared. Refresh this page in a moment, or find it in
          your account. If it doesn&rsquo;t appear shortly, contact support and we&rsquo;ll sort it out.
        </p>
      </main>
      <Footer />
    </>
  );
}
