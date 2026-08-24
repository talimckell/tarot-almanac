# Search performance log

Weekly review of the Google Search Console export. Newest entry at the top. Each week:
export Performance → Search results (last 3 months, all tabs) → drop the xlsx in ~/Downloads →
diff against the entry below and add a new one.

**Read the dates, not the label.** The export always says "Last 3 months" but the site has only
been indexed since early July 2026, so the real window is much shorter. Use the Chart tab's first
and last row as the true window.

**Don't over-read small numbers.** At current volume a single impression moves an average
position by tens of places. A metric is only worth acting on if it holds for two weeks or shows
up across several pages at once.

**Include a "Page 1 roster" each week** — the pages averaging position ≤ 10 in the window, grouped
by page type. It's the clearest running picture of what's actually ranking. To regenerate from an
export: filter the Pages tab to `position <= 10`, sort ascending. Two standing caveats to repeat
in the read: (1) these are *averages over the queries a page appeared for*, mostly on 1–2
impressions, so only the higher-impression rows are trustworthy; (2) "page 1" ≠ "where clicks come
from" — a page can rank just off page 1 yet out-earn everything on it by showing for far more
searches (see `/month/2026-08`).

---

## Reference: ad-revenue path (Mediavine) — added 2026-08-06

Strategic context, not a weekly entry. Rationale: paid acquisition failed on conversion (see the
post-mortem) and getting anyone to pay for a $12 chart is a long road, so display ads are a
game-plan *supplement*. Mediavine is the chosen "quality" network. Verified 2026-08-06 against
Mediavine's own pages.

**The thresholds changed Jan 2026.** The old flat 50,000-sessions entry bar is retired. New shape:
- **Journey by Mediavine** (the on-ramp, and it *is* Mediavine, not a lesser network): **1,000
  sessions / 30 days**, no revenue minimum, 70% rev share, runs on the Grow plugin.
- **Official** (full ad management): auto-upgrade once the site earns **$5,000 in ad revenue over a
  trailing 12 months**. Higher tiers (Select/Signature/Premiere) are revenue bands far above us.

**Track SESSIONS, not impressions.** Mediavine counts sessions (≈ visitors, ~20–30% below
pageviews) — that's the Vercel "visitors" number, NOT GSC clicks or impressions. The chain is
impressions → clicks (organic CTR ~1.3%) → sessions. So the weekly number to watch against the
1,000 target comes from Vercel Web Analytics, once the paid-traffic residue clears and it reads
true organic.

**Where we stand (2026-08):** roughly ~150–300 organic sessions/mo (hard to pin — the Vercel 315
visitors/3mo was ad-inflated). Call it ~15–25% of the way to Journey entry.

**The 50k wall didn't vanish, it moved.** At an estimated ~$10 blended RPM, the $5,000/12-mo
auto-upgrade needs ~40,000 sessions/mo. Rough revenue ladder (all ±wide, see RPM caveat):

| Milestone | Sessions/mo | ~Monthly ad $ |
|---|---|---|
| Journey entry | 1,000 | ~$10 |
| — | 5,000 | ~$50 |
| Meaningful | 20,000 | ~$200 |
| Official upgrade ($5k/yr) | ~40,000 | ~$400 |

So: entering Journey (1,000 sessions) is a real 2027 milestone; ads producing *meaningful* money
(hundreds/mo) needs tens of thousands of sessions = 2028+ on the current organic curve. Long-game
supplement, not a near-term revenue fix.

**RPM reality (the real constraint):** no tarot-specific RPM data exists in the by-niche datasets
— the niche is too small to appear, which itself signals thin advertiser demand. Proxies: finance
$15–40+, health/wellness $10–28, gaming/entertainment $2–7. Tarot/spiritual most likely ~$5–15
blended, brand-safety-discounted. **Geo drags it lower:** non-US/UK/CA/AU traffic earns 50–80%
less, and our traffic is only ~47% US (big India/Indonesia/Mexico slices). Blended RPM likely sits
low in that range.

**Content policy: no ban found; risk is RPM softness, not rejection.** Mediavine placing advertiser
ads on a tarot site is a different transaction from ad networks (Teads/LinkedIn) banning tarot
*service ads* — the latter is what blocked us on Google Ads and doesn't apply here. Mediavine's
stated bar is original/audience-first content + brand-safe human traffic + good Google AdSense
standing, and our human-authored, non-generated content is exactly their stated preference — a real
approval edge as they fight AI filler. **OPEN / to verify:** couldn't read the Journey prohibited-
content list directly (page 403'd); confirm with Mediavine in writing that tarot/divination content
is in bounds before building around this.

**What to do now:** nothing to act on — it's a sessions game and we're early. Start noting the
weekly organic **sessions** figure (from Vercel) alongside impressions, tracking toward 1,000.

---

## 2026-08-24 (window: Jul 4–Aug 22, 50 days) — soft week reversed; /month/2026-09 breaks out

| cumulative | | vs last week |
|---|---|---|
| Impressions | 2,602 | +700 |
| Clicks | 44 | +19 |
| CTR | 1.7% | +0.4pt |
| Page 1 (pos ≤ 10) | 139 | +19 |
| Mobile CTR | 3.1% | climbing (was ~2.5%) |

**The "soft week" was the August lull, and it fully reversed.** Last week I said one down week wasn't
a verdict — hold before reacting. Correct call: the marginal week snapped back hard.

| Marginal week | Impressions | Clicks |
|---|---|---|
| Aug 9–15 (the dip) | ~358 (~51/day) | 3 |
| Aug 16–22 | ~747 (~107/day) | 19 |

Aug 18–22 ran 100–138 impr/day — **new highs, above the July peak.** The lull was `/month/2026-08`
decaying late-month plus summer; new demand more than replaced it.

### The headline: `/month/2026-09` broke out — the reminder/early-index play worked

Requested indexing 2026-08-17. One week later it's the **#1 click-earner on the whole site:
pos 6.38, 66 impr, 10 clicks, ~15% CTR** — past `/month/2026-08` (6 clicks). This is direct proof of
the standing lesson: **month pages are the golden organic product**, because the query
("september 2026 tarot") is an exact match to the page, so page-1 rank converts at 15% instead of
1–2%. It also validates the monthly indexing reminder — the payoff landed inside a week. Keep feeding
that pipeline; the Sept-1 routine (→ `/month/2026-10`) is the next one.

### Reconciling the scary Vercel dashboard: −35% is the ads clearing, NOT decline

Vercel's 30-day view shows **visitors 176 (−35%), pageviews 415 (−43%), bounce 66% (+5%)** — alarming
at a glance, and the exact opposite of the GSC story (organic at new highs). They don't conflict: the
Vercel comparison baseline is the *prior* 30 days, which still had **paid ad traffic**. So the drop is
the ad scaffolding coming down (as the post-mortem predicted), not organic falling. Organic search is
up. Don't read the −35% as a problem; it's the residue finishing its clear-out.

**And a chunk of even that 176 is bots.** Confirmed signatures this window: SG 13 visitors (up from 5),
DE 9 visitors → 48 pageviews (5.3 pv/visitor) and FR 7 → 30 (bot-like ratios), plus a **sequential
crawl of `/today/2006-04-07…21` and `/today/2026-04-07…21`** date URLs — a classic bot walking pages
in order. So true human organic is below 176. Search referrers (the real signal): google 43, ddg 28
(DuckDuckGo is a genuine chunk now), bing 9, ecosia 4, yahoo 3, Pinterest 2 (boards showing up).

### Mediavine / Journey tracker

Muddy this week — the 30-day Vercel window mixes ad-tail + bots, so no clean weekly session count.
Estimate real human organic ~130–160/mo → **~14% to Journey's 1,000.** Grab a clean 7-day Vercel pull
next time for a truer read. Directionally flat-to-up with the GSC recovery.

### Also moving

- `/blog/2027-tarot-year-card` holds pos 8.1 (40 impr, 3 clicks) — timely content keeps earning; the
  early-publish bet (ran it in August for the Nov–Jan spike) is looking right.
- `/personal-month-card/*` funnel: hierophant 3c, chariot 2c, lovers/fool 1c each — second funnel
  compounding.
- `/tarot-birth-chart` still climbing organically: pos 50 (47 impr, 2 clicks) — the ex-ad landing page
  building its own free stream.
- Generic `/tarot/*` still absent from page 1 (nine-of-wands cluster 154 impr at pos 83). Unchanged.

### Baseline to beat next week

Cumulative: impressions 2,602 · clicks 44 · CTR 1.7% · 139 on page 1. Watch: does the Aug-18+ new-high
daily rate (100–138/day) hold into September, `/month/2026-10` after the Sept-1 reminder, and a clean
Vercel weekly for the sessions tracker.

---

## 2026-08-17 (window: Jul 4–Aug 15, 43 days) — first soft week on the margin

| cumulative | | vs last week |
|---|---|---|
| Impressions | ~1,900 | +400 |
| Clicks | 25 | +3 |
| CTR | ~1.3% | ~flat |
| Page 1 (pos ≤ 10) | 120 | +6 |
| **Organic sessions (Vercel)** | **~28 / 7 days ≈ ~120/mo** | down from ~160/mo |

**Read the margin, not the cumulative.** The trailing-window totals keep rising, but the *new week*
(Aug 9–15) softened on both metrics:

| Marginal week | Impressions | Clicks |
|---|---|---|
| Aug 2–8 | ~570 (~81/day) | 10 |
| Aug 9–15 | ~358 (~51/day) | 3 |

That's the first genuinely down week since indexing began. Honest read: **volume is receding, not
just plateauing.** Most likely a mix of (1) mid-August seasonality (summer lull), (2) `/month/2026-08`
decaying as its month ends — it's the top earner and August demand fades late-month, (3) small-site
volatility. GSC also under-reports the last 1–2 days, so Aug 14–15 will revise up somewhat and soften
the drop — but the direction is down regardless.

**Structure kept improving through the volume dip**, same as last week but starker: page-1 count
114 → 120, mobile position 14.5 → 13.6, `/blog/2027-tarot-year-card` holding pos 8.3. So pages are
still climbing and multiplying inside a shrinking impression pool. The question next week answers:
is Aug 9–15 seasonal (recovers in September) or the early shape of a lower ceiling? One soft week on
a 6-week-old site isn't a verdict — don't overreact — but it's the first data point that isn't up.

### Notable

- **`/tarot-birth-chart` is quietly earning organically** — pos 57 → 48, 30 impr, 2 clicks. The page
  ads pointed at is slowly picking up organic traction on its own. Worth remembering when the
  conversion-path work eventually happens: it'll have a small warm organic stream by then.
- **`/month/2026-08` still the top earner** (6 clicks, 102 impr) even while decaying — confirms the
  month pages are the workhorse, and the late-month fade is why watching the September handoff matters.
- **Timely content holds:** `/blog/2027-tarot-year-card` steady at pos 8.3 (27 impr, 2 clicks). The
  lesson from last week stands — dated/seasonal content is the fastest ranker.

### `/month/2026-09` — cause found: indexing was never requested

Flagged two weeks running for not appearing. Verified 2026-08-17 that the page is live (200), in the
sitemap, and linked from the `/month` hub — but the actual cause was simpler: **indexing had never
been requested for it in Search Console.** Requested manually 2026-08-17. Expect it to get crawled
and start appearing within a few days to ~2 weeks (if September demand has started).

**Recurring lesson — index month pages EARLY.** `/month/2026-08` became the top earner precisely
because it was indexed in time to catch July's ahead-of-time "August 2026 tarot" searches. Month
pages are seasonal and time-sensitive: the "next month" page should be index-requested ~4–6 weeks
ahead so it's live in the index before the ahead-of-time demand arrives. Requesting 2026-09 only on
Aug 17 likely means it misses some of the early September-ahead demand. Standing action: each month,
request indexing on the following month's `/month/[ym]` page well ahead of time.

### Unchanged

Birth-card thread stays closed (hub 78.4, blog 77.8 — tied, parallel, no divergence). Generic
`/tarot/*` still absent from page 1 (nine-of-wands 150 impr at pos 83; `/tarot` index 126 impr, one
fluke click at pos 87).

### Sessions also softened — but it's noise-level

Vercel Aug 10–17: ~28 visitors (US 54%, Singapore 5 the notable one) ≈ **~120 sessions/mo, down from
~160** → ~12% to Journey's 1,000 (was ~16%). Both datasets dipped together, which points to the same
August-lull cause. But at 28-vs-37 visitors, a 9-visitor swing is inside the noise band at this
scale — don't read it as a trend on its own; read it as "GSC and Vercel both soft, consistent with
summer." `/month/2026-09` already drew 2 direct visitors here before indexing — it'll pick up once
crawled. Search referrals split ddg 5 / google 3 / bing 2 / ecosia 2 (DuckDuckGo edged Google — tiny
numbers, just noting).

### Baseline to beat next week

Cumulative: impressions ~1,900 · clicks 25 · 120 on page 1 · organic ~120 sessions/mo (~12% to
Journey). **The real watch: does the margin recover after August** (both GSC ~51/day and Vercel ~28
visitors dipped), and does `/month/2026-09` surface now that indexing was requested 2026-08-17.

---

## 2026-08-10 (window: Jul 4–Aug 8, 36 days) — first clean organic week

| | | vs last week |
|---|---|---|
| Impressions | ~1,500 | +540 |
| **Clicks** | **22** | **+10** |
| CTR | ~1.5% | +0.25pt |
| Page 1 (pos ≤ 10) | **114** | +36 |
| **Organic sessions (Vercel, clean)** | **~37 / 7 days ≈ ~160/mo** | first true read |

### Two engines, now cleanly separated

**Ads residue cleared, exactly as the post-mortem predicted.** Vercel fell from 315 visitors/3mo
(ad-inflated) to **~37 visitors in the Aug 3–10 week** — pure organic + direct. That's the real
baseline: **~160 sessions/month.** Not a regression; the paid scaffolding came down on schedule.
- Search referrals: google 11, duckduckgo 6, yahoo 1. Rest direct.
- **Geo got healthier: US is now 61%** (was 47% with ads). Organic traffic skews US, which is
  better for eventual RPM — the ads had been buying the low-value geo share.

**Mediavine Journey tracker:** ~160 sessions/mo ÷ 1,000 target = **~16% of the way to the door.**
Matches the reference-section estimate. This is the number to grow; it's the one that matters for
the ad-revenue path.

### The ramp has plateaued — reality is tracking the *conservative* curve

Daily impressions have flattened: Aug 2–8 ran ~570 (~81/day) vs the prior week's ~596. August is
pacing ~2,500 for the month — **below the conservative projection (3,000)**, not the realistic one.
The explosive discovery ramp is over; we're in slow-compounding territory now. (GSC under-reports
the last 1–2 days, so Aug 7–8 may revise up a little, but the flattening is real.)

**But the maturation signals are the good kind**, and they're why clicks (22) outgrew impressions:
page-1 count 78 → 114, CTR rising, recent-day positions improving (Aug 7–8 hit pos 22–32). Pages
are climbing *within* a flat impression pool — quality over quantity, which is the healthier way to
grow at this stage.

### Best new signal: timely content ranks fast AND brings sessions

`/blog/2027-tarot-year-card` went live and immediately hit **pos 8.2 (25 impr, 2 clicks)** — and was
the **#1 Vercel page (10 visitors)**. Timely/seasonal content ("tarot august 2026" ranks pos 8 too)
is the fastest path to both rankings and sessions, and it's exactly the kind of content that gives
people a reason to *return* (ties to the pay-to-keep thread). Worth leaning into: dated, "what's
coming" content beats evergreen card meanings for this site.

### Page 1 roster (pos ≤ 10) — 114 pages (was 78)

Composition: **74 birthday · 16 today · 10 personal-year · 6 personal-month · 3 blog · 1 bearing ·
4 other.** Trustworthy rows (≥ 5 impr) worth naming: `/birthday/october-29` 7.4 (22i, click) ·
`/blog/2027-tarot-year-card` 8.2 (25i, 2 clicks) · `/birthday/august-17` 5.4 (17i, click) ·
`/personal-month-card/hierophant` 7.0 (9i, 2 clicks) · `/birthday/december-20` 7.9 (13i) ·
`/personal-month-card/magician` 5.7 (10i) · `/birthday/february-27` 5.8 (11i) · `/birthday/october-31`
6.5 (11i). Generic `/tarot/*` still absent from page 1 (nine-of-wands cluster pulls 148 impr but
sits pos 83).

### Unchanged threads

- **Birth-card split stays closed.** Hub `/tarot-birth-card` 82.0, blog 77.8 — still parallel,
  still both weak on the head term, no divergence. Correctly a non-bug.
- **`/month/2026-09` still hasn't appeared.** The seasonal Sept climb I flagged for "watch this
  week" hasn't started; `/month/2026-08` is the only month page with volume and it's slipping
  (11.9 → 12.6) as August matures. Keep watching — Sept should surface as searches shift.

### Baseline to beat next week

Impressions ~1,500 · clicks 22 · CTR ~1.5% · 114 on page 1 · **organic ~160 sessions/mo (~16% to
Journey)**. Milestones: `/month/2026-09` appearing, sessions trend (is ~160 the floor or does it
climb?), and whether the impression plateau breaks or holds.

---

## 2026-08-03 (window: Jul 4–Aug 1, 29 days)

| | | vs last week |
|---|---|---|
| Impressions | 957 | +628 (nearly 3×) |
| **Clicks** | **12** | **+7** |
| CTR | 1.25% | ~flat (clicks scaling with impressions) |
| Avg position | ~58 blended | noisy; daily 39–65 |
| Indexed pages appearing | 136 | +65 |
| Queries appearing | (not re-counted) | — |

Daily impressions crossed 100/day (Jul 30: 105, Jul 31: 100). The site is being crawled and
surfaced far more; this is the authority-building phase showing up as impression growth.

### The 12 clicks — now diversifying

| Page | Clicks | Impr | Pos |
|---|---|---|---|
| `/month/2026-08` | 5 | 85 | 11.9 |
| `/personal-month-card/hierophant` | 2 | 4 | 10.8 |
| `/personal-month-card/chariot` | 1 | 10 | 13.5 |
| `/personal-month-card/lovers` | 1 | 2 | 6.0 |
| `/birthday/august-17` | 1 | 10 | 4.8 |
| `/birthday/november-7` | 1 | 5 | 6.4 |
| `/tarot` (index) | 1 | 66 | 85.7 |

Clicks spread across **7 distinct pages** this week (was 2). Milestone hit: clicks on a third,
fourth, fifth distinct page. `/month/2026-08` is still the leader but now only 5 of 12.

**The `/personal-month-card/*` funnel is earning** — 4 clicks this week (hierophant, chariot,
lovers) from a funnel shipped 2026-07-22. That's the second proprietary funnel (after birthday/
month) to start converting. The lone `/tarot` click at pos 85.7 is a fluke (some long-tail query
where it surfaced high once), not the generic index starting to rank.

### Birth-card split — VERDICT: retitle did not separate them; closing the thread

This is the clean-enough read I deferred twice. The retitle didn't work, and the data explains why.

| | 07-20 | 07-27 | 08-03 |
|---|---|---|---|
| `/tarot-birth-card` (hub) | 30 impr / 82.4 | 68 / 81.7 | 125 / 83.1 |
| `/blog/tarot-birth-card` | 11 impr / 87.2 | 32 / 81.2 | 66 / 82.5 |

Both pages keep gaining impressions in lockstep and both sit flat at ~82–83, still tied, still on
the same cluster. The retitle moved nothing.

**Why, and why I'm now recommending against the escalation I pre-committed to:** I said if they
were still tied today I'd pull the blog's H1 or canonical them together. I don't think either is
right, because the diagnosis changed. You can't *title* a page off a term when its whole body is
about that term — the blog post is 1,259 words about birth cards, so Google ranks it on "tarot
birth card" regardless of the title tag. And the deeper point: **neither page is anywhere near
ranking** (both page 8–9), so they aren't suppressing each other — they're both just weak on a
competitive head term until the site has more authority. Cannibalization was the wrong frame.

**Decision: stop treating this as a bug.** Keep the retitle (it's marginally better-targeted, no
harm). Don't touch the blog H1 — it would cost authored voice for zero evidence of gain. Leave the
canonical alone — the blog earns its keep for /blog readers and internal linking. Revisit only if
the two ever *diverge* (one climbing while the other holds flat), which would be actual
suppression. Parallel flatness is not. This thread is closed.

### Page 1 roster (avg pos ≤ 10) — 78 pages (was 35)

More than doubled. Composition: **50 birthday · 8 personal-year · 5 personal-month · 15 other.**

Trustworthy rows (≥ 3 impr): `/bearing` 3.3 · `/birthday/february-25` 5.9 (7) · `/february-26`
5.8 (6) · `/february-27` 6.6 (5) · `/june-22` 5.7 · `/september-17` 7.7 (7) · `/january-26` 7.3 ·
`/august-29` 7.7 · `/july-21` 8.8 (4) · `/december-20` 9.1 (9) · `/july-25` 9.3 (7) · `/august-1`
9.6 (7) · `/april-25` 9.3 · `/april-14` 9.7 · `/july-31` 9.8 (4) · `/october-7` 6.3 (4) ·
`/personal-month-card` 6.7 · `/personal-month-card/magician` 8.0 · `/blog` 7.5. The remaining ~59
are 1–2 impressions — directional, and mostly a wave of new birthday dates being crawled.

The generic `/tarot/*` card pages remain **absent from page 1** (all pos 66–95). The whole page-1
roster is still proprietary pages. Thesis holds, and it's compounding — page-1 count 35 → 78 in a
week.

### Watch

- **Mobile pos 15.9 vs desktop 70.1 — fourth straight week.** Fully durable now. Desktop carries
  592 of 925 impressions (the generic `/tarot/*` pages Google shows there) but ranks in the 70s;
  mobile carries the proprietary pages and ranks ~16. Structural, not a lever.
- **`/month/2026-08` still just off page 1** (11.9) yet still the top earner. `/month/2026-09`
  hasn't appeared yet — watch for it now that it's August.

### Paid campaign post-mortem (Google Ads → birth-chart/card, ~May–Jul 2026, now OFF)

Recorded 2026-08-03 from Vercel Web Analytics (window May 3–Aug 3), so the SEO context isn't lost.
**Ads ran and were switched off for not hitting the metrics to continue.** What the data shows:

- **The traffic was paid, not organic.** 315 visitors / 161 google.com referrals over the window,
  with 225 of them landing on `/tarot-birth-chart` (119) and `/tarot-birth-card` (106) — the two
  Google Ads landing pages. Both rank **pos 66–83 organically** (Google page 7–8), so they can't
  have earned that traffic from search. It was ad spend.
- **The failure was downstream conversion, not clicks.** Top-of-funnel worked: 24% of visitors
  fired a `form_submit` (calculator use). But the funnel collapsed at the free→paid step —
  ~225 paid landings produced **1 visible return from `checkout.stripe.com`**. Steps in between:
  `/sign-in` 42, `/chart` 31, `/me` 17. The campaign bought engaged calculator users who took the
  free card and left without buying the $12 chart.
  - *Measurement caveat:* "1" counts visitors who returned via a Stripe referrer; a few completed
    checkouts could land without that referrer. The order of magnitude (near-zero paid conversion)
    is not in doubt, but don't treat 1 as an exact purchase count.
- **Possible contributing factor: broad geo.** US was 47%, but India / Indonesia / Mexico / Brazil
  / Vietnam were large slices — low-monetizing geos for a USD product. If targeting wasn't tight,
  some spend bought clicks that were never going to check out.

**Diagnosis:** a conversion/offer problem, not a traffic problem. The `/tarot-birth-chart` landing
page hands over the free value and doesn't convert to the paid product.

**Implications carried forward:**
1. **Expect Vercel traffic to fall toward the organic baseline** (~12 clicks/wk) now that the ad
   scaffolding is down. When the birth-chart/card pages drop out of the Vercel top list, that's the
   paid residue clearing, not a regression.
2. **Don't re-run paid until the `/tarot-birth-chart` free→$12 conversion path is fixed** — same
   leak would repeat. (Landing-page conversion diagnosis deferred, not done.)
3. **Validates the organic long-tail as the acquisition engine.** Paid didn't pay for itself at
   this conversion rate; free traffic we own is the right thing to keep compounding. Fixing the
   conversion path also serves every organic visitor who lands on the same page later.

### Baseline to beat next week

Impressions 957 · clicks 12 · CTR 1.25% · ~58 blended · 136 pages · 78 on page 1.
Next milestones: first proprietary page to *hold* page 1 at real impression volume, `/month/2026-09`
appearing, and the first double-digit-CTR page at >10 impressions.

**Organic learning applied this week:** none actionable — continue course. Standing lens going
forward: **chase impression volume, not position.** Month pages at pos ~12 out-earn birthday pages
at pos 5 because they show for more searches; don't over-invest in nudging already-high, low-volume
pages higher.

---

## 2026-07-27 (window: Jul 4–25, 22 days)

> Export label changed to "Last 28 days" (was "Last 3 months"). Same true window —
> the Chart tab still starts Jul 4 (first indexed day). Just Google's default label.

| | | vs last week |
|---|---|---|
| Impressions | 329 | +174 (more than doubled; +7 days but daily rate also ~2×'d) |
| **Clicks** | **5** | **+4** |
| CTR | 1.52% | +0.87pt |
| Avg position | ~55 blended | noisier — daily swings 14 → 60 on query mix |
| Indexed pages appearing | 71 | +26 |
| Queries appearing | 100 | +39 |

Daily impressions are climbing fast: 22/day (Jul 19–20) → 45 (Jul 23) → 50 (Jul 25).
Clicks landed Jul 20, 21, 22, 23, 25.

### The 5 clicks

| Page | Clicks | Impr | Pos | CTR |
|---|---|---|---|---|
| `/month/2026-08` | 4 | 51 | 12.7 | 7.8% |
| `/personal-month-card/hierophant` | 1 | 2 | 16.0 | 50% |

Both clicks come from the same place: **proprietary pages at page-1 positions.** `/month/2026-08`
is the workhorse (4 of 5 clicks) and confirms the seasonal next-month pattern — people search the
month ahead. `/month/2026-09` is the one to watch as August starts. The `/personal-month-card/*`
funnel (shipped 2026-07-22) produced its first click at 50% CTR; small sample, but it's live and
converting. **Desktop also converted for the first time** (2 of the 5 clicks were desktop, vs 0
ever before).

### Birth-card split — verdict: inconclusive, leaning "didn't separate them"

This was the week the retitle was supposed to show. What actually happened:

| | last week | this week |
|---|---|---|
| `/tarot-birth-card` (hub) | 30 impr, pos 82.4 | 68 impr, pos 81.7 |
| `/blog/tarot-birth-card` | 11 impr, pos 87.2 | 32 impr, pos 81.2 |

The blog **climbed** (87 → 81) and tripled its impressions, and the two pages are now essentially
**tied at position 81, both still surfacing on "tarot birth card" (12 impr this week).** That is
not the separation the retitle was going for — the goal was to move the blog *off* the head term
onto method queries, and instead it rose *on* the head term to meet the hub.

**But I can't call it a failure yet, for two honest reasons:**
1. **The window blends pre- and post-retitle days.** The change deployed Jul 20; this window is
   Jul 4–25, so ~16 of 22 days are pre-change. The blended position tells us little. The first
   *clean* read is next week (a window that's mostly/entirely post-Jul-20).
2. **This export is query-level, not query×page.** I can see "tarot birth card" got 12 impressions
   but not which page served them. To truly verify the split I'd need the GSC UI: filter to the
   query "tarot birth card", look at the Pages tab, and see whether the blog still appears there.
   Worth doing by hand in Search Console this week.

**Decision:** hold one more week for a clean window. If the two are still tied at ~81 both on the
head term on 2026-08-03, escalate to the next lever already teed up — change the blog post's
visible H1 off "What Is Your Tarot Birth Card?" (currently still the head term), or consolidate
the two with a canonical. Don't touch it before then; the site is gaining authority site-wide and
both pages rising together may just be that, not mutual suppression.

### Page 1 roster (avg pos ≤ 10) — 35 pages

Trustworthy rows (≥ 3 impressions) in **bold**; the rest are 1–2 impressions, so directional.

**Birthday cards — 20 (the engine of page-1 presence)**
`february-25` 5.3 (4 impr) · `july-2` 4.5 · `september-24` 5.0 · `september-17` 6.0 ·
`december-20` 6.5 · `october-7` 2.0 · `october-31` 7.0 · `march-26` 8.0 · `november-7` 8.0 ·
`april-25` 8.0 · `january-25` 8.0 · `october-11` 8.0 · `january-26` 8.5 · **`july-21` 8.8 (4)** ·
`april-3` 9.0 · **`july-25` 9.3 (7 — most-tested on the list)** · **`august-1` 9.3 (3)** ·
`july-31` 9.5 · `august-27` 10.0 · `december-16` 10.0

**Personal year / month cards — 7**
`personal-year-card/`: `emperor` 9.0 · `strength` 9.0 · `devil` 9.5 · `empress` 9.5 · `death` 10.0
· `fool` 10.0 — `personal-month-card/fool` 9.0

**Core brand & structural — 8**
**`/bearing` 3.3 (3)** · `/bearing/world` 4.0 · `/` (home) 3.0 · `/blog` 7.5 ·
`/today/2026-02-26` 2.0 · `/today/2026-07-07` 5.0 · `/tarot/six-of-swords` 3.0 (fluke, off-target
query) · `/privacy` 1.0 (fluke)

**Just off page 1 (10–13) worth watching:** `/month/2026-08` **12.7 but 51 impr + 4 clicks —
out-earns the whole list above**; `personal-year-card/justice` 10.5, `/high-priestess` 11.0,
`/sun` 12.0; `birthday/april-14` 10.5, `august-28` 11.0.

The generic `/tarot/*` card pages are **absent** — all sit pos 66–100. Page 1 is entirely
proprietary pages (birthday / bearing / personal-year / month), which is the whole SEO thesis
holding: win the pages nobody else has, don't fight incumbents on card meanings.

### Movers

- **Proprietary long-tail keeps widening and ranking.** New this week at strong positions:
  `/privacy` (pos 1 — incidental), `/birthday/october-7` (2), homepage `/` (3), `/bearing/world`
  (4), plus a wave of new `/personal-year-card/*` (devil, empress, emperor, death, fool, lovers)
  and `/personal-month-card/*` (fool, hierophant) pages, nearly all pos 9–16. The 2026-07-13
  orphan rescue + the year/month-card funnels are compounding.
- **Commercial birth-card cluster deepening**: "tarot birth card calculator" now 8 impr at pos 65
  (up from pos 81), "tarot calculator", "birth card calculator", "what is my tarot card", "birth
  arcana". Good for the hub — this is its intent.
- **`/tarot` index still stuck** at pos 87 (33 impr) on generic "all tarot cards" / "tarot cards
  list" queries. Same multi-year fight; still not worth optimizing for. Its job stays internal
  linking + calculator conversion.

### Watch

- **Mobile pos 16.5 vs desktop 69.5 held a THIRD week** (now 116 vs 209 impr). This is durable,
  so treat it as a structural fact, not noise: desktop gets more impressions because Google shows
  the poorly-ranking generic `/tarot/*` pages more there, while the well-ranking
  birthday/month/personal pages skew mobile. Both convert now. Not a device lever to pull, just
  the shape of the page mix.

### Baseline to beat next week

Impressions 329 · clicks 5 · CTR 1.5% · avg position ~55 blended · 71 pages · 100 queries.
Next milestones: the clean birth-card split read, first click on a *third* distinct page, and
`/month/2026-09` beginning its climb.

---

## 2026-07-22 (window: Jul 4–20, 17 days)

| | | vs last week |
|---|---|---|
| Impressions | 155 | +44 (two new days) |
| **Clicks** | **1** | **+1 — first ever** |
| CTR | 0.65% | first non-zero |
| Avg position | ~44 | improving (Jul 19–20 daily pos 42–48, vs 44–61 the week before) |
| Indexed pages appearing | 45 | +6 |
| Queries appearing | 61 | +6 |

### The first click

**Jul 20 · `/month/2026-08` · position 8.77 · mobile · Australia · CTR 7.7%** (1 click / 13 impr).

This is the thesis from last week landing exactly where predicted. The click came from the
"already at pos 3–12" band, on a proprietary page nobody else has. `/month/2026-08` climbed
14.3 → 8.8 week-over-week and converted the moment it reached page 1. First clicks come from
proprietary pages at page-1 positions, not from the generic `/tarot/*` fight. Keep pushing that
band.

Daily impressions are also rising: ~12–15/day the first two weeks, now 22/day on Jul 19–20.

### Movers

- **`/month/2026-08`** — pos 14.3 → 8.8, impr 3 → 13. The click page. Next-month page is the
  seasonal winner (people searching August ahead of time); worth remembering the pattern rolls
  forward — `/month/2026-09` should be the one to watch late August.
- **`/tarot-birth-card`** — impr 16 → 30 (nearly doubled), pos ~82 flat. Google is surfacing the
  hub much more on the birth-card cluster. Position hasn't moved yet, but impression share is
  the leading indicator and it's growing.
- **New commercial-intent queries** appearing: "tarot birth card calculator" (4 impr, pos 81),
  "tarot birth card meaning" (3), "tarot card calculator", "arcana birth chart", "birth card
  calculator astrology". The calculator/commercial cluster is widening — good for the hub.
- **Birthday cluster keeps expanding**: april-3, july-31, january-25, august-27 newly appearing,
  all pos 8–13. The 2026-07-13 orphan rescue continues to pay out.

### Birth-card split — too early to read

`/blog/tarot-birth-card` is unchanged from last week to the decimal (11 impr, pos 87.18), and
both it and the hub still show on "tarot birth card". The retitle deployed right at the edge of
this window (2026-07-20), so GSC hasn't reflected it yet. **Verdict deferred to next week.** What
to look for on 2026-07-29: the blog's impressions shifting onto method queries (Personality/Soul,
Mary Greer) and off the bare head term, while the hub holds it.

### Watch

- **Mobile pos 20.8 vs desktop 74.2** held a second week, now on 55 mobile impressions (was 33).
  Still most likely page/query mix — the well-ranking birthday/month/personal-year pages skew
  mobile, the generic `/tarot/*` pages skew desktop — not a device advantage per se. But it has
  held twice now, so it's a real skew worth naming, even if the cause is mix.
- **blog-09 (`/blog/life-path-number-tarot`)** shipped this week but isn't in GSC yet (brand new,
  not crawled). Nothing to read; just noting it's live so next week's new-page appearance is
  expected, not a surprise.

### Baseline to beat next week

Impressions 155 · clicks 1 · CTR 0.65% · avg position ~44 · 45 pages · 61 queries.
Next milestones: second click, first click on a *different* page, and the birth-card split verdict.

---

## 2026-07-20 (window: Jul 4–18, 15 days)

| | |
|---|---|
| Impressions | 111 |
| Clicks | 0 |
| Avg position | ~45 |
| Indexed pages appearing | 39 |
| Queries appearing | 55 |

### Read

Zero clicks is not a quality signal at this stage. Average position is 45+, and essentially
nothing below page 3 receives clicks regardless of how good the page is. The signal worth
reading this week is **which pages Google chose to rank, and where**.

Rankings are sharply bimodal, and the split maps exactly onto page type:

| Ranking well (pos 3–27) | Ranking nowhere (pos 73–95) |
|---|---|
| `/today/2026-02-26` — 2 | `/tarot/page-of-cups` — 73 |
| `/birthday/february-25` — 3 | `/tarot-birth-card` — 80 |
| `/bearing` — 4 | `/tarot/ten-of-swords` — 82 |
| `/birthday/january-26` — 8.5 | `/blog/tarot-birth-card` — 87 |
| `/personal-year-card/justice` — 10.5 | `/tarot` — 89 |
| `/month/2026-08` — 14 | `/tarot/six-of-wands` — 93 |
| `/birthday` — 27.7 | `/tarot/three-of-swords` — 95 |

Everything proprietary ranks. Everything generic doesn't. The `/tarot/*` card pages are
competing with Biddy Tarot and Labyrinthos on terms like "page of cups reversed" — a
multi-year fight. `/birthday/*` and `/personal-year-card/*` rank top-10 immediately because
nobody else has those pages. This validates the 2026-07-13 internal-linking overhaul: the
rescued orphan pages are the ones producing the good positions.

Top queries are all birth-card cluster ("tarot birth card" 4 impr, "birth tarot card" 3,
"birth cards" 2, "my tarot card" 2) plus incidental card-name traffic.

### Checked and cleared

- **Apex/www split.** `https://tarotalmanac.com/tarot/six-of-wands` appears as a separate row
  from the www pages. Verified: apex returns a clean 308 to www and the canonical tag points to
  www. Legacy GSC attribution, not a live leak.
- **`/me` indexed.** Shows 1 impression at pos 20. Verified `robots: { index: false }` is set in
  `app/me/page.tsx`. Normal deindex lag.
- **Mobile pos 18.5 vs desktop 75.7.** Almost certainly query mix on a 33-impression sample,
  not a mobile advantage. Do not act on this until it holds at volume.

### Action taken

- **Fixed birth-card cannibalization.** `/tarot-birth-card` (16 impr, pos 80) and
  `/blog/tarot-birth-card` (11 impr, pos 87) were both indexed and both opening their titles on
  the head term "tarot birth card", splitting signal on the site's #1 query. The page bodies are
  genuinely different — the blog is a 1,259-word authored method comparison, not a thin
  duplicate — so no redirect. Retitled the blog's `seoTitle`/`metaDescription` in `lib/blog.ts`
  to own the method-comparison intent (Personality/Soul, Mary Greer, "why is my card
  different"); the hub keeps the head term and the calculator intent.

### Open / next

- **Watch the split.** By 2026-07-27, `/tarot-birth-card` should hold or improve on "tarot birth
  card" while `/blog/tarot-birth-card` starts appearing on method queries instead. If both are
  still stuck in the 80s on the same query, the fix wasn't enough and the blog needs to lose the
  term from its H1 too.
- **Blog H1 still collides.** The post's visible title is "What Is Your Tarot Birth Card?", which
  is still the head term. Left alone — titles are voice, Tali's call. Worth changing if the
  metadata fix alone doesn't separate them.
- **Stop optimizing `/tarot/*` for generic card queries.** Their job is internal-link equity and
  converting visitors who arrive via the calculator, not ranking for "8 of cups."
- **Push the pages already at pos 3–12.** `/birthday/*` especially — several dates already top-10
  and it's the stated highest-ROI target. These are one nudge from page-1 clicks, which is where
  the first real click data will come from.

### Baseline to beat next week

Impressions 111 · clicks 0 · avg position ~45 · 39 pages · 55 queries.
First click is the milestone to watch for.
