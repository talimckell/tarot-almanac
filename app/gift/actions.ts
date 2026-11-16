"use server";

import { redirect } from "next/navigation";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { stripe, STRIPE_PRICE_ID_CHART, getOrCreateStripeCustomerId } from "@/lib/stripe";
import { parseDateSlug } from "@/lib/today";
import { trackFormSubmitServer } from "@/lib/analytics-server";

// Gift-a-chart checkout for the /gift landing page. Works for BOTH guests (no account —
// the common case for a gift buyer) and signed-in users, mirroring the guest own-chart
// flow in app/chart/checkoutActions.ts. The recipient never needs an account: after
// payment the buyer lands on /gift/success with a share link to send, and the recipient
// opens /gift/[token]. The shareToken is generated HERE (not left to the SavedChart
// default) so the success page can show the link immediately, before the webhook finishes
// creating the row (app/api/webhooks/stripe/route.ts, kind "gift-chart" / "gift-chart-guest").
export async function startGiftCheckout(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const name = ((formData.get("name") as string | null) ?? "").trim().slice(0, 40);
  const birthdayRaw = ((formData.get("birthday") as string | null) ?? "").trim();
  const parsed = parseDateSlug(birthdayRaw);
  if (!name || !parsed) redirect("/gift?error=details");

  const birthDateSlug = `${parsed.y}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}`;
  const shareToken = randomUUID();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const successUrl = `${siteUrl}/gift/success?token=${shareToken}&name=${encodeURIComponent(name)}`;
  const cancelUrl = `${siteUrl}/gift?checkout=cancelled`;

  // Metadata the webhook reads to create the gift SavedChart with THIS share token.
  const base = { chartName: name, chartBirthDate: birthDateSlug, giftShareToken: shareToken };

  if (user) {
    // Signed-in buyer: the gift goes in their library, same as the /me flow, but returns
    // to the /gift success page with the send-link instead of /me.
    const profile = await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: { id: user.id, email: user.email ?? user.id },
    });
    const customerId = await getOrCreateStripeCustomerId(profile);
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      line_items: [{ price: STRIPE_PRICE_ID_CHART, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: { kind: "gift-chart", supabaseUserId: user.id, ...base },
      payment_intent_data: { metadata: { kind: "gift-chart", supabaseUserId: user.id, ...base } },
    });
    await trackFormSubmitServer("gift_chart_checkout", undefined, user.email);
    redirect(session.url!);
  }

  // Guest buyer: no account. Stripe collects their email; the webhook provisions their
  // account after payment and files the gift chart in it (so they can re-share later),
  // then emails a sign-in link. Viewing the gift needs no account on either side.
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_creation: "always",
    line_items: [{ price: STRIPE_PRICE_ID_CHART, quantity: 1 }],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: { kind: "gift-chart-guest", ...base },
    payment_intent_data: { metadata: { kind: "gift-chart-guest", ...base } },
  });
  await trackFormSubmitServer("gift_chart_checkout_guest", undefined, undefined);
  redirect(session.url!);
}
