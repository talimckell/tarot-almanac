// Weekly conversion funnel: reached /chart -> clicked Buy (Stripe session) -> paid.
//
// Run as part of the weekly review. Two data sources:
//   - Postgres (DATABASE_URL, the prod DB): real signups + completed purchases.
//   - Stripe (STRIPE_LIVE_SECRET_KEY): checkout sessions started vs paid = the
//     "clicked Buy -> reached Stripe -> abandoned/paid" middle the DB can't see
//     (the DB only records COMPLETED purchases, via the webhook).
//
// The "reached /chart" top step comes from Vercel Top Pages (not an API) — pass it
// with --chart-visitors N (the /chart visitor count from that week's Top Pages CSV)
// to print the full four-step funnel.
//
// Run (DATABASE_URL from .env, live Stripe key from gitignored .env.local):
//   env $(grep -hE '^(DATABASE_URL|STRIPE_LIVE_SECRET_KEY)=' .env .env.local 2>/dev/null | xargs) \
//     node scripts/weekly-funnel.mjs --days 7 --chart-visitors 7
//   # or an explicit window: --since 2026-10-05 --until 2026-10-12
//
// Without STRIPE_LIVE_SECRET_KEY it still prints the DB half and marks the Stripe
// step unavailable. The local app .env stays on the test key on purpose; this script
// wants the LIVE key, which only you have — keep it in .env.local (gitignored).

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import Stripe from "stripe";

// Accounts to treat as owner/test, not real conversions. The owner's real test
// charges came through her own domain (tali@tarotalmanac.com) and gmail +aliases
// (talimckell+olw@gmail.com), so we normalize gmail and exclude the whole
// tarotalmanac.com domain, not just a fixed list.
const OWNER_GMAIL = new Set(["talimckell@gmail.com"]); // normalized form
const normalizeEmail = (email) => {
  const e = (email || "").trim().toLowerCase();
  const [local, domain] = e.split("@");
  if (!domain) return e;
  let l = local.split("+")[0]; // gmail ignores +tags
  if (domain === "gmail.com" || domain === "googlemail.com") l = l.replace(/\./g, ""); // and dots
  return `${l}@${domain}`;
};
const isTest = (email) => {
  const e = (email || "").toLowerCase();
  if (!e) return false;
  const domain = e.split("@")[1] || "";
  if (domain === "tarotalmanac.com") return true; // owner's own domain
  if (OWNER_GMAIL.has(normalizeEmail(e))) return true; // owner's gmail + aliases
  if (/@(example\.(com|invalid|org)|.*\.(test|invalid|local))$/.test(e)) return true;
  return e.includes("yrtest") || e.includes("+test");
};

// ---- args ----
const argv = process.argv.slice(2);
const getArg = (name) => {
  const i = argv.indexOf("--" + name);
  return i >= 0 ? argv[i + 1] : undefined;
};
const now = new Date();
const until = getArg("until") ? new Date(getArg("until") + "T23:59:59Z") : now;
const since = getArg("since")
  ? new Date(getArg("since") + "T00:00:00Z")
  : new Date(until.getTime() - Number(getArg("days") || 7) * 86400000);
const chartVisitors = getArg("chart-visitors") ? Number(getArg("chart-visitors")) : null;
const inWin = (d) => d >= since && d <= until;
const ymd = (d) => d.toISOString().slice(0, 10);

console.log(`\n=== Conversion funnel — ${ymd(since)} to ${ymd(until)} ===\n`);

// ---- DB: signups + completed purchases (ground truth, prod data) ----
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const [profiles, yearReadings, savedCharts] = await Promise.all([
  prisma.profile.findMany({ select: { email: true, createdAt: true, subscriptionStatus: true, ownChartPurchasedPaymentIntentId: true } }),
  prisma.yearReading.findMany({ select: { createdAt: true, purchasedPaymentIntentId: true, owner: { select: { email: true } } } }),
  prisma.savedChart.findMany({ select: { createdAt: true, purchasedPaymentIntentId: true, owner: { select: { email: true } } } }),
]);
await prisma.$disconnect();

const realProfiles = profiles.filter((p) => !isTest(p.email));
const dbSignups = realProfiles.filter((p) => inWin(p.createdAt)).length;
const dbChartPaid = realProfiles.filter((p) => p.ownChartPurchasedPaymentIntentId && inWin(p.createdAt)).length;
const dbSubs = realProfiles.filter((p) => ["active", "trialing", "past_due"].includes(p.subscriptionStatus || "") && inWin(p.createdAt)).length;
const dbYearPaid = yearReadings.filter((r) => r.purchasedPaymentIntentId && inWin(r.createdAt) && !isTest(r.owner?.email)).length;
const dbGiftPaid = savedCharts.filter((r) => r.purchasedPaymentIntentId && inWin(r.createdAt) && !isTest(r.owner?.email)).length;
const dbPaidTotal = dbChartPaid + dbSubs + dbYearPaid + dbGiftPaid;

console.log("DB (real, owner/test excluded):");
console.log(`  signups: ${dbSignups}`);
console.log(`  paid: ${dbPaidTotal}  (chart ${dbChartPaid} · subs ${dbSubs} · year ${dbYearPaid} · gift ${dbGiftPaid})\n`);

// ---- Stripe: sessions started vs paid (the Buy->Stripe->paid middle) ----
const liveKey = process.env.STRIPE_LIVE_SECRET_KEY
  || (process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? process.env.STRIPE_SECRET_KEY : null);
let started = null, paid = null;
if (!liveKey) {
  console.log("Stripe: SKIPPED — no STRIPE_LIVE_SECRET_KEY in env.");
  console.log("  Add it to .env.local (gitignored) to see the clicked-Buy -> reached-Stripe -> paid steps.\n");
} else {
  const stripe = new Stripe(liveKey);
  const sessions = await stripe.checkout.sessions
    .list({ created: { gte: Math.floor(since / 1000), lte: Math.floor(until / 1000) }, limit: 100 })
    .autoPagingToArray({ limit: 1000 });
  const real = sessions.filter((s) => !isTest(s.customer_details?.email));
  const byKind = {};
  // Placement attribution for own-chart Buy (chart_sticky = mobile sticky bar,
  // chart_paywall = bottom paywall), from the session metadata.location set in
  // startOwnChartCheckout. Sessions created before that field shipped read "unknown".
  const ownChartByLocation = {};
  started = real.length;
  paid = 0;
  for (const s of real) {
    const kind = s.mode === "subscription" ? "subscription" : (s.metadata?.kind || "unknown");
    byKind[kind] = byKind[kind] || { started: 0, paid: 0, open: 0, expired: 0 };
    byKind[kind].started++;
    const isPaid = s.payment_status === "paid" || s.status === "complete";
    if (isPaid) { byKind[kind].paid++; paid++; }
    else if (s.status === "open") byKind[kind].open++;
    else if (s.status === "expired") byKind[kind].expired++;
    if (kind === "own-chart") {
      const loc = s.metadata?.location || "unknown";
      ownChartByLocation[loc] = ownChartByLocation[loc] || { started: 0, paid: 0 };
      ownChartByLocation[loc].started++;
      if (isPaid) ownChartByLocation[loc].paid++;
    }
  }
  console.log(`Stripe (real, owner/test excluded): ${started} checkout sessions started, ${paid} paid`);
  for (const [k, v] of Object.entries(byKind)) {
    console.log(`  ${k}: started ${v.started} -> paid ${v.paid}  (abandoned: open ${v.open}, expired ${v.expired})`);
  }
  if (Object.keys(ownChartByLocation).length > 0) {
    console.log("  own-chart Buy by placement:");
    for (const [loc, v] of Object.entries(ownChartByLocation)) {
      console.log(`    ${loc}: started ${v.started} -> paid ${v.paid}`);
    }
  }
  console.log("");
}

// ---- The funnel ----
const pct = (a, b) => (b > 0 ? `${((a / b) * 100).toFixed(0)}%` : "—");
console.log("FUNNEL (this window):");
const chartLine = chartVisitors != null ? `${chartVisitors}` : "? (pass --chart-visitors N from Vercel Top Pages)";
console.log(`  reached /chart:   ${chartLine}`);
if (started != null) {
  console.log(`  clicked Buy:      ${started}   ${chartVisitors != null ? "(" + pct(started, chartVisitors) + " of /chart)" : ""}`);
  console.log(`  paid:             ${paid}   (${pct(paid, started)} of started)`);
} else {
  console.log(`  clicked Buy:      (needs Stripe key)`);
  console.log(`  paid (from DB):   ${dbPaidTotal}`);
}
console.log("");
