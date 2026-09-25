import { NextRequest, NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createClient } from "../../../lib/supabase/server";
import { analytics } from "@/lib/serverAnalytics";

const OTP_TYPES: EmailOtpType[] = ["email", "signup", "magiclink", "invite", "recovery", "email_change"];

// Only ever redirect to a path on this site. The email templates pass
// `next={{ .RedirectTo }}`, which is the full emailRedirectTo URL — i.e. this
// same route with its own `?next=` — so unwrap one level of that.
function safeNext(raw: string | null, origin: string): string {
  if (!raw) return "/today";
  try {
    const url = new URL(raw, origin);
    if (url.origin !== origin) return "/today";
    if (url.pathname === "/auth/callback") return safeNext(url.searchParams.get("next"), origin);
    // Bare site root means Supabase fell back to the Site URL; use the default.
    if (url.pathname === "/" && !url.search) return "/today";
    return `${url.pathname}${url.search}`;
  } catch {
    return "/today";
  }
}

// Where the sign-in / sign-up emails point. Two ways in:
// - token_hash (current templates): verified server-side with no PKCE
//   code_verifier, so the link works in any browser, including in-app
//   browsers and a different device from the one that asked for it.
// - code (the old {{ .ConfirmationURL }} links, still valid for emails
//   already sitting in inboxes): PKCE exchange, same-browser only.
// Either way the session lands in cookies and the account is signed in,
// whether this was their first email (signup) or a returning sign-in.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = safeNext(searchParams.get("next"), origin);

  const supabase = await createClient();
  let user = null;
  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (!error) user = data.user;
  } else if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) user = data.user;
  }

  if (user) {
    // This is the only place the app server-side learns who just signed
    // in via a link (code-entry sign-ins on /sign-in don't pass through here). Fires on
    // every successful sign-in, not just first-ever; safe to call
    // repeatedly per HeyCatch's docs.
    await analytics.setIdentity(user.id, { email: user.email });
    return NextResponse.redirect(`${origin}${next}`);
  }

  // A used or expired link (email scanners sometimes open links before the
  // person does). If a session already exists, carry on; otherwise the code
  // in the email still works on /sign-in.
  const { data: { user: existing } } = await supabase.auth.getUser();
  if (existing) return NextResponse.redirect(`${origin}${next}`);
  return NextResponse.redirect(`${origin}/sign-in`);
}
