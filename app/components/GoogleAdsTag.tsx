"use client";

import Script from "next/script";

// Loads the Google Ads tag (gtag.js + config for the AW- container). It's rendered
// only from AdsConsent's granted branch, so it never loads before the visitor opts in.
// On the landing page it captures the ad-click id (gclid) into a first-party cookie;
// on /chart it lets AdsPurchaseConversion fire the purchase event. This is the only
// thing that loads gtag now that GA4 is retired, so it self-loads the library.
export default function GoogleAdsTag({ adsId }: { adsId: string }) {
  return (
    <>
      <Script
        id="google-ads-lib"
        src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
        strategy="afterInteractive"
      />
      <Script id="google-ads-config" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${adsId}');`}
      </Script>
    </>
  );
}
