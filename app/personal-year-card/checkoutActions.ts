"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  stripe,
  STRIPE_PRICE_ID_YEAR_READING,
  getOrCreateStripeCustomerId,
} from "@/lib/stripe";
import { trackFormSubmitServer } from "@/lib/analytics-server";

// One-off checkout for the paid year-ahead reading ($15). Own or gift is the same flow:
// the buyer picks whose birthday + which year, pays, and the webhook
// (app/api/webhooks/stripe/route.ts) creates the YearReading row owned by the buyer. The
// reading itself generates lazily on first view. Requires sign-in so the reading has an
// owner and shows up in the buyer's account; the recipient of a gift needs no account,
// just the reading's share link.
export async function startYearReadingCheckout(formData: FormData) {
  const bm = Number(formData.get("bm"));
  const bd = Number(formData.get("bd"));
  const year = Number(formData.get("year"));
  const name = ((formData.get("name") as string | null) ?? "").trim().slice(0, 40);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/personal-year-card");

  if (!bm || bm < 1 || bm > 12 || !bd || bd < 1 || bd > 31 || !year || year < 1000 || year > 3000) {
    redirect("/personal-year-card");
  }

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email ?? user.id },
  });

  const customerId = await getOrCreateStripeCustomerId(profile);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // Metadata is duplicated onto the PaymentIntent too, since the webhook reads it from
  // the completed session (belt and suspenders, matching the chart gift flow).
  const meta = {
    kind: "year-reading",
    supabaseUserId: user.id,
    yrName: name,
    yrBm: String(bm),
    yrBd: String(bd),
    yrYear: String(year),
  };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_ID_YEAR_READING, quantity: 1 }],
    success_url: `${siteUrl}/personal-year-card/reading/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/personal-year-card?checkout=cancelled`,
    metadata: meta,
    payment_intent_data: { metadata: meta },
  });

  await trackFormSubmitServer("buy_year_reading", undefined, user.email);
  redirect(session.url!);
}
