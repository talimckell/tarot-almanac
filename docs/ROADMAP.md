# The Tarot Almanac — Roadmap

Living roadmap. **This file is the source of truth.** A rendered view is published as
an Artifact (link below) for easy reading.

When something comes up in a working session, say **"add it to the roadmap"** and it
gets appended here, then the Artifact is refreshed.

**Artifact view:** https://claude.ai/code/artifact/bd532d6a-d42b-417a-8b3b-11ce3204993d
(redeploy to this same URL when the file changes — pass it as the Artifact `url`)

## Structure
Items are grouped into three workstream lanes — **Product & Monetization**, **Writing &
Readings**, **Social & Scheduling** (currently paused) — plus a **Shipped** log. A **[Soon]** tag marks the
next-up items. Priority chips (🔴 blocker · 🟠 important · 🟡 polish) apply to engineering
items where they carry weight. Heavier items keep the full format: **Problem / root
cause**, **When it happens**, **Planned fix**, **Effort**.

---

## Product & Monetization

### 🟠 Stripe Checkout in in-app webviews — return path still unverified
**Added:** 2026-07-06 · **Narrowed:** 2026-09-16

The detect-and-nudge half shipped 2026-09-16 (see Shipped). What's left is the part that
needs hardware: confirming what actually happens to the **return redirect** after a real
payment made from inside a real in-app browser, on both iOS and Android. If the return
does get lost, the fix is probably a polling/recovery step on the success page rather than
anything in Checkout itself, since the webhook already does the real unlock.

**Effort.** An hour or two, but it needs a phone and a real test purchase.

### Paid compatibility reading
Paid product paired with the birth-card compatibility post (below): free post = the concept,
paid = the woven compatibility reading.

---

## Writing & Readings

### Birth-card compatibility post
Compatibility-by-birth-card post; pairs with the paid compatibility reading above.

---

## Social & Scheduling — paused

**Paused 2026-08-05.** Not doing socials for a while. The infrastructure is all built and
sitting ready when this picks back up: 16 Pinterest boards (see the [pinterest-boards-complete]
memory), the Bluesky campaign studios (Collective / Birthday Bearings / Reclaimed Reversals),
and the Remotion daily-Shorts pipeline. Ideas banked for when it resumes: finish the Pinterest
scheduling passes (14 boards still unscheduled), a Bluesky celebrity-birthday campaign, and a
Bluesky this-day-in-history campaign.

---

## Shipped

### 2026-09-16 — in-app webview nudge on every paywall
- **`lib/inAppBrowser.ts`**, a pure user-agent read that names the host app (Instagram,
  Facebook, Messenger, TikTok, Snapchat, the Google app, X, LinkedIn, Threads, WeChat,
  LINE, Pinterest, Reddit) and falls back to the generic markers: Android's `wv` token,
  and an iOS UA carrying `Mobile/` with no `Safari/`. Checked against a 22-case table of
  real UA strings, including the browsers that must NOT trigger it (Safari, CriOS, FxiOS,
  Chrome/Samsung/Firefox on Android, desktop).
- **`<InAppBrowserNotice />`** above all four paywalls (`/chart` ×2, `/me`,
  `/personal-year-card` + its continue step). Says why paying there is a bad idea, then
  offers the way out: an `intent://` link that hands the page straight to Chrome on
  Android, a copy-link button on iOS (degrading to a selectable URL field when the
  webview denies clipboard access). Checkout buttons still work, so nothing is blocked.
- **Detection runs client-side** through `useSyncExternalStore` with a null server
  snapshot, so no page loses its caching and there's no hydration mismatch. An installed
  PWA is cleared via `navigator.standalone`, since it has no Safari token either and pays
  fine.
- Still open: what happens to the **return redirect** after a real payment from inside a
  real in-app browser. That needs a phone (see the narrowed item above).

### 2026-09-16 — Timezone Option B (device-accurate zone)
- **`viewerNow()` now prefers a `tz` cookie** written by a new `<TimezoneSync />` client
  component (the browser's own `Intl` zone) over Vercel's IP-derived
  `x-vercel-ip-timezone`, falling back to UTC when neither is present or valid. Fixes
  "today" being wrong for anyone on a VPN or cellular routing that geolocates badly.
- Verified live: a `tz=Pacific/Kiritimati` request reads a day ahead of a bare one, and
  invalid or malformed cookie values fall through to the header/UTC without erroring.
- Closes the last 🟡 item in Product & Monetization.

### 2026-08-05 — personal month explainer + 2027 year-ahead posts
- **Personal month explainer post** written and live — the myth-bust angle (numerology stops at
  a digit; here you get a whole Major Arcana card) feeding the `/personal-month-card` calculator.
  Closes the last open item on that funnel.
- **2027 year-ahead post** written and live (the dormant blog scaffold is now a real post).

### 2026-07-22 — personal month card funnel (calculator + 22 SEO pages)
- **`/personal-month-card` calculator hub + 22 evergreen `[slug]` pages**, mirroring the year-card
  funnel. Birthday + month/year in → the Major Arcana card for that month out (`personalMonth` =
  `mod22(BM+BD+sumDigits(Y)+M)`, birth year excluded), same every time. Reuses `personal-year-card`
  styles wholesale; new files: `lib/monthCard.ts`, `content/month-cards.json` (FAQ/SEO copy only),
  `app/personal-month-card/{page,PersonalMonthCardCalculator,[slug]/page}.tsx`.
- **No duplicated reading copy.** The 22 per-Major month meanings already existed (authored, in-voice)
  in each card JSON at `positionReadings.positions.ongoingPersonalMonth.body`; the hub reads them
  server-side via `getPositionReading` and hands them to the client calculator as props. Those stay
  DRAFT-flagged — worth a review pass before heavy promotion, but they're live on these pages now.
- **SEO wedge:** targets the fused long-tail (`personal month tarot card`, `tarot card for this month
  by birthday`) that bridges the numerology and tarot clusters no competitor spans. FAQPage JSON-LD,
  canonicals, sitemap (+23 URLs), footer + reciprocal year-card cross-links all wired.
- **Paid CTA points at the subscription** (`/me#subscribe`), not a new one-off — the living almanac
  already generates every month, so zero net-new checkout/AI code.
- Verified in the local preview: March 15 → August 2026 resolves to Temperance (steps forward from
  the Lovers year card) with the authored body; typecheck clean, no console errors.

### 2026-07-22 — August collective month reading live + share-with-friends push done
- **August month reading published on Substack.** The August collective month reading is live
  (Substack-only per the monthly-reading pattern, links out to `/month` + `/today`).
- **Share-with-friends outreach complete.** The direct-outreach / word-of-mouth push to the
  intended set of friends is done.

### 2026-07-14 — blog: arcana-stages post live + posts 4-5 social sets scheduled
- **"The Major Arcana in Three Stages" published.** The Initiation / Testing / Reckoning post
  (formerly a dormant scaffold) is live — `content/blog-07-major-arcana-three-stages.md`,
  ~1,350 words in voice, with the three-stage wheel and Fool-threshold diagrams.
- **Blog 4 & 5 social sets scheduled.** All 5 published posts now have their social sets created
  and scheduled (posts 2-3 scheduled 2026-07-08; 4 & 5 assets created 2026-07-08, scheduling
  passes now complete).

### 2026-07-14 — homepage value ladder + year-card paid tier
- **Homepage reordered into the value ladder.** `app/page.tsx` now reads Free → giftable
  $12 readings → $7/mo almanac, promotes the birth chart to its own band that links
  `/tarot-birth-chart` (the homepage never linked it before), and surfaces the year card as a
  free hook. Closes the 🟠 homepage value-prop reorder item.
- **Paid year-ahead report shipped (year-card Phase 2).** The ~$12 AI-woven year-ahead reading
  now sits on top of the free `/personal-year-card` calculator (Phase 1 shipped 2026-07-07).
  Live: `/personal-year-card/reading` + `/reading/success` + token delivery at `/reading/[token]`,
  the Satori cycle-ring share image (`/wheel/image`), `startYearReadingCheckout` +
  `generateYearReading` (`personal-year-card/checkoutActions.ts`), and a `/studio/year-reading`
  tool. Bearing×Year spine, gift flow, and voice guardrails per the original scope. Subsumes
  the separate "Paid year-ahead report (new SKU)" and "Your Bearing in a given year" items.

### 2026-07-14 — sign-in code path (kills the magic-link cross-browser trap)
- **6-digit code alongside the magic link.** The PKCE magic link only completes when the
  same browser both requests and opens it, so in-app-browser and cross-device users were
  silently stranded (the old 🔴 blocker). `/sign-in`'s "Check your email" screen now also
  shows a code field; `verifyOtp` runs on the browser client, so the session is created in
  the page the user is already on — the `code_verifier` never has to match. Magic link
  untouched (no regression). `app/sign-in/page.tsx`.
- **Supabase Magic Link template** now renders `{{ .Token }}` (branded, in voice + tokens)
  so the code actually reaches the inbox. OTP length set to 6.
- **Field is length-agnostic (6–10).** First cut hard-capped at 6 while the project was
  issuing 8-digit codes, so verification always failed; the field now accepts any valid
  Supabase OTP length. Also fixed the misleading "Open it on this device" copy.

### 2026-07-06 — minor mobile polish (audit follow-ups)
- **Hero `90vh` → `svh`.** `.hero` in `app/globals.css` now sets `min-height: 90vh` as a
  fallback then `90svh`, so mobile browser toolbars no longer push the hero below the fold.
- **Birthday select placeholder graying.** `app/components/BirthdayFields.tsx` mutes each
  Month/Day/Year select to `--warm-stone` while empty and drops the override once a value is
  picked (CSS `--ink` wins), so iOS no longer renders the placeholders like real values. One
  shared component, so it applies everywhere birthdays are entered.
- **Explicit `viewport` export.** `app/layout.tsx` now exports `viewport` (`device-width`,
  `initialScale: 1`), matching Next's default but stated for clarity.

### 2026-07-06 — mobile hardening
- **Birthday entry: date picker → Month/Day/Year selects (site-wide).** Native
  `<input type="date">` showed a month/year-only picker with no day in Gmail's in-app
  browser. Replaced with explicit M/D/Y selects across the reveal form, /me, both lookup
  fields, and both chart-creation fields.
- **Signed-in birthday save from /today.** The /today form was a silent no-op for signed-in
  accounts (submitted `?b=`, ignored). Added the `saveBirthdayFromToday` server action.
- **Timezone-aware "today" (Option A).** Added `lib/viewerNow.ts` reading Vercel's
  `x-vercel-ip-timezone` header (UTC fallback); centralized ~8 duplicated helpers. Sitemap
  stays UTC.
- **iOS input-zoom fix.** Form controls were 14–15px, triggering iOS focus zoom. One
  mobile-only rule bumps them to 16px at ≤640px; desktop unchanged.
- **Hamburger tap target.** Was ~30px; now a 44px box with the icon centered.
