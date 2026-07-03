import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS and can call the Admin API (auth.admin.*).
// Server-only — never import this from a Client Component. Used for account
// deletion, which needs to remove the actual auth.users row, not just the
// Profile row a normal (anon-key) client can see.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
