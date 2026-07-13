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

**Update 2026-07-07 — the year card adds a rung.** The `/personal-year-card` free tool
(shipped) is now a *third* free hook alongside the daily card and Bearing, and its paid ~$12
year-ahead reading (coming) is a *second* giftable $12 reading alongside the birth chart. A
single flat 4-prop row can't hold that cleanly. Proposed reframe: **group by tier** instead of
one row — **Free** (today's cards as hero, + Bearing and year card as the two birthday
calculators) → **$12 giftable readings** (birth chart = who you are; year ahead = where the
year takes you, the two deep readings that ride the gift flow) → **$7/mo almanac** (the living,
personal, non-giftable engine). Revisit the mockup with this pairing before any build.

**Status.** Not started. Tali flagged there are a few problems with the mockup and wants to
dig in more before any build. Revisit the copy and structure, then wire into `app/page.tsx`
+ CSS. All homepage prose stays authored / in-voice.

### Personal year card calculator (+ paid woven year-ahead reading)
**Added:** 2026-07-07

**What it is.** A standalone SEO page where a birthday + chosen year computes the **Personal
Year Card** (`mod22(BM+BD+sumDigits(Y))`, a Major), with a paid woven "year ahead" reading on
top. Deliberately the deterministic counter to a shuffled year-ahead spread: same birthday
always yields the same year card and the same twelve months, forever.

**The structural spine (verified).** Within a calendar year the twelve months are
`yearCard+1 … yearCard+12`: twelve consecutive Majors, one step each month, **no repeats**.
That clean arc is a *calendar-year* property only, so the framing is locked to **calendar-year,
single year card, buyer picks the year** (a rolling window breaks both the one-step and
no-repeat properties, confirmed by node script). Visual is the full 22-Major cycle ring with
the 12 consecutive steps lit and element-tinted, the year card as the doorway, and the 10
un-walked Majors dimmed ("where you are in the cycle, and where you're not this year").

**Free vs paid.**
- **Free (hard-wired, SEO):** year card + a static authored meaning (22 blurbs, one per Major,
  adapted from each card's own copy) + element + link to the full card. Arc *structure* visible,
  months locked server-side (mirrors chart preview leak-proofing). Never calls a model.
- **Paid ~$12 (AI-generated deep reading):** the lit cycle-ring image, element weather, the 12
  personal-month readings (wired from existing authored copy), plus an AI-woven synthesis —
  year-card meaning, **how your Bearing meets the year** (your fixed signature against the year
  card, e.g. a Devil Bearing in a Tower year), arc + what's left behind, element-weather read,
  pull-it-together narrative, skills this year asks, reflection questions. Generated per purchase,
  personalized by name, stored against the token, run through the voice guardrails (em-dash/seesaw
  bans in the prompt).
  - *Bearing×Year is structurally exact (verified):* `yearCard = mod22(Bearing + sumDigits(Y))`, so
    your year card is your Bearing advanced by the year's own number, and the Bearing→year-card gap
    is identical for everyone in a given year (10 in 2026, 11 in 2027). 22 Bearings × 22 year cards
    = 484 pairings, which is why it's an AI-woven layer, not authored. This also **subsumes** the
    separate "Your Bearing in a given year" item below: your Bearing in year Y is your year card.
- **Giftable:** fixed artifact, so it rides the existing chart-gift flow (`createGiftChartCheckout`
  + `/gift/[token]`). Daily engine (day cards, minors, time-travel) stays subscription-only so
  the ladder holds; the year reading is a referral driver and an on-ramp to the sub.

**Status. Phase 1 shipped & live (2026-07-07).** `/personal-year-card` calculator hub + 22 static
SEO card pages (`/personal-year-card/[slug]`): year-card blurb, "what to do", the deterministic
12-month arc (element-tinted glyphs), element weather, the 9 untouched Majors, FAQ/explainer with
FAQPage schema. `lib/yearCard.ts` (fs-free compute) + `content/year-cards.json` (build source,
mirrors `content/year-card-reading.md`). In the sitemap; internal links in from /bearing,
/tarot-birth-chart, /how-it-works. Copy/metadata targets the validated search phrases ("tarot
year card", "card of the year", "calculator") after live SERP research, not just "personal year
card" (which bleeds into numerology). FAQ owns the method difference (we keep the whole wheel;
most calculators over-reduce) with a link to /how-it-works. Two sample paid readings drafted and
reviewed (a Bearing×Year clash and a harmony) to confirm the paid tier is compellingly distinct
from the free structure; conclusion: the Bearing×Year weave + structural facts (e.g. in 2026
December returns everyone to their Bearing) can't be self-assembled from the free page, so free
stays SEO-generous.

**Phase 2 (next).** The Satori cycle-ring share image; wire the authored personal-month readings;
paid checkout + gift (mirror `startOwnChartCheckout` / `createGiftChartCheckout`) + the AI
generation, with the Bearing×Year layer as the spine and the voice guardrails in the prompt.
Elements sourced from card JSON `element` / master xlsx, not the calculations doc (it drifted).

**Open (small):** homepage link to the hub is parked pending a placement call (the year card isn't
in the planned value-ladder reorder, so where it sits on the homepage is best decided there).

### "Your Bearing in a given year" — folded into the year-card reading
Resolved: your Bearing in year Y *is* your year card (`yearCard = mod22(Bearing + sumDigits(Y))`),
so the Bearing×Year read now lives inside the personal year card reading above rather than as its
own feature. A deeper natal chart reading, if wanted, stays a separate future scoping call.

### 🟠 Paid "year ahead" report (new SKU) `[Soon]`
**Added:** 2026-07-07 · **promoted to next-up 2026-07-08**

**What it is.** The paid ~$12 AI-woven year-ahead report that sits on top of the shipped
`/personal-year-card` free calculator. Full scope lives as **Phase 2** of the *Personal year
card calculator* item above — the Bearing×Year spine (`yearCard = mod22(Bearing + sumDigits(Y))`),
the 12 personal-month readings, the Satori cycle-ring share image, and the gift flow. This card
tracks it as its own deliverable so it doesn't stay buried inside the calculator entry.

**Why now.** It's the second giftable $12 reading alongside the birth chart, and an on-ramp to
the sub. It also **gates content:** the personal-year blog post is deliberately held until this
ships, so the post feeds a finished free→paid funnel instead of dead-ending at the free
calculator (owner call, 2026-07-08; recorded in `docs/BLOG_IDEAS.md`).

**Planned build.** Mirror `startOwnChartCheckout` / `createGiftChartCheckout` for checkout + gift;
AI generation keyed to the purchase token and run through the voice guardrails (em-dash / seesaw
bans in the prompt); elements sourced from card JSON `element` / master xlsx, not the drifted
calculations doc.

**Effort.** Multi-day — new AI-generation path + checkout/gift wiring + the share image.

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

### Blog assets: schedule 4 & 5 `[Soon]`
Blog posts 2 and 3's assets are done and scheduled (2026-07-08). Blog 4 and 5's assets are now
created (2026-07-08) but not yet scheduled. All 5 published posts' social sets exist — only the
scheduling passes for 4 and 5 remain.

### Initiation / Testing / Reckoning post `[Soon]`
The arcana-stages post (a dormant blog scaffold exists for this).

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

### Share with friends `[Soon]`
Marketing push to get the almanac in front of friends — direct outreach / word of mouth.

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
