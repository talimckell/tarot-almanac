"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import styles from "./CookieConsent.module.css";

// Opt-in analytics gate. GA never loads until the visitor explicitly allows it,
// so the default state is consent-free for everyone (which is what the EU/UK and
// California expect) without needing to geolocate anyone. The choice persists in a
// first-party cookie; clearing cookies re-asks.
const COOKIE = "ta_analytics_consent";
const ONE_YEAR = 60 * 60 * 24 * 365;

type Consent = "granted" | "denied";

function readConsent(): Consent | null {
  const match = document.cookie.match(/(?:^|;\s*)ta_analytics_consent=(granted|denied)/);
  return match ? (match[1] as Consent) : null;
}

function writeConsent(value: Consent) {
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${ONE_YEAR}; SameSite=Lax`;
}

export default function CookieConsent({ gaId }: { gaId: string }) {
  // undefined = not read yet (server render + first paint), so we show neither GA
  // nor the banner until the effect runs — no hydration flash, no GA before consent.
  // null = read, but no choice made yet -> show the banner.
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);

  useEffect(() => {
    setConsent(readConsent());
  }, []);

  function decide(value: Consent) {
    writeConsent(value);
    setConsent(value);
  }

  return (
    <>
      {consent === "granted" ? <GoogleAnalytics gaId={gaId} /> : null}
      {consent === null ? (
        <div
          className={styles.banner}
          role="dialog"
          aria-label="Analytics cookie consent"
          aria-live="polite"
        >
          <p className={styles.text}>
            May we turn on Google Analytics? It sets one cookie so we can see which readings get
            opened. No ads, no selling your data, and the site works exactly the same if you say no.{" "}
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
              Allow analytics
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
