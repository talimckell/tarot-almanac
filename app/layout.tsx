import type { Metadata, Viewport } from "next";
import { Cormorant, Cormorant_SC, Lato, JetBrains_Mono } from "next/font/google";
import VercelAnalytics from "./components/VercelAnalytics";
import IconSprite from "./components/IconSprite";
import CookieConsent from "./components/CookieConsent";
import { SITE_URL } from "../lib/site";
import "./globals.css";
import "./card-page.css";

// Set once, from the environment, so GA is available only when configured (never in
// local dev unless you opt in). Add NEXT_PUBLIC_GA_ID in Vercel to enable it. Even
// when set, GA loads only after the visitor accepts in the consent banner.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const cormorant = Cormorant({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const cormorantSC = Cormorant_SC({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-cormorant-sc",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lato",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
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
        {children}
        {GA_ID ? <CookieConsent gaId={GA_ID} /> : null}
        <VercelAnalytics />
      </body>
    </html>
  );
}
