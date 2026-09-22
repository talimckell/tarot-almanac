// Daily keep-alive for the Supabase project (scheduled in vercel.json). Supabase's free
// tier pauses projects after ~7 days of low activity, which would take down sign-in and
// every Prisma-backed page. This touches both the Postgres database and Supabase's own
// API so there's recorded activity on each side.
//
// Vercel sends `Authorization: Bearer $CRON_SECRET` on cron invocations when CRON_SECRET
// is set; if it is, anyone else gets a 401.
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result: { db: boolean; auth: boolean } = { db: false, auth: false };

  try {
    await prisma.$queryRaw`SELECT 1`;
    result.db = true;
  } catch (err) {
    console.error("keep-alive: database ping failed", err);
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/health`, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! },
      cache: "no-store",
    });
    result.auth = res.ok;
  } catch (err) {
    console.error("keep-alive: Supabase auth ping failed", err);
  }

  return Response.json(result, { status: result.db || result.auth ? 200 : 500 });
}
