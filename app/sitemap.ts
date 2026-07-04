import type { MetadataRoute } from "next";
import { SITE_URL } from "../lib/site";
import { getAllCards } from "../lib/cards";
import { MAJOR_SLUGS } from "../lib/almanac";
import { BLOG_POSTS } from "../lib/blog";
import { allBirthdays, birthdaySlug } from "../lib/birthday";
import { addDays, formatDateSlug, type YMD } from "../lib/today";

// Regenerate daily so the trailing date window keeps a fresh "today". A day of
// staleness on a sitemap is harmless.
export const revalidate = 86400;

// How many days of dated /today pages to seed into the sitemap. The Earlier/Later
// stepper links every adjacent date, so Google can crawl deeper history from any
// seeded page — this window just bounds crawl focus on the freshest, most-searched
// dates. Raise it to list more history directly. Future dates are never listed
// (they're gated + noindex).
const DATE_SITEMAP_DAYS_BACK = 365;

function serverNow(): YMD {
  const n = new Date();
  return { y: n.getUTCFullYear(), m: n.getUTCMonth() + 1, d: n.getUTCDate() };
}

// Only public, indexable routes belong here. Deliberately excluded:
//   /today, /chart landings (robots noindex), future /today/[date] (gated + noindex),
//   /chart/[id], /me, /sign-in, /auth, /gift/[token], /api (private or non-content).
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/how-it-works",
    "/tarot",
    "/bearing",
    "/about",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  // 78 card detail pages — the meaning library.
  const cardEntries: MetadataRoute.Sitemap = getAllCards().map((card) => ({
    url: `${SITE_URL}/tarot/${card.slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // 22 Bearing pages.
  const bearingEntries: MetadataRoute.Sitemap = MAJOR_SLUGS.map((slug) => ({
    url: `${SITE_URL}/bearing/${slug}`,
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  // 366 birthday pages (one per calendar month+day, Feb 29 included).
  const birthdayEntries: MetadataRoute.Sitemap = allBirthdays().map(({ m, d }) => ({
    url: `${SITE_URL}/birthday/${birthdaySlug(m, d)}`,
    changeFrequency: "yearly",
    priority: 0.5,
  }));

  // Trailing window of dated collective-reading pages (public, indexable). A past
  // date's reading is fixed, so changefreq is "yearly"; today's can still resolve
  // fresh personal state, so it gets a slightly higher priority.
  const now = serverNow();
  const dateEntries: MetadataRoute.Sitemap = [];
  for (let i = 0; i < DATE_SITEMAP_DAYS_BACK; i++) {
    const day = addDays(now, -i);
    dateEntries.push({
      url: `${SITE_URL}/today/${formatDateSlug(day)}`,
      changeFrequency: "yearly",
      priority: i === 0 ? 0.6 : 0.4,
    });
  }

  const blogEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [
    ...staticEntries,
    ...cardEntries,
    ...bearingEntries,
    ...birthdayEntries,
    ...dateEntries,
    ...blogEntries,
  ];
}
