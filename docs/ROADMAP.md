# The Tarot Almanac — Roadmap

Living roadmap. **This file is the source of truth.** A rendered view is published as
an Artifact (link below) for easy reading.

When something comes up in a working session, say **"add it to the roadmap"** and it
gets appended here, then the Artifact is refreshed.

**Artifact view:** https://claude.ai/code/artifact/bd532d6a-d42b-417a-8b3b-11ce3204993d
(redeploy to this same URL when the file changes — pass it as the Artifact `url`)

## Structure
Items are grouped into three workstream lanes — **Product & Monetization**, **Writing &
Readings**, **Social & Scheduling** — plus a **Shipped** log. A **[Soon]** tag marks the
next-up items. Priority chips (🔴 blocker · 🟠 important · 🟡 polish) apply to engineering
items where they carry weight. Heavier items keep the full format: **Problem / root
cause**, **When it happens**, **Planned fix**, **Effort**.

---

## Product & Monetization

### 🟠 Stripe Checkout unreliable in in-app webviews
**Added:** 2026-07-06

**Problem / root cause.** In an in-app browser, the redirect to Stripe Checkout is
unreliable, Apple Pay / Google Pay aren't offered at all, and some webviews mishandle the
return redirect after payment.

**When it happens.** Any checkout started from inside an in-app browser on mobile. Lower
frequency than the auth issue, but real revenue.

**Planned fix.** Detect in-app webviews and nudge "open in Safari/Chrome to pay," make card
entry the obvious fallback, and verify the return path in a real in-app browser.

**Effort.** ~Half a day; needs manual testing in real in-app browsers.

### Paid compatibility reading
Paid product paired with the birth-card compatibility post (below): free post = the concept,
paid = the woven compatibility reading.

### 🟡 Timezone Option B — device-accurate zone
"Today" localizes via Vercel's IP timezone (shipped). IP can be wrong on VPNs / some
cellular routing. Fix: client writes the device's `Intl` zone to a cookie; `viewerNow()`
prefers cookie → header → UTC. ~1–2 hours, optional.

---

## Writing & Readings

### Personal month post `[Soon]`
The `/personal-month-card` calculator + 22 SEO pages shipped 2026-07-22 (see Shipped). What's left
is the optional blog-10 explainer post feeding the calculator: the myth-bust angle (numerology stops
at a digit; here you get a whole Major Arcana card), owner-authored, linking into the tool.

### 2027 year-ahead post
The 2027 year-ahead post (a dormant blog scaffold exists).

### Birth-card compatibility post
Compatibility-by-birth-card post; pairs with the paid compatibility reading above.

### "Every U.S. President's Bearing" — original-data link-bait post
**Added:** 2026-07-13

**What it is.** A data post that runs the Bearing formula (`mod22(bm+bd)`, birth-year
excluded) over every U.S. president's birthday and lays out the result: each president, their
birthday, their Bearing, and the pattern across all 46 (which Majors cluster, which never
appear, any runs of shared Bearings). The deterministic system makes this a factual, citable
dataset no shuffle-based tarot site can produce, which is exactly what earns links.

**Why it's worth doing.** It's the clearest first play for the authority strategy: a piece
built to attract backlinks and brand searches rather than to convert. History/trivia and
astrology/tarot writers link to novel datasets as a source. Reuses the existing Bearing engine
and glyph system, so the build is mostly assembling and presenting data we already compute.
Each president's row links to its `/bearing/[slug]` and `/birthday/[md]` page, so it also feeds
the internal-linking web the overhaul just built.

**Notes / open.** Verify each birthday against a reliable source before publishing (a wrong
birthday yields a wrong Bearing, and the whole appeal is that it's checkable). Bearing excludes
birth year, so no need to resolve disputed birth-year cases. Could extend later to a small
family of these ("every president / every state's founding date / notable figures") off the
same template. Authored copy and framing stay in-voice (owner-written).

---

## Social & Scheduling

### More Pinterest for the rest of the week `[Soon]`
Keep the Pinterest posting cadence going through the week.

### Bluesky: celebrity birthday design + posts
New Bluesky campaign: celebrity-birthday treatment and posts (a sibling to the existing
Birthday Bearings / Collective / Reclaimed campaigns).

### Bluesky: this-day-in-history design + posts
New Bluesky campaign: "this day in history" treatment and posts.

### Schedule remaining Pinterest boards (14)
All 16 boards are built — these are the scheduling/publishing passes:
- [ ] Finish scheduling — Birthday Tarot Card
- [ ] Major Arcana — Reclaimed Reversal Meanings
- [ ] Cups — Gift Meanings
- [ ] Wands — Gift Meanings
- [ ] Swords — Gift Meanings
- [ ] Pentacles — Gift Meanings
- [ ] Cups — Shadow Meanings
- [ ] Wands — Shadow Meanings
- [ ] Swords — Shadow Meanings
- [ ] Pentacles — Shadow Meanings
- [ ] Cups — Reclaimed Reversal Meanings
- [ ] Wands — Reclaimed Reversal Meanings
- [ ] Swords — Reclaimed Reversal Meanings
- [ ] Pentacles — Reclaimed Reversal Meanings

---

## Shipped

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
