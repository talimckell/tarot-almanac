"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { parseDateSlug, isOldEnough, type YMD } from "@/lib/today";

function serverNow(): YMD {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
}

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
  const validAdultBirthday = parsed && isOldEnough(parsed.y, parsed.m, parsed.d, serverNow());

  await prisma.profile.update({
    where: { id: user.id },
    data: {
      name,
      ...(validAdultBirthday ? { birthDate: new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d)) } : {}),
    },
  });

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
  if (profile?.subscriptionStatus !== "active") return;

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

  revalidatePath("/me");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
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
  redirect("/");
}
