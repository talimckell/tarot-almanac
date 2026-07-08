"use client";

import { sendGAEvent } from "@next/third-parties/google";
import { track } from "@vercel/analytics";

// One place to emit form-submit analytics so every form fires the same event
// name with a consistent `form_name` param — in both GA4 and Vercel Web
// Analytics you get a single `form_submit` report broken down by form.
//
// GA only loads after the visitor accepts the consent banner (see
// app/components/CookieConsent.tsx); before that, sendGAEvent just queues into
// the dataLayer and never sends, so calling this is always safe. Vercel's
// track() is cookieless and no-ops off-Vercel / on the Hobby plan, so it's
// equally safe to call unconditionally. Custom events surface in the dashboard
// only on Pro/Enterprise.
export function trackFormSubmit(
  formName: string,
  params?: Record<string, string | number | boolean>,
) {
  sendGAEvent("event", "form_submit", { form_name: formName, ...params });
  track("form_submit", { form_name: formName, ...params });
}
