import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

// Where the magic-link email points. Exchanges the one-time code for a
// session (written to cookies by the server client) and redirects onward.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/today";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/sign-in`);
}
