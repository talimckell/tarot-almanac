"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function removeChart(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in?next=/me");

  const id = formData.get("id") as string | null;
  if (!id) return;

  // deleteMany (not delete) so this is a silent no-op rather than a throw if the
  // chart isn't found or isn't owned by this user — same "treat not-yours like
  // not-found" discipline as the page's own lookup.
  await prisma.savedChart.deleteMany({ where: { id, ownerId: user.id } });

  redirect("/me");
}
