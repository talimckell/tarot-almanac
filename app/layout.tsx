import type { Metadata, Viewport } from "next";
import { Cormorant, Cormorant_SC, Lato, JetBrains_Mono } from "next/font/google";
import VercelAnalytics from "./components/VercelAnalytics";
import IconSprite from "./components/IconSprite";
import TimezoneSync from "./components/TimezoneSync";
import { SITE_URL } from "../lib/site";
import "./globals.css";
import "./card-page.css";

// Product analytics is Vercel Web Analytics (cookieless, no consent banner needed).
// The only cookie-setting tracker is Google Ads conversion measurement, which is
// scoped to the ad funnel via <AdsConsent> on /tarot-birth-chart and /chart — not
// loaded site-wide from here.

const cormorant = Cormorant({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

// Only Cormorant (above) is preloaded: it's the hero/headline face and the LCP
// element on the homepage. The three below are secondary — small-caps labels,
// body copy, and mono indices — so we let them load at normal priority instead
// of contending on the critical path. `display: "swap"` + Next's auto size-adjusted
// fallbacks mean they swap in with no layout shift.
const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  preload: false,
  variable: "--font-cormorant-sc",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
  variable: "--font-lato",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  preload: false,
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "The Tarot Almanac · Find your angle on the day",
  description:
    "A perpetual tarot almanac. Every date has cards, set by tarot numerology: the collective card of the day, and the card set by your birth day.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

// Explicit viewport, matching Next's default. Stated for clarity so the mobile
// scaling contract is visible in one place rather than left implicit.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${cormorantSC.variable} ${lato.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <IconSprite />
        <TimezoneSync />
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
