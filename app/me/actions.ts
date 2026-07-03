"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { parseDateSlug } from "@/lib/today";

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

  await prisma.profile.update({
    where: { id: user.id },
    data: {
      name,
      ...(parsed ? { birthDate: new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d)) } : {}),
    },
  });

  revalidatePath("/me");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
