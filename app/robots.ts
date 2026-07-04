import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";

// Note: /today and /chart are kept CRAWLABLE on purpose even though they should
// not be indexed — they carry a `robots: noindex` meta tag, and Google can only
// honor that if it is allowed to crawl the page and read the tag. Blocking them
// here would risk the opposite (a URL indexed with no snippet). Only truly
// private / non-content routes are disallowed below.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/me", "/sign-in", "/auth/", "/gift/"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
