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

## Phase 1 — no-auth chart preview (low risk, likely most of the gain) — BUILDING 2026-10-07
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

## Phase 2 — guest checkout (after Phase 1 proves out; payment-path, higher care) — NOT YET
1. checkoutActions: allow a null user; put birthday (+name) in session metadata; Stripe collects email.
2. Webhook: when `supabaseUserId` absent, use the Stripe email to find-or-create a Supabase user
   (admin client), upsert Profile (birthDate), set the purchase flag, email a magic link to the chart.
3. Success page: guest → "Paid — we emailed you a link to your chart"; signed-in → unchanged.
Edge cases: existing-email collision → link not duplicate; webhook idempotency; Ads conversion on guest
success; RLS (admin = service-role bypass).

## Sequence
Phase 1 → deploy → watch conversion ~2 weeks → Phase 2 only if the buy-step still leaks.

## Not changing
Returning to saved charts + the almanac stays authenticated. Leak-proofing unchanged. The $15/$12
pricing-copy inconsistency (sign-in/page.tsx:29) is a separate small fix.
