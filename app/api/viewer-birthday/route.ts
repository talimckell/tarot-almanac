// Tells a client component whether this visitor's birthday is already known —
// same resolution /today/[date]/page.tsx uses server-side (signed-in profile wins,
// else the bday cookie /today's reveal form sets) — so static pages like /bearing and
// /bearing/[slug] can personalize post-load without giving up static generation.
// Birth year is never returned (the Bearing/personal-day track excludes it by design).
import { cookies } from "next/headers";
import { getSignedInBirthday } from "@/lib/accountBirthday";
import { parseBirthday, BIRTHDAY_COOKIE, type YMD } from "@/lib/today";

function serverNow(): YMD {
  const now = new Date();
  return { y: now.getUTCFullYear(), m: now.getUTCMonth() + 1, d: now.getUTCDate() };
}

export async function GET() {
  const account = await getSignedInBirthday();
  const now = serverNow();

  let birthday = account?.birthday ?? null;
  let name = account ? account.name : null;

  if (!account) {
    const cookieStore = await cookies();
    birthday = parseBirthday(cookieStore.get(BIRTHDAY_COOKIE)?.value, now);
  }

  if (!birthday) {
    return Response.json({ known: false });
  }
  return Response.json({ known: true, bm: birthday.bm, bd: birthday.bd, name });
}
