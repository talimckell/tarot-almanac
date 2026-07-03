import Stripe from "stripe";

// No apiVersion pinned here — the installed SDK version (22.3.0) defaults to
// its matching pinned version (2026-06-24.dahlia) on its own.
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Per PRODUCT_AND_PRICING_PLAN.md: $7/mo subscription unlocks the living
// almanac; $12 one-off buys a single giftable chart outside a subscription.
export const STRIPE_PRICE_ID_SUBSCRIPTION =
  process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_SUBSCRIPTION!;
export const STRIPE_PRICE_ID_CHART = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_CHART!;
