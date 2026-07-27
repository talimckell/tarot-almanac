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
