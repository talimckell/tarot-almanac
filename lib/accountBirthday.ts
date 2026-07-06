import { prisma } from "./prisma";
import { createClient } from "./supabase/server";
import { isSubscribed } from "./compAccounts";
import type { Birthday } from "./today";

export interface SignedInBirthday {
  birthday: Birthday | null; // null if signed in but hasn't added a birthday yet
  name: string | null;
  subscribed: boolean;
}

// Null means signed out entirely — callers should fall back to the anonymous
// cookie/query-param flow. Non-null (even with birthday: null) means signed in,
// so the account's own state should win over any cookie, never the other way
// around — a signed-in account's /today must never show a stray ?b= link's data.
export async function getSignedInBirthday(): Promise<SignedInBirthday | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await prisma.profile.findUnique({ where: { id: user.id } });
  if (!profile) return null;

  return {
    birthday: profile.birthDate
      ? { bm: profile.birthDate.getUTCMonth() + 1, bd: profile.birthDate.getUTCDate() }
      : null,
    name: profile.name,
    subscribed: isSubscribed(profile),
  };
}
