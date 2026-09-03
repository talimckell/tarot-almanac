// lib/organizationSchema.ts — the site's one Organization entity, plus a helper for
// paid-offering Service schema. Before this file, every page with Article schema
// repeated a bare `{ "@type": "Organization", name: "The Tarot Almanac" }` stub with no
// url/logo/sameAs — invisible to anything trying to answer "what is this company".
//
// organizationLd is the full node, rendered once on the homepage. organizationRef is
// the `@id` pointer every other page's author/publisher/provider field uses instead of
// repeating the stub, so an AI assistant or search engine following the graph lands on
// one consistent entity.
import { SITE_URL } from "./site";

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "The Tarot Almanac",
  url: SITE_URL,
  logo: `${SITE_URL}/icon-512.png`,
  sameAs: [
    "https://bsky.app/profile/tarotalmanac.bsky.social",
    "https://www.pinterest.com/tarotalmanac/",
    "https://tarotalmanac.substack.com/",
  ],
};

export const organizationRef = { "@id": ORGANIZATION_ID };

// A paid offering (the $7/mo subscription, the $12 chart, the $15 year-ahead reading).
// `Service` rather than `Product`: these are personalized digital readings, not shippable
// SKUs, and Product schema carries availability/review expectations we don't have data
// for. `billingIncrement` is set only for the recurring subscription; one-off prices skip
// it and get a plain Offer.
export function serviceLd({
  name,
  description,
  url,
  price,
  billingIncrement,
}: {
  name: string;
  description: string;
  url: string;
  price: number;
  billingIncrement?: "P1M";
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url,
    provider: organizationRef,
    offers: {
      "@type": "Offer",
      price: String(price),
      priceCurrency: "USD",
      url,
      ...(billingIncrement
        ? {
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: String(price),
              priceCurrency: "USD",
              billingIncrement: 1,
              billingDuration: billingIncrement,
              unitText: "MONTH",
            },
          }
        : {}),
    },
  };
}
