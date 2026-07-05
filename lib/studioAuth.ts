import { createClient } from "./supabase/server";

// The batch content-studio tools (app/studio/*) generate marketing assets, not user data,
// but they're still locked to the site owner specifically rather than just "any signed-in
// account" — there's no admin role in the schema, so this is a direct email check against
// the one account that should ever reach them.
export const STUDIO_OWNER_EMAIL = "talimckell@gmail.com";

export async function requireStudioOwner(): Promise<{ id: string; email: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  if (user.email.toLowerCase() !== STUDIO_OWNER_EMAIL.toLowerCase()) return null;
  return { id: user.id, email: user.email };
}
