import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { yearCardIndex, bearingForBirthday } from "@/lib/yearCard";

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
  if (!supabaseUserId) return; // shouldn't happen — every session we create sets this

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
