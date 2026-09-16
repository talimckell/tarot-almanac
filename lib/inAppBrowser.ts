// In-app browser (webview) detection, from the user-agent string alone. Pure, no
// browser or Node deps, so it can be unit-checked with a plain script.
//
// Why this exists: Stripe Checkout degrades badly inside the browsers embedded in
// Instagram, Facebook, TikTok and friends. Apple Pay and Google Pay are never offered
// there, the hop out to checkout.stripe.com is unreliable, and some of these webviews
// lose the return trip after payment. Detecting the case lets the paywall offer a way
// out to the real browser before anyone spends a minute typing a card number.

export type InAppPlatform = "ios" | "android" | "other";

export interface InAppBrowserInfo {
  inApp: boolean;
  /** The host app's display name when the UA names one, else null. */
  app: string | null;
  platform: InAppPlatform;
}

// Checked in order, so more specific tokens come first: Messenger's UA carries
// Facebook's FBAN token too, and would otherwise report as Facebook.
const KNOWN_APPS: ReadonlyArray<readonly [RegExp, string]> = [
  [/FBAN\/Messenger|Messenger(ForiOS|LiteForiOS)|MESSENGER/i, "Messenger"],
  [/Instagram/i, "Instagram"],
  [/Barcelona/i, "Threads"],
  [/FBAN|FBAV|FB_IAB|FB4A|FBIOS/i, "Facebook"],
  [/BytedanceWebview|musical_ly|TikTok|Bytedance/i, "TikTok"],
  [/Snapchat/i, "Snapchat"],
  [/MicroMessenger/i, "WeChat"],
  [/\bLine\//i, "LINE"],
  [/LinkedInApp|LinkedIn/i, "LinkedIn"],
  [/Pinterest/i, "Pinterest"],
  [/\bTwitter\b|TwitterAndroid/i, "X"],
  [/Reddit/i, "Reddit"],
  [/\bGSA\//i, "the Google app"],
];

function platformOf(ua: string): InAppPlatform {
  if (/iPhone|iPad|iPod/i.test(ua)) return "ios";
  if (/Android/i.test(ua)) return "android";
  return "other";
}

// Generic webview markers, for the apps we don't enumerate above.
// Android stamps every WebView UA with a `wv` token. iOS stamps nothing, but a real
// mobile Safari always carries a `Safari/` token and a WKWebView never does.
function isGenericWebview(ua: string, platform: InAppPlatform): boolean {
  if (platform === "android") return /;\s*wv[;)]/i.test(ua);
  if (platform === "ios") return /Mobile\//i.test(ua) && !/Safari\//i.test(ua);
  return false;
}

export function detectInAppBrowser(ua: string | null | undefined): InAppBrowserInfo {
  const platform = platformOf(ua ?? "");
  // Desktop is out of scope: the failure modes here are all mobile webview behavior,
  // and desktop Electron apps (Slack, Discord) open real browsers for external links.
  if (!ua || platform === "other") return { inApp: false, app: null, platform };

  // A named token is trusted on its own, without the generic test below: several of
  // these apps (the Google app, LINE) ship a UA that still carries a `Safari/` token,
  // so the generic iOS test would clear them even though they are WKWebViews.
  const named = KNOWN_APPS.find(([re]) => re.test(ua));
  if (named) return { inApp: true, app: named[1], platform };

  return { inApp: isGenericWebview(ua, platform), app: null, platform };
}
