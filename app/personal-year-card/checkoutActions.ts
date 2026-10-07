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
// (app/api/webhooks/stripe/route.ts) creates the YearReading row. The reading itself
// generates lazily on first view and is viewable by its share token, so no account is
// needed to buy OR to read it. A guest buys without signing in; the webhook provisions an
// account from the Stripe-collected email and emails a sign-in link so the reading also
// shows up in their account later. (Matches the chart's guest-checkout flow.)
export async function startYearReadingCheckout(formData: FormData) {
  const bm = Number(formData.get("bm"));
  const bd = Number(formData.get("bd"));
  const year = Number(formData.get("year"));
  const name = ((formData.get("name") as string | null) ?? "").trim().slice(0, 40);

  if (!bm || bm < 1 || bm > 12 || !bd || bd < 1 || bd > 31 || !year || year < 1000 || year > 3000) {
    redirect("/personal-year-card");
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  // Metadata is duplicated onto the PaymentIntent too, since the webhook reads it from
  // the completed session (belt and suspenders, matching the chart flow).
  const meta = {
    kind: "year-reading",
    yrName: name,
    yrBm: String(bm),
    yrBd: String(bd),
    yrYear: String(year),
  };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // GUEST: no sign-in wall. customer_creation collects the email; the webhook provisions the
  // account and creates the reading; the success page lands the buyer straight in it by share
  // token (the same link a gift buyer would send on). No supabaseUserId → webhook = guest.
  if (!user) {
    const guestSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      line_items: [{ price: STRIPE_PRICE_ID_YEAR_READING, quantity: 1 }],
      success_url: `${siteUrl}/personal-year-card/reading/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/personal-year-card?checkout=cancelled`,
      metadata: meta,
      payment_intent_data: { metadata: meta },
    });
    await trackFormSubmitServer("buy_year_reading_guest", undefined, undefined);
    redirect(guestSession.url!);
  }

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email ?? user.id },
  });

  const customerId = await getOrCreateStripeCustomerId(profile);
  const signedMeta = { ...meta, supabaseUserId: user.id };

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_ID_YEAR_READING, quantity: 1 }],
    success_url: `${siteUrl}/personal-year-card/reading/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/personal-year-card?checkout=cancelled`,
    metadata: signedMeta,
    payment_intent_data: { metadata: signedMeta },
  });

  await trackFormSubmitServer("buy_year_reading", undefined, user.email);
  redirect(session.url!);
}
