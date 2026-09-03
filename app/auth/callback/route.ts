import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { analytics } from "@/lib/serverAnalytics";

// Where the magic-link email points. Exchanges the one-time code for a
// session (written to cookies by the server client) and redirects onward.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/today";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // This is the only place the app server-side learns who just signed
      // in — magic-link auth has no client-side sign-in call to identify
      // from. Fires on every successful sign-in, not just first-ever (we
      // don't attempt to distinguish new vs. returning here); safe to call
      // repeatedly per HeyCatch's docs.
      if (data.user) {
        await analytics.setIdentity(data.user.id, { email: data.user.email });
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}
