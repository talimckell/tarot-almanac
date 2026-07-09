"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import {
  stripe,
  STRIPE_PRICE_ID_SUBSCRIPTION,
  STRIPE_PRICE_ID_CHART,
  getOrCreateStripeCustomerId,
} from "@/lib/stripe";
import { trackFormSubmitServer } from "@/lib/analytics-server";

// Starts Stripe Checkout for the $7/mo subscription (the "Subscribe" button on
// /chart's paywall). Redirects the browser to Stripe's hosted page; Stripe redirects
// back to success_url/cancel_url on completion/abandon. The actual unlock happens
// via the webhook (app/api/webhooks/stripe/route.ts), not this action.
export async function startSubscriptionCheckout(formData?: FormData) {
  // The Subscribe button appears in three places (chart paywall, chart upsell,
  // /me library); each form passes a hidden `location` so the dashboard can show
  // which placement drives subscription intent.
  const location = (formData?.get("location") as string | null) ?? "unknown";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/chart");

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email ?? user.id },
  });

  const customerId = await getOrCreateStripeCustomerId(profile);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_ID_SUBSCRIPTION, quantity: 1 }],
    // session_id lets /chart verify the real amount (for the Google Ads conversion) and
    // dedupe on reload. Stripe substitutes the literal {CHECKOUT_SESSION_ID} template.
    success_url: `${siteUrl}/chart?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/chart?checkout=cancelled`,
    metadata: { supabaseUserId: user.id },
    // subscription_data.metadata: the Subscription object itself (not just the
    // Checkout Session) needs supabaseUserId too, since customer.subscription.*
    // events carry the Subscription, not the Session.
    subscription_data: { metadata: { supabaseUserId: user.id } },
  });

  await trackFormSubmitServer("subscribe_checkout", { location }, user.email);
  redirect(session.url!);
}

// Starts Stripe Checkout for the $12 one-off that unlocks the viewer's OWN natal
// chart (the "Buy my chart" button on /chart's paywall). No chart name/birthdate
// metadata needed — the webhook just sets Profile.ownChartPurchasedPaymentIntentId
// for this supabaseUserId.
export async function startOwnChartCheckout() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/chart");

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email ?? user.id },
  });

  const customerId = await getOrCreateStripeCustomerId(profile);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_ID_CHART, quantity: 1 }],
    // session_id lets /chart verify the real amount (for the Google Ads conversion) and
    // dedupe on reload. Stripe substitutes the literal {CHECKOUT_SESSION_ID} template.
    success_url: `${siteUrl}/chart?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/chart?checkout=cancelled`,
    metadata: { kind: "own-chart", supabaseUserId: user.id },
    payment_intent_data: { metadata: { kind: "own-chart", supabaseUserId: user.id } },
  });

  await trackFormSubmitServer("buy_own_chart", undefined, user.email);
  redirect(session.url!);
}
