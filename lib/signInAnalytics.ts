import type { User } from "@supabase/supabase-js";
import { analytics } from "@/lib/serverAnalytics";

// A first-ever sign-in is the one that confirms the email, so email_confirmed_at
// lands at (about) the same moment. Returning accounts confirmed long ago.
const NEW_ACCOUNT_WINDOW_MS = 10 * 60 * 1000;

// One place both sign-in paths report through — the email link
// (app/auth/callback/route.ts) and the typed code (app/sign-in/actions.ts) —
// so `sign_in_completed` counts every way in, split by `method` and `is_new`.
// Pairs with the client's `sign_in_requested` for the requested → signed-in funnel.
export async function recordSignIn(user: User, method: "link" | "code") {
  const confirmedAt = user.email_confirmed_at ? Date.parse(user.email_confirmed_at) : NaN;
  const isNew = Number.isFinite(confirmedAt) && Date.now() - confirmedAt < NEW_ACCOUNT_WINDOW_MS;

  await analytics.setIdentity(user.id, { email: user.email });
  await analytics.trackEvent(
    "sign_in_completed",
    { method, is_new: isNew },
    { userId: user.id },
  );
}
