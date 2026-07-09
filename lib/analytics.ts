"use client";

import { track } from "@vercel/analytics";

// One place to emit form-submit analytics so every form fires the same event
// name with a consistent `form_name` param, giving a single `form_submit` report
// broken down by form. Product analytics runs on Vercel Web Analytics, which is
// cookieless and no-ops off-Vercel / on the Hobby plan, so this is always safe to
// call unconditionally. Custom events surface in the dashboard only on Pro/Enterprise.
export function trackFormSubmit(
  formName: string,
  params?: Record<string, string | number | boolean>,
) {
  track("form_submit", { form_name: formName, ...params });
}
