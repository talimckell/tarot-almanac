import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { yearCardIndex, bearingForBirthday } from "@/lib/yearCard";
import { analytics } from "@/lib/serverAnalytics";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Stripe webhook receiver. Raw body must be read via req.text() (NOT req.json())
// because signature verification (constructEvent) needs the exact original bytes —
// re-serializing parsed JSON would produce different bytes and fail verification.
export async function POST(req: Request) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${(err as Error).message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await handleSubscriptionChange(event.data.object as Stripe.Subscription);
      break;
    default:
      // Unhandled event types are fine to no-op — Stripe just wants a 2xx.
      break;
  }

  return new Response("ok", { status: 200 });
}

// Branches on session.mode first (subscription vs one-off payment), then on
// metadata.kind for the two "payment"-mode flows, since mode alone can't tell
// "own-chart" apart from "gift-chart".
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const supabaseUserId = session.metadata?.supabaseUserId;

  // Guest one-off: no supabaseUserId because the buyer had no account. Provision from the
  // Stripe-collected email, then email a sign-in link. Two guest products: the $12 own-chart
  // and the $15 year reading. Every other flow still requires a known user (only reachable
  // while signed in), so they no-op here.
  if (!supabaseUserId) {
    if (session.mode === "payment") {
      if (session.metadata?.kind === "own-chart") {
        await handleGuestOwnChart(session);
      } else if (session.metadata?.kind === "year-reading") {
        await handleGuestYearReading(session);
      }
    }
    return;
  }

  if (session.mode === "subscription") {
    // The session payload only has the subscription id; status/period-end need
    // their own fetch of the full Subscription object.
    const subscriptionId = session.subscription as string;
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await prisma.profile.update({
      where: { id: supabaseUserId },
      data: {
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
        subscriptionCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
      },
    });

    // HeyCatch: the backend is the only side that actually knows a paid
    // subscription started — send it here, not from the client.
    await analytics.trackEvent("subscription_started", {}, { userId: supabaseUserId });
    return;
  }

  // mode === "payment": one-off $12 purchase, distinguished by metadata.kind
  const kind = session.metadata?.kind;
  const paymentIntentId = session.payment_intent as string;

  if (kind === "own-chart") {
    await prisma.profile.update({
      where: { id: supabaseUserId },
      data: { ownChartPurchasedPaymentIntentId: paymentIntentId },
    });
    return;
  }

  if (kind === "gift-chart") {
    const chartName = session.metadata?.chartName;
    const chartBirthDate = session.metadata?.chartBirthDate; // "YYYY-MM-DD"
    if (!chartName || !chartBirthDate) return; // malformed metadata — nothing safe to do

    const [y, m, d] = chartBirthDate.split("-").map(Number);

    // Idempotent by paymentIntentId (unique in the schema), not a plain create — safe
    // against duplicate webhook delivery without a separate processed-events table.
    await prisma.savedChart.upsert({
      where: { purchasedPaymentIntentId: paymentIntentId },
      update: {},
      create: {
        ownerId: supabaseUserId,
        name: chartName,
        birthDate: new Date(Date.UTC(y, m - 1, d)),
        purchasedPaymentIntentId: paymentIntentId,
      },
    });
    return;
  }

  if (kind === "year-reading") {
    const name = session.metadata?.yrName?.trim() || "you";
    const bm = Number(session.metadata?.yrBm);
    const bd = Number(session.metadata?.yrBd);
    const year = Number(session.metadata?.yrYear);
    if (!bm || !bd || !year) return; // malformed metadata — nothing safe to do

    // Idempotent by paymentIntentId (unique). The woven reading generates lazily on
    // first view of the reading page; here we only create the pending row.
    await prisma.yearReading.upsert({
      where: { purchasedPaymentIntentId: paymentIntentId },
      update: {},
      create: {
        ownerId: supabaseUserId,
        name,
        birthMonth: bm,
        birthDay: bd,
        readingYear: year,
        yearCardIndex: yearCardIndex(year, bm, bd),
        bearingIndex: bearingForBirthday(bm, bd),
        purchasedPaymentIntentId: paymentIntentId,
        status: "pending",
      },
    });
  }
}

// Guest $12 own-chart provisioning (buyer had no account). Find-or-create the Supabase
// user from the Stripe-collected email, save their birth date + the purchase on their
// Profile, then email a sign-in link so they can read the chart they bought. Idempotent:
// a re-delivered event finds the purchase already recorded and no-ops (no second account,
// no second email).
async function handleGuestOwnChart(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email?.toLowerCase();
  const guestBirthDate = session.metadata?.guestBirthDate; // "YYYY-MM-DD"
  const paymentIntentId = session.payment_intent as string;
  if (!email || !guestBirthDate || !paymentIntentId) return; // malformed — nothing safe to do

  const admin = createAdminClient();

  // Resolve the user: existing customer (by Profile email) or a freshly created auth user.
  let userId: string | null = null;
  const existing = await prisma.profile.findFirst({ where: { email } });
  if (existing) {
    if (existing.ownChartPurchasedPaymentIntentId === paymentIntentId) return; // already processed
    userId = existing.id;
  } else {
    const created = await admin.auth.admin.createUser({ email, email_confirm: true });
    if (created.data.user) {
      userId = created.data.user.id;
    } else {
      // Likely already registered without a Profile row — look the user up by email.
      const { data: list } = await admin.auth.admin.listUsers();
      userId = list?.users.find((u) => (u.email ?? "").toLowerCase() === email)?.id ?? null;
    }
  }
  if (!userId) return; // couldn't resolve a user — bail safely (Stripe will retry)

  const [y, m, d] = guestBirthDate.split("-").map(Number);
  await prisma.profile.upsert({
    where: { id: userId },
    update: {
      ownChartPurchasedPaymentIntentId: paymentIntentId,
      // Don't clobber a returning user's existing birthday.
      ...(existing?.birthDate ? {} : { birthDate: new Date(Date.UTC(y, m - 1, d)) }),
    },
    create: {
      id: userId,
      email,
      birthDate: new Date(Date.UTC(y, m - 1, d)),
      ownChartPurchasedPaymentIntentId: paymentIntentId,
    },
  });

  // Email a branded sign-in link (same OTP path as the sign-in page; the user exists now)
  // so they can reach their unlocked chart. The anon-key client is enough to send it.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const anon = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  await anon.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/chart` },
  });

  await analytics.trackEvent("guest_chart_purchased", {}, { userId });
}

// Guest $15 year-reading provisioning (buyer had no account). Find-or-create the Supabase
// user from the Stripe-collected email, create the YearReading row owned by them, then email
// a sign-in link so it shows up in their account. Viewing needs no account: the success page
// lands the buyer on the reading's share-token URL immediately. Idempotent: a re-delivered
// event finds the reading already created (unique paymentIntentId) and no-ops.
async function handleGuestYearReading(session: Stripe.Checkout.Session) {
  const email = session.customer_details?.email?.toLowerCase();
  const paymentIntentId = session.payment_intent as string;
  const name = session.metadata?.yrName?.trim() || "you";
  const bm = Number(session.metadata?.yrBm);
  const bd = Number(session.metadata?.yrBd);
  const year = Number(session.metadata?.yrYear);
  if (!email || !bm || !bd || !year || !paymentIntentId) return; // malformed — nothing safe to do

  // Already processed? (re-delivered webhook) — bail before creating a second account/email.
  const existingReading = await prisma.yearReading.findUnique({
    where: { purchasedPaymentIntentId: paymentIntentId },
  });
  if (existingReading) return;

  // Resolve the user: existing customer (by Profile email) or a freshly created auth user.
  const admin = createAdminClient();
  let userId: string | null = null;
  const existingProfile = await prisma.profile.findFirst({ where: { email } });
  if (existingProfile) {
    userId = existingProfile.id;
  } else {
    const created = await admin.auth.admin.createUser({ email, email_confirm: true });
    if (created.data.user) {
      userId = created.data.user.id;
    } else {
      // Likely already registered without a Profile row — look the user up by email.
      const { data: list } = await admin.auth.admin.listUsers();
      userId = list?.users.find((u) => (u.email ?? "").toLowerCase() === email)?.id ?? null;
    }
  }
  if (!userId) return; // couldn't resolve a user — bail safely (Stripe will retry)

  // YearReading.ownerId is a required FK to Profile; createUser makes an auth user, not a
  // Profile, so ensure the row exists first. Don't clobber a returning user's profile.
  await prisma.profile.upsert({
    where: { id: userId },
    update: {},
    create: { id: userId, email },
  });

  // Idempotent by paymentIntentId (unique). Mirrors the signed-in year-reading branch; the
  // woven reading generates lazily on first view of the reading page.
  await prisma.yearReading.upsert({
    where: { purchasedPaymentIntentId: paymentIntentId },
    update: {},
    create: {
      ownerId: userId,
      name,
      birthMonth: bm,
      birthDay: bd,
      readingYear: year,
      yearCardIndex: yearCardIndex(year, bm, bd),
      bearingIndex: bearingForBirthday(bm, bd),
      purchasedPaymentIntentId: paymentIntentId,
      status: "pending",
    },
  });

  // Email a sign-in link so the buyer can find the reading in their account later. Viewing
  // doesn't require it — the success page already lands them on the share-token reading.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const anon = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  await anon.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?next=/me` },
  });

  await analytics.trackEvent("guest_year_reading_purchased", {}, { userId });
}

// customer.subscription.updated/.deleted carry no metadata, only a customer id, so
// the Profile is resolved via stripeCustomerId (already @unique, persisted eagerly at
// checkout-creation time). .deleted needs no separate branch — status becomes
// "canceled", which flows through this same update and naturally re-locks /chart.
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const profile = await prisma.profile.findUnique({ where: { stripeCustomerId: customerId } });
  if (!profile) return; // no matching Profile — nothing to update, safe no-op

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      stripeSubscriptionId: subscription.id,
      subscriptionStatus: subscription.status,
      subscriptionCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
    },
  });
}
