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

### 🔴 Magic-link sign-in strands in-app-browser users
**Added:** 2026-07-06

**Problem / root cause.** Sign-in uses a PKCE magic link. Requesting the link stores a
secret `code_verifier` in the cookie store of the browser that requested it; the
`/auth/callback` step (`exchangeCodeForSession`) can only finish sign-in if that *same*
cookie store is what opens the link. If the link opens in any other browser context,
sign-in fails and bounces back to `/sign-in`.

**When it happens.**
1. **In-app browser → phone's default browser** (the Shannon case). Requests the link inside
   an app's in-app browser (Gmail, Instagram, Facebook, LinkedIn, X, TikTok, Slack), then
   taps the link in email → launches Safari/Chrome, a different cookie store.
2. **Requested on laptop, opened on phone** (or vice versa). Different device = no verifier.
3. **Two browsers on one device.** Requests in Chrome, mail app opens links in Safari.
4. **Mail app's own in-app browser.** Gmail/Outlook/Yahoo open links in *their* webview.
5. **Normal ↔ private/incognito, or aggressive cookie clearing** dropping the verifier.
6. **Desktop mail client → non-default browser.**

Works only when the same browser both requests and opens the link — probabilistic, and it
silently blocks signup, which gates everything.

**Planned fix.** Add a 6-digit email code path (`verifyOtp`): user reads the code and types
it into the page they're already on. Keep the magic link as-is (no regression). Two parts:
(1) code-entry UI on `/sign-in`; (2) Supabase email-template change to include `{{ .Token }}`.

**Effort.** ~Half a day of code + a Supabase dashboard edit (owner). Also fix the misleading
"Open it on this device" copy.

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

### 🟠 Homepage value-prop reorder (value ladder)
**Added:** 2026-07-06

**Problem / root cause.** The homepage value props don't read as the funnel they actually
are. The three commercial things are a value ladder — daily card (free front door / SEO),
birth chart ($12 one-off, **giftable** = referral loop), living almanac ($7/mo, personal,
can't be gifted) — but the current order (Today → The Cards → Bearing → Almanac) buries the
money. The birth chart has no dedicated slot despite being the first purchase, the giftable
referral driver, and the top search term; it's only a sub-clause of the account band. The
homepage **never links to `/tarot-birth-chart`**, our indexable pitch page. The Bearing (a
free lead magnet) gets two treatments (prop + full band) while the $12 entrée gets none.

**Direction (mockup + decisions).** A reorder mockup was built in-session (faithful tokens +
typefaces): props become a legible ladder — **Today (Free) → Bearing (Free) → Birth chart
($12 · giftable) → Almanac ($7/mo)** with access chips; the birth chart is promoted to its
own band (with a live mini chart diagram) that finally links `/tarot-birth-chart` and carries
the Bearing→chart upsell ("one card is your Bearing; seven is the whole chart"); "The Cards"
(all 78) demoted to a quiet secondary link; the account band sharpened to almanac-as-personal
("the one thing here you can't make for anyone else"). Confirmed calls: **show real prices**
on the chips (not vague tiers), and keep the **Bearing as a prop only** (its old standalone
band is replaced by the chart band, not duplicated).

Mockup Artifact: https://claude.ai/code/artifact/042f2e57-b88d-441b-ad61-3b3680597c96

**Status.** Not started. Tali flagged there are a few problems with the mockup and wants to
dig in more before any build. Revisit the copy and structure, then wire into `app/page.tsx`
+ CSS. All homepage prose stays authored / in-voice.

### Personal year card calculator
A reusable personal-year-card calculator, plus a standalone landing page for it. Banked in
the paid-reading funnel ideas. Free = the year card; a woven reading is the paid upsell.

### "Your Bearing in a given year" — or a deeper natal chart reading
Decide the shape: a focused "your Bearing in year X" feature, or fold it into a deeper natal
chart reading. Needs a scoping call before build.

### Paid "year ahead" reading (new SKU)
An AI-assisted paid year-ahead reading as a new product. Banked in the paid-reading funnel.

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
A post covering the personal-month reading.

### Get August's month reading `[Soon-ish]`
Author the August collective month reading.

### Blog assets: schedule 2 & 3, create 4 & 5 `[Soon]`
Blog post 2 and 3's assets are done (in the Tarot Almanac folder) and need scheduling. Blog
4 and 5's assets still need to be created. (Per prior work, 3/5 posts' social sets exist.)

### Initiation / Testing / Reckoning post `[Soon]`
The arcana-stages post (a dormant blog scaffold exists for this).

### 2027 year-ahead post
The 2027 year-ahead post (a dormant blog scaffold exists).

### Birth-card compatibility post
Compatibility-by-birth-card post; pairs with the paid compatibility reading above.

---

## Social & Scheduling

### More Pinterest for the rest of the week `[Soon]`
Keep the Pinterest posting cadence going through the week.

### Share with friends `[Soon]`
Share the almanac with friends. (Scope TBD — referral push vs. direct outreach.)

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
