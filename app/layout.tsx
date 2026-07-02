import type { Metadata } from "next";
import { Cormorant, Cormorant_SC, Lato, JetBrains_Mono } from "next/font/google";
import IconSprite from "./components/IconSprite";
import "./globals.css";
import "./card-page.css";

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
  title: "The Tarot Almanac · Find your angle on the day",
  description:
    "A perpetual tarot almanac. Every date has cards, set by tarot numerology: the collective card of the day, and the card set by your birth day.",
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
      </body>
    </html>
  );
}
