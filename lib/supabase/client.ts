import { createBrowserClient } from "@supabase/ssr";

// For use in Client Components. Safe to call repeatedly — createBrowserClient
// memoizes into a singleton by default (isSingleton defaults to true).
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
