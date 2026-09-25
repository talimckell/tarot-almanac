"use server";

import { createClient } from "../../lib/supabase/server";
import { recordSignIn } from "@/lib/signInAnalytics";

// Called by /sign-in right after a successful code entry. verifyOtp runs in the
// browser, so the server never sees that sign-in happen; this reads the fresh
// session from cookies and records it. Never throws — analytics can't block sign-in.
export async function recordCodeSignIn() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) await recordSignIn(user, "code");
  } catch {
    // no-op, see above
  }
}
