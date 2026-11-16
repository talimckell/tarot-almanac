import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

// Note: /today and /chart are kept CRAWLABLE on purpose even though they should
// not be indexed — they carry a `robots: noindex` meta tag, and Google can only
// honor that if it is allowed to crawl the page and read the tag. Blocking them
// here would risk the opposite (a URL indexed with no snippet). Only truly
// private / non-content routes are disallowed below.
//
// AI crawlers (GPTBot, Google-Extended, etc.) are deliberately NOT blocked: AI
// citations are a growing channel for us, so we want those bots reading the site.
// Aggressive scraper bots ignore robots.txt anyway; real bot mitigation is Vercel's
// firewall, not this file.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Private / non-content routes: the account area, auth, gift + token reading
      // links, and the internal /studio asset-rendering tooling.
      disallow: ["/api/", "/me", "/sign-in", "/auth/", "/gift/", "/studio/", "/personal-year-card/reading/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
