"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { parseDateSlug, isOldEnough } from "@/lib/today";
import { viewerNow } from "@/lib/viewerNow";

// /today's "Add your birthday" reveal form submits as a plain GET (?b=) for
// anonymous visitors, which proxy.ts turns into the birthday cookie. But a
// signed-in account never reads that cookie or param — today/page.tsx takes the
// birthday only from the Profile row — so for a signed-in visitor the GET reveal
// was a silent no-op: submit, reload, and the empty form just reappears. This is
// the signed-in write path: persist the birthday straight to the Profile, same
// 16+ rule and same UTC shape as /me's updateProfile.
export async function saveBirthdayFromToday(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const parsed = parseDateSlug((formData.get("b") as string | null)?.trim() || "");
  if (!parsed || !isOldEnough(parsed.y, parsed.m, parsed.d, await viewerNow())) return;

  const name = (formData.get("n") as string | null)?.trim() || null;

  await prisma.profile.update({
    where: { id: user.id },
    data: {
      birthDate: new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d)),
      ...(name ? { name } : {}),
    },
  });

  // The reveal form lives on both the homepage and the /today tree, and the saved
  // birthday changes what every dated reading shows — revalidate both so the
  // reveal replaces the empty form wherever it was submitted from.
  revalidatePath("/today", "layout");
  revalidatePath("/");
}
