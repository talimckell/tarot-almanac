import { track } from "@vercel/analytics/server";
import { STUDIO_OWNER_EMAIL } from "@/lib/studioAuth";

// Server-side twin of trackFormSubmit (lib/analytics.ts) for forms that submit
// via a server action rather than a client handler — checkout, profile, chart,
// and account actions. Same event name + form_name shape, so both client and
// server form submissions land in one `form_submit` report in the Vercel
// dashboard, broken down by form.
//
// actorEmail is the signed-in user's email when known: the owner's own
// submissions are dropped here, the server-side equivalent of the browser
// `va-disable` flag that excludes owner client events (see VercelAnalytics.tsx).
//
// Wrapped in try/catch and awaited before any redirect(): analytics must never
// throw out of a real action or block the redirect to Stripe. Off-Vercel and on
// the Hobby plan this is a no-op. (If Deployment Protection is ever enabled,
// set VERCEL_AUTOMATION_BYPASS_SECRET so these server beacons aren't 401'd.)
export async function trackFormSubmitServer(
  formName: string,
  params?: Record<string, string | number | boolean | null>,
  actorEmail?: string | null,
) {
  if (actorEmail && actorEmail.toLowerCase() === STUDIO_OWNER_EMAIL.toLowerCase()) {
    return;
  }
  try {
    await track("form_submit", { form_name: formName, ...params });
  } catch {
    // swallow — a failed analytics beacon must not break the submission
  }
}
