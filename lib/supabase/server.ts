import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// For use in Server Components, Server Actions, and Route Handlers. Next.js's
// cookies() is async (App Router), so this must be awaited at each call site —
// per the Supabase SSR docs, a fresh client is created per request, never shared.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Components can't set cookies (no response to attach them to) —
          // this throws there. Safe to ignore as long as middleware refreshes the
          // session; harmless no-op from Server Actions/Route Handlers, which can.
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // no-op, see above
          }
        },
      },
    }
  );
}
