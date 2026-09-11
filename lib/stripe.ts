import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

// No apiVersion pinned here — the installed SDK version (22.3.0) defaults to
// its matching pinned version (2026-06-24.dahlia) on its own.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Per PRODUCT_AND_PRICING_PLAN.md: $7/mo subscription unlocks the living
// almanac; $12 one-off buys a single giftable chart outside a subscription.
export const STRIPE_PRICE_ID_SUBSCRIPTION =
  process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SUBSCRIPTION!;
export const STRIPE_PRICE_ID_CHART = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CHART!;

// The paid year-ahead reading (one-off, giftable). Price copy lives in
// lib/yearReadingPricing.ts; this is the matching Stripe Price object's id.
export const STRIPE_PRICE_ID_YEAR_READING =
  process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_YEAR_READING!;

// Resolves (creating if needed) the Stripe Customer for a Profile, persisting the
// id immediately rather than deferring to the webhook, so a Profile<->Customer link
// exists before Checkout Session creation even if the tab closes before any webhook
// fires, and so later customer.subscription.* events (no metadata, only a customer
// id) can resolve the Profile via stripeCustomerId with no race.
export async function getOrCreateStripeCustomerId(profile: {
  id: string;
  email: string;
  stripeCustomerId: string | null;
}): Promise<string> {
  if (profile.stripeCustomerId) {
    // Verify the stored id actually resolves against the key this deployment is
    // running, not just that the field is non-null. Test and live mode are separate
    // customer spaces on the same id format, so a stored id written against the
    // wrong mode (e.g. a webhook event that fired against the shared dev database
    // before live mode was cut over) looks valid here but throws deep inside
    // Checkout Session creation instead. Self-heal by falling through to create a
    // fresh one rather than crashing the whole checkout on every attempt forever.
    try {
      const existing = await stripe.customers.retrieve(profile.stripeCustomerId);
      if (!existing.deleted) return profile.stripeCustomerId;
    } catch {
      // Not found (wrong mode, deleted, or never existed) — fall through and create.
    }
  }

  const customer = await stripe.customers.create({
    email: profile.email,
    metadata: { supabaseUserId: profile.id },
  });

  await prisma.profile.update({
    where: { id: profile.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}
