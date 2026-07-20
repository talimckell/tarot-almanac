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
