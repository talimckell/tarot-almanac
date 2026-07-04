// Single source of truth for the canonical production origin. Keeps canonical
// tags, Open Graph URLs, the sitemap, and robots.txt on ONE host so their SEO
// signals agree. www is canonical in production: the bare apex 308-redirects to
// it, and share/OG image routes must sit on this direct-200 host because some
// link-preview crawlers (iMessage) won't follow a redirect for a preview image.
// Hardcoded on purpose: this is the stable public canonical, not the request
// host, so it must not vary by environment.
export const SITE_URL = "https://www.tarotalmanac.com";
