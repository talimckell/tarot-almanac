# Conversion funnel fix — spec (2026-10-07)

## The problem (confirmed in code)
A cold visitor must clear two walls before seeing any value:
1. **Magic-link account** — `/chart` redirects logged-out visitors to `/sign-in`
   (app/chart/page.tsx:48; app/chart/checkoutActions.ts:28,67). Leave site → check email → return.
2. **Birthday on a separate page** — even signed in, if `profile.birthDate` is empty, `/chart` sends
   them to `/me` to add it (app/chart/page.tsx:82–97), then back.

Only after both do they see their chart or the $12 offer. That is the funnel leak. Symptom match:
the free calculator (`birth_card_finder`, no auth) gets used ~14×/week; the paid chart (auth-first)
converts ~once. Same audience, opposite wall, opposite result.

## Goal
Value first, account last: (1) show the chart preview from a birthday with no login; (2) let them buy
as a guest, create the account after payment.

## Enablers already in the codebase
- `computeNatalChart(by, bm, bd)` is a pure function — preview needs no DB/user (lib/natalChart.ts).
- Birthday cookie (proxy.ts) + the free calculator already capture a birthday with no auth.
- Supabase admin client (lib/supabase/admin.ts, service-role) — can create/link users server-side.
- Webhook already provisions a profile + sets `ownChartPurchasedPaymentIntentId`
  (app/api/webhooks/stripe/route.ts); today it needs a pre-existing `supabaseUserId`.

## Phase 1 — no-auth chart preview (low risk, likely most of the gain) — SHIPPED 2026-10-07 (live)
1. `/chart`: for a logged-out visitor, don't redirect. Resolve birthday from `?by&bm&bd`, else the
   birthday cookie, else a small inline "enter your birthday" field. Compute the chart, render the
   LOCKED preview (Bearing named, six positions locked) with reading text STILL server-gated (never
   shipped to the browser — identical leak-proofing to today).
2. Show the paywall box to guests too. In Phase 1 the buy button may still route through sign-in —
   acceptable, because the wall is now hit AFTER seeing the chart (motivated), not before (blind).
3. Deep-link into it from where the birthday already exists (free calculator result, /birthday/[slug],
   /bearing) carrying `?by&bm&bd`.
4. Signed-in users with a saved birthday: unchanged.

Risk: low — no payment/auth changes; preview is deterministic. Only care: keep reading text
server-gated for guests (don't ship paid content).

## Phase 2 — guest checkout for the $12 own chart — SHIPPED 2026-10-07 (live, test-verified)
Scope: the $12 own-chart only. Subscription still requires sign-in first (by decision).
1. checkoutActions.startOwnChartCheckout: guest branch — takes the previewed birth date (hidden form
   field `d`), creates a Stripe session with `customer_creation: "always"` + `guestBirthDate` metadata,
   no `supabaseUserId`. Signed-in path unchanged.
2. Webhook handleGuestOwnChart: when `supabaseUserId` absent on an own-chart session, find-or-create a
   Supabase user from the Stripe-collected email (admin client; existing Profile email = link, else
   `createUser`), upsert Profile (birthDate + purchase flag), email a magic link (`signInWithOtp` →
   /auth/callback?next=/chart). Idempotent: re-delivery finds the purchase already recorded and no-ops.
3. Success page: guest → "Payment received — check your inbox"; signed-in → unchanged.
Edge cases handled: existing-email collision → link not duplicate; webhook idempotency; RLS (admin =
service-role bypass). Note: existing-user-without-Profile lookup uses single-page `listUsers` — fine at
scale, revisit if the user base grows large.

**Verification (2026-10-07):** full loop run end-to-end in TEST mode (stripe listen + dev server + a
4242 guest purchase via the in-app browser). Confirmed: guest session created (`cs_test_…`), webhook
`[200]` no errors, Profile provisioned with the right birthDate + purchase flag (checked against the
real Supabase), magic-link email sent, guest success page shown. Test account cleaned up. Merged to
main (07fdc33) and deployed green to production. NOT re-tested: the final magic-link click → unlocked
chart (logic sound — Profile carries the purchase flag, Phase 1 verified the unlocked render) and
live-mode email deliverability (Resend SMTP already live). First real guest purchase is the ultimate
live proof.

Known-separate issue surfaced during this: Vercel **Preview** deploys fail (`prisma generate` can't
resolve `DIRECT_URL`) because Prisma env vars are only set on Production, not Preview. Add them to the
Preview environment if branch previews should build. Non-urgent; production unaffected.

## Sequence
Phase 1 → deploy → watch conversion ~2 weeks → Phase 2 only if the buy-step still leaks.

## Not changing
Returning to saved charts + the almanac stays authenticated. Leak-proofing unchanged. The $15/$12
pricing-copy inconsistency (sign-in/page.tsx:29) is a separate small fix.

## Year-reading guest checkout — SHIPPED 2026-10-07 (live, test-verified)
The $15 year reading carried the same sign-in-before-payment wall the chart used to have, and the
Sep baseline showed 0 buyers reaching the buy page in three weeks. With the year-ahead-reading season
opening, applied the chart's guest-checkout pattern to it now.
1. `startYearReadingCheckout` (app/personal-year-card/checkoutActions.ts): guest branch creates a
   Stripe session with `customer_creation: "always"` and no `supabaseUserId`; signed-in path
   unchanged. New guest event `buy_year_reading_guest`.
2. Webhook `handleGuestYearReading` (app/api/webhooks/stripe/route.ts): find-or-create the Supabase
   user from the Stripe email, ensure a Profile (the reading's required owner FK), create the
   `YearReading` row, email a sign-in link (`next=/me`). Idempotent on the unique `paymentIntentId`.
3. No account needed to VIEW: the reading is served by its `shareToken`
   (`/personal-year-card/reading/[token]`, public, `notFound()` only), so the existing success page
   (session → payment intent → token) lands the guest straight in it. The sign-in link is only so it
   also shows in their `/me` later.
4. `/continue` no longer redirects guests to sign-in (neutral copy). Calculator + continue show a
   "secure checkout, no account needed to buy or read it" line.

**Verification (2026-10-07):** full loop run end-to-end in TEST mode (stripe listen + dev server + a
4242 guest purchase via the in-app browser). Confirmed: guest buy button → Stripe Checkout (no
sign-in), webhook `[200]` no errors, `YearReading` provisioned (name/year/card-index correct, status
reached `ready`) owned by a Profile with the exact Stripe-collected email, success page redirected the
guest to the share-token reading, reading rendered with no account. Test account + reading cleaned up.
Local-only note: `stripe listen`'s signing secret differs from `.env`'s (the dashboard endpoint's), so
the test used a gitignored `.env.local` override of `STRIPE_WEBHOOK_SECRET`, removed afterward.

## Other funnel fixes shipped 2026-10-07 (from the funnel review)
- **Birthday pages** (biggest traffic source): a real `ChartCtaButton` (on-dark variant) in the
  "Go deeper" box, replacing a small text link → /chart.
- **Birth-card page**: the "100% spot on" reader testimonial at the free→paid chart upsell.
- **Weekly dashboard** extended to a multi-funnel view (chart + year-reading funnels + free-tool
  engagement): https://claude.ai/artifact/9EM1eiEnAf86zjmoRbc2eF (pinned).
