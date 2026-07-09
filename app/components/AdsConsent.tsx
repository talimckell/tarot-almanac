"use client";

import { useEffect, useState } from "react";
import GoogleAdsTag from "./GoogleAdsTag";
import styles from "./AdsConsent.module.css";

// Consent gate for Google Ads conversion measurement — the only tracker we run that
// sets cookies (Vercel Web Analytics is cookieless and needs no consent). Two jobs in
// one component, split by the `showBanner` prop:
//
//   • The ask (showBanner): rendered only on the ad landing page, where ad traffic
//     enters. That's the one place we prompt.
//   • The loader (always): when consent is stored as granted, it loads the Ads tag.
//     Rendered on the landing page (to capture the gclid on opt-in) and on /chart
//     (so the purchase conversion can fire). Once accepted on the landing page, the
//     choice persists in a cookie, so /chart loads the tag without asking again.
//
// The whole thing is dormant until NEXT_PUBLIC_GOOGLE_ADS_ID is set, so it ships safe.
const ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
const COOKIE = "ta_ads_consent";
const ONE_YEAR = 60 * 60 * 24 * 365;

type Consent = "granted" | "denied";

function readConsent(): Consent | null {
  const match = document.cookie.match(/(?:^|;\s*)ta_ads_consent=(granted|denied)/);
  return match ? (match[1] as Consent) : null;
}

function writeConsent(value: Consent) {
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

export default function AdsConsent({ showBanner = false }: { showBanner?: boolean }) {
  // undefined = not read yet (server render + first paint): show neither tag nor banner,
  // so there's no hydration flash and nothing loads before we've read the stored choice.
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);

  useEffect(() => {
    setConsent(readConsent());
  }, []);

  if (!ADS_ID) return null;

  function decide(value: Consent) {
    writeConsent(value);
    setConsent(value);
  }

  return (
    <>
      {consent === "granted" ? <GoogleAdsTag adsId={ADS_ID} /> : null}
      {showBanner && consent === null ? (
        <div
          className={styles.banner}
          role="dialog"
          aria-label="Ad measurement consent"
          aria-live="polite"
        >
          <p className={styles.text}>
            May we measure ad performance? If you came from an ad, this sets one Google cookie so we can
            tell whether it led to a purchase. We don&rsquo;t sell your data, and the site works exactly
            the same if you say no.{" "}
            <a href="/privacy" className={styles.link}>
              Privacy policy
            </a>
            .
          </p>
          <div className={styles.actions}>
            <button type="button" className={styles.decline} onClick={() => decide("denied")}>
              No thanks
            </button>
            <button type="button" className={styles.accept} onClick={() => decide("granted")}>
              Allow
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
