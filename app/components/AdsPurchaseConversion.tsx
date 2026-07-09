"use client";

import { useEffect } from "react";

// Fires a Google Ads purchase conversion once, on the post-checkout success view.
// The VALUE is resolved server-side from the real Stripe session (see app/chart/page.tsx),
// so it can't be spoofed by editing the URL. transaction_id = the Stripe session id, which
// lets Google dedupe if the success page is reloaded; a sessionStorage flag stops a refire
// inside the same tab.
//
// This only does anything once the visitor has opted in on the landing page (that's what
// loads gtag, via AdsConsent). No consent -> no gtag -> no fire, so conversion measurement
// stays under the ad-funnel opt-in.
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const LABEL = process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL;

export default function AdsPurchaseConversion({
  value,
  currency,
  transactionId,
}: {
  value: number;
  currency: string;
  transactionId: string;
}) {
  useEffect(() => {
    if (!ADS_ID || !LABEL) return;

    const key = `ta_gads_conv_${transactionId}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      /* private mode — fall through, Google still dedupes on transaction_id */
    }

    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;
    const attempt = () => {
      const gtag = (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag;
      if (typeof gtag === "function") {
        try {
          sessionStorage.setItem(key, "1");
        } catch {
          /* ignore */
        }
        gtag("event", "conversion", {
          send_to: `${ADS_ID}/${LABEL}`,
          value,
          currency,
          transaction_id: transactionId,
        });
        return;
      }
      // gtag.js may still be loading when this mounts; retry for a few seconds.
      if (tries++ < 20) timer = setTimeout(attempt, 300);
    };
    attempt();
    return () => clearTimeout(timer);
  }, [value, currency, transactionId]);

  return null;
}
