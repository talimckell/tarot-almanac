"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, STRIPE_PRICE_ID_CHART, getOrCreateStripeCustomerId } from "@/lib/stripe";
import { parseDateSlug, isOldEnough } from "@/lib/today";
import { isSubscribed } from "@/lib/compAccounts";
import { viewerNow } from "@/lib/viewerNow";
import { trackFormSubmitServer } from "@/lib/analytics-server";

// Closes the birthday-persistence gap: signed-in accounts previously had no way to
// save a birthday to the Profile row, so /today's cookie-based birthday never
// carried over into a real account. This is that write path (name is along for
// the ride, for the "Welcome back, {name}" greeting).
export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/me");

  const name = (formData.get("name") as string | null)?.trim() || null;
  const birthdayRaw = (formData.get("birthday") as string | null)?.trim() || "";
  const parsed = parseDateSlug(birthdayRaw);
  // This is the account holder's own birthday (the Terms of Service's 16+ account
  // minimum), unlike createChart below, which enters someone else's — an under-16
  // date here is rejected the same way the rest of the site treats one: as if it
  // were never entered.
  const validAdultBirthday = parsed && isOldEnough(parsed.y, parsed.m, parsed.d, await viewerNow());

  await prisma.profile.update({
    where: { id: user.id },
    data: {
      name,
      ...(validAdultBirthday ? { birthDate: new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d)) } : {}),
    },
  });

  await trackFormSubmitServer("update_profile", undefined, user.email);
  revalidatePath("/me");
}

// Charts are included with an active subscription (per the pricing plan — the $12
// one-off path needs real Stripe Checkout, not built yet, so this only handles the
// subscription case for now). Re-checks the subscription server-side rather than
// trusting that the form was only ever rendered to a subscriber.
export async function createChart(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/me");

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  // Must mirror MeView's own gate (isSubscribed), which shows this form to comped
  // friends too — not just Stripe "active". Inlining subscriptionStatus here let the
  // form render for a comped account while every submission silently no-op'd.
  if (!profile || !isSubscribed(profile)) return;

  const name = (formData.get("name") as string | null)?.trim();
  const birthdayRaw = (formData.get("birthday") as string | null)?.trim() || "";
  const parsed = parseDateSlug(birthdayRaw);
  if (!name || !parsed) return;

  await prisma.savedChart.create({
    data: {
      ownerId: user.id,
      name,
      birthDate: new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d)),
    },
  });

  await trackFormSubmitServer("create_chart", undefined, user.email);
  revalidatePath("/me");
}

// Non-subscribers can still buy a single gift/library chart for $12 without
// subscribing (per the pricing plan: charts are "sold as the $12 one-off, or
// makeable freely within a subscription"). Unlike createChart above, this can't
// write the SavedChart row yet — payment hasn't happened — so name/birthDate are
// carried through Checkout Session metadata and the row is created by the webhook
// (app/api/webhooks/stripe/route.ts) once checkout.session.completed fires.
export async function createGiftChartCheckout(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/me");

  const name = (formData.get("name") as string | null)?.trim();
  const birthdayRaw = (formData.get("birthday") as string | null)?.trim() || "";
  const parsed = parseDateSlug(birthdayRaw);
  if (!name || !parsed) return;

  const profile = await prisma.profile.upsert({
    where: { id: user.id },
    update: {},
    create: { id: user.id, email: user.email ?? user.id },
  });

  const customerId = await getOrCreateStripeCustomerId(profile);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
  const birthDateSlug = `${parsed.y}-${String(parsed.m).padStart(2, "0")}-${String(parsed.d).padStart(2, "0")}`;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    line_items: [{ price: STRIPE_PRICE_ID_CHART, quantity: 1 }],
    success_url: `${siteUrl}/me?checkout=success`,
    cancel_url: `${siteUrl}/me?checkout=cancelled`,
    metadata: {
      kind: "gift-chart",
      supabaseUserId: user.id,
      chartName: name,
      chartBirthDate: birthDateSlug,
    },
    payment_intent_data: {
      metadata: { kind: "gift-chart", supabaseUserId: user.id, chartName: name, chartBirthDate: birthDateSlug },
    },
  });

  await trackFormSubmitServer("gift_chart_checkout", undefined, user.email);
  redirect(session.url!);
}

export async function signOutAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  await supabase.auth.signOut();
  await trackFormSubmitServer("sign_out", undefined, user?.email);
  redirect("/");
}

// Full account deletion, per the Privacy Policy's "in-app delete option": removes
// the Profile row (SavedChart rows cascade with it, per the schema's onDelete:
// Cascade) and the underlying Supabase auth identity itself, not just app data —
// otherwise signing back in with the same email would silently recreate a blank
// Profile (see /me's upsert) rather than actually ending the account.
export async function deleteAccountAction() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/me");

  await prisma.profile.delete({ where: { id: user.id } });

  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(user.id);

  await supabase.auth.signOut();
  await trackFormSubmitServer("delete_account", undefined, user.email);
  redirect("/");
}
