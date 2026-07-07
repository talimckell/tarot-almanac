"use client";

import { sendGAEvent } from "@next/third-parties/google";

// One place to emit GA4 events so every form fires the same event name with a
// consistent `form_name` param — in GA4 you get a single `form_submit` report
// broken down by form. GA only loads after the visitor accepts the consent
// banner (see app/components/CookieConsent.tsx); before that, sendGAEvent just
// queues into the dataLayer and never sends, so calling this is always safe.
export function trackFormSubmit(
  formName: string,
  params?: Record<string, string | number | boolean>,
) {
  sendGAEvent("event", "form_submit", { form_name: formName, ...params });
}
