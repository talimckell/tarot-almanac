// Comped ("complimentary") accounts — friends gifted full access without paying.
//
// Access is granted purely by email: any address in COMP_EMAILS is treated as an
// active subscriber everywhere the app gates on subscription (see isSubscribed).
// There's no Stripe object and no DB field behind it, so a comped friend never
// collides with the webhook that writes profile.subscriptionStatus — that field
// stays Stripe-only and truthful, while comp status lives here.
//
// Mirrors the STUDIO_OWNER_EMAIL pattern in lib/studioAuth.ts: a hardcoded list,
// compared case-insensitively. To gift someone: add their email below (case doesn't
// matter) and redeploy. They only need to have signed in once so their Profile row
// exists — the unlock takes effect the next time they load a gated page. To revoke,
// remove the email and redeploy.
export const COMP_EMAILS: string[] = [
  "shannon.bowen@gmail.com", // Shannon Bowen
  "rycsummers@gmail.com", // Ryann Summers
  "juhawes@gmail.com", // Julia Hawes
  "shannon.michelle.ritchie@gmail.com", // Shannon Ritchie
  "mariaruatto@gmail.com", // Maria Ruatto
  "abigail.sylvester@gmail.com", // Abigail Sylvester
  "taynardo@mac.com", // Taylor Hughes
  "bholt1104@gmail.com", // Blake Holt
  "tali@tarotalmanac.com", // Tali
];

const COMP_SET = new Set(COMP_EMAILS.map((e) => e.trim().toLowerCase()));

export function isCompedEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return COMP_SET.has(email.toLowerCase());
}

// The single source of truth for "does this account get full/subscriber access."
// Real subscribers (Stripe status "active") OR comped friends. Every gate that used
// to inline `profile.subscriptionStatus === "active"` now goes through here so comp
// access and the paying path can never drift apart.
export function isSubscribed(profile: {
  email: string;
  subscriptionStatus: string | null;
}): boolean {
  return profile.subscriptionStatus === "active" || isCompedEmail(profile.email);
}
