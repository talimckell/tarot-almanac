"use client";

import { useState, useSyncExternalStore } from "react";
import { detectInAppBrowser, type InAppBrowserInfo } from "@/lib/inAppBrowser";
import styles from "./InAppBrowserNotice.module.css";

// Shown above a paywall when the page is running inside an app's embedded browser.
// Stripe Checkout never offers Apple Pay or Google Pay there, the hop out to
// checkout.stripe.com is unreliable, and some of these webviews lose the return trip
// after payment. The checkout buttons still work, so this only offers a way out
// rather than blocking the sale.

// The detection is a client-only read that never changes for the life of the page, so
// it goes through useSyncExternalStore rather than an effect: the server snapshot is
// null (nothing renders, nothing to mismatch on hydration) and the client snapshot is
// computed once and cached. getSnapshot has to be referentially stable across calls,
// hence the module-level cache rather than a fresh object each time.
let snapshot: InAppBrowserInfo | null | undefined;

function getSnapshot(): InAppBrowserInfo | null {
  if (snapshot === undefined) {
    // An installed PWA has no Safari token either and pays perfectly well, so clear
    // the home-screen case before trusting the user agent.
    const standalone =
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true ||
      window.matchMedia("(display-mode: standalone)").matches;
    const detected = detectInAppBrowser(window.navigator.userAgent);
    snapshot = !standalone && detected.inApp ? detected : null;
  }
  return snapshot;
}

const subscribe = () => () => {};
const getServerSnapshot = (): InAppBrowserInfo | null => null;

export default function InAppBrowserNotice() {
  const info = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [copied, setCopied] = useState(false);
  const [manualUrl, setManualUrl] = useState<string | null>(null);

  if (!info) return null;

  const where = info.app ? `${info.app}'s built-in browser` : "this app's built-in browser";
  const realBrowser = info.platform === "android" ? "Chrome" : "Safari";

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 4000);
    } catch {
      // Clipboard permission denied or unavailable, which some webviews do: fall back
      // to showing the URL in a field it can be selected out of by hand.
      setManualUrl(window.location.href);
    }
  }

  return (
    <div className={styles.notice}>
      <span className={styles.eyebrow}>Before you pay</span>
      <p className={styles.body}>
        Apple Pay and Google Pay aren&rsquo;t offered in {where}, and the trip back from Stripe
        sometimes gets lost. Open this page in {realBrowser} first.
      </p>
      {info.platform === "android" ? (
        <AndroidEscape />
      ) : (
        <>
          {manualUrl ? (
            <input
              className={styles.manual}
              readOnly
              value={manualUrl}
              aria-label="Page link, copy this"
              onFocus={(e) => e.currentTarget.select()}
            />
          ) : (
            <button type="button" className={styles.action} onClick={copyLink}>
              {copied ? "Link copied" : "Copy link"}
            </button>
          )}
          <p className={styles.hint}>
            {manualUrl ? "Copy this link and open it in Safari." : "Then paste it into Safari."}{" "}
            Some apps also have an &ldquo;Open in Safari&rdquo; item in the corner menu.
          </p>
        </>
      )}
    </div>
  );
}

// Android is the one platform with a real escape hatch: an intent:// URL hands the
// current page to Chrome directly. `browser_fallback_url` keeps the tap from dead-ending
// when Chrome isn't installed. Reading `window` during render is safe here because this
// only ever renders after the client snapshot above has resolved.
function AndroidEscape() {
  const { host, pathname, search, href } = window.location;
  const fallback = encodeURIComponent(href);
  const intent = `intent://${host}${pathname}${search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
  return (
    <a className={styles.action} href={intent}>
      Open in Chrome
    </a>
  );
}
