# Blog ideas — ranked backlog

Maintained by the weekly Blog Topic Scout (the `blog` skill, Stages 1–2 only). Research and
proposals only: nothing here is a decision, and no post gets written until Tali picks one.

**Last run:** 2026-08-31. Entry format is the one defined in the blog skill's Search stage.

---

## Account (verified against the files, 2026-08-31)

All **13 entries in `lib/blog.ts` are published** (uncommented), and all 13 `content/blog-*.md`
files are registered. There are **no dormant scaffolds**. Last week's #2 shipped: the birth-year
post went live 2026-08-24 as blog-13 (`38fd52a` wired its reciprocal links).

| # | Slug | Owns (search intent) |
|---|---|---|
| 01 | `what-is-tarot-numerology` | "what is tarot numerology", why your birth card differs |
| 02 | `how-tarot-numerology-works` | the full formula: year / month / day cards |
| 03 | `the-shadow-and-the-reclaiming` | reversed tarot card meanings |
| 06 | `2027-tarot-year-card` | "2027 tarot year card" (the CARD term), Justice |
| 12 | `2027-universal-year-number` | "universal year number 2027" (the NUMBER term) |
| 07 | `major-arcana-three-stages` | the Fool's journey, three stages |
| 08 | `tarot-birth-card` | Personality/Soul method, Mary Greer, "why is my birth card different" |
| 09 | `life-path-number-tarot` | "life path number tarot" |
| 04 | `what-is-a-tarot-bearing` | "tarot bearing" (proprietary term) |
| 05 | `the-tarot-natal-chart` | "tarot natal chart" / "tarot birth chart" |
| 11 | `personal-year-number-tarot` | "personal year number" (the NUMBER term) |
| 10 | `personal-month-number-tarot` | "personal month number" (the NUMBER term) |
| 13 | `birth-year-tarot-card` | "birth year tarot card" (the collective card of your year) |

**Housekeeping found while accounting** (this doc is still the only file the scout touches, so
none of it is fixed here):

- The stale blog-12 comment flagged last week is **still there**: `lib/blog.ts:170` reads
  "DRAFTED 2026-08-17, NOT PUBLISHED — commented out pending the Illustrate and Review gates,"
  and the entry below it is live. Second week running. It is exactly the drift the golden rule
  warns about, and it is a one-line delete.
- blog-13's block comment says three things are "STILL OWED." Two of them are **done**:
  the reciprocal links from blog-09 (`"a card of its own"`) and blog-11 (`"the one you were
  born in"`) are both wired. The third is real: `app/tarot-birth-chart/page.tsx` has **no
  "Related" line** pointing at the birth-year post. Worth updating the comment so it stops
  claiming credit for work already done.
- **Illustrate is still owed on blog-12** (no inline figures, no `lib/blogSocialContent.ts`
  entry). Unchanged since 2026-08-17.

**The split rule that keeps recurring, and that every new candidate must respect:** the
calculator HUBS (`/tarot-birth-card`, `/personal-month-card`, `/personal-year-card`,
`/birthday`, `/month`) own the card/calculator terms. Blog posts enter through the adjacent
NUMEROLOGY term and take the comparison at full length. Where that discipline slipped
(blog-08 vs the birth-card hub) both pages sat stuck at position ~82 for a month, and
three weeks later they are still parallel at 75 / 77.6. See `docs/SEARCH_PERFORMANCE.md`.

**One draft exists outside the registry:** `content/drafts/every-us-presidents-bearing.md`
(uncommitted, unchanged since 2026-07-13). Tracked below as in-flight.

**What the search log says to weight this round** (`docs/SEARCH_PERFORMANCE.md`, 2026-08-31):

- **`/month/2026-09` is the site's engine**: pos 8.93, 150 impressions, 16 clicks — **26% of
  every click the site has ever taken, on one page**. The seasonal read is now proven rather
  than suspected: get a month page indexed and onto page 1 *before* its month and it prints.
- The daily-rate high held (~125/day), so the Aug 9–15 soft week was a blip, not a trend.
- Two implications for topic choice. First, **the page type that earns has no editorial
  companion**: verified this week that `app/month/` contains **no links to any blog post at
  all**, and no post is about the collective month card. That's a new candidate, below at #2.
  Second, the standing note holds that the daily product still has nothing walking a reader to
  `/today` — which is what the #1 candidate is for.

---

## Ranking this week (2026-08-31)

| | Candidate | Priority | Change |
|---|---|---|---|
| 1 | Your personal day number and your tarot card | high | unchanged at 1, case got sharper |
| 2 | The tarot card of the month, and where it comes from | medium-high | **new this week** |
| 3 | Every US President's Bearing | medium-high | unchanged, seven weeks waiting on Tali |
| 4 | Master numbers 11 and 22 | medium-high | unchanged, contradiction now sharper |
| 5 | Compatibility by birthday | high, blocked | still blocked; engine unbuilt (roadmap) |
| 6 | Zodiac card vs birthday card | medium | unchanged |
| 7 | Every famous person's Bearing | low-medium | unchanged |
| 8 | The four suits and four elements | low | unchanged, still a paragraph not a post |
| 9 | Your 2028 tarot year card | low now, high Aug 2027 | unchanged |
| — | ~~The card of the year you were born~~ | **published** | shipped 2026-08-24 as blog-13 |

Compatibility stays at 5 on *sequencing*, not merit. Re-verified 2026-08-31: both roadmap items
("Paid compatibility reading", "Birth-card compatibility post") are still open and unbuilt.

---

## Your Personal Day Number and Your Tarot Card
- Status: idea (carried from 2026-08-24, where it also ranked first)
- Intent: someone who has met the personal-year and personal-month idea wants the same thing for
  today. Daily-ritual intent, which is repeat-visit intent, which is the only intent on this list
  that matches what a subscription actually sells.
- Head term: **personal day number** (+ "personal day number tarot card", "how to calculate your
  personal day number", "what tarot card is today for me", "tarot card of the day numerology")
- Competition & gap: re-surveyed 2026-08-31 and the incumbent set is stable and shallow —
  numerology.com (which owns the term and runs the free daily-number tool), sunsigns.org,
  affinitynumerology, birthcharthoroscopes, astrologyk, bejandaruwalla. The adjacent daily-tarot
  SERP is a different crowd entirely (tarot.com's card of the day, YourTango and Storizen
  churning a dated tarotscope every 24 hours). Neither side crosses over: search the number term
  and you get digits with no cards; search the card term and you get shuffle widgets with no
  arithmetic.
- **What the re-survey added, and it's the reason this stayed at #1.** The incumbent formula is
  now pinned down, printed the same way across numerology.com and astrologyk: reduce the birth
  month, birth day, current month, current day and current year, add the five, reduce again.
  **Those are the same five inputs the Almanac uses.** Identical ingredients, one arithmetic step
  apart, and the two answers diverge completely. That is the sharpest version of the sibling
  series' argument yet, because there is nothing to explain away: same date, same birthday, same
  five numbers.

  Verified against `lib/almanac.ts` for a March 15 birthday across September 2026: the incumbent
  method yields **9 distinct values, repeating exactly every nine days** (2 3 4 5 6 7 8 9 1 2 3 …),
  while the Almanac's personal day card reaches **all 22 Majors inside that one 30-day month**.
  Two further facts only we can print: the day card also carries a **Minor** (Sept 1 is the Tower
  with the Queen of Wands — rank plus a suit tethered to the day-Major's element), which no
  competitor produces at all, and the **Bearing gap holds at the day level** (personal day minus
  collective day equals the Bearing, the Moon, on all 30 days, checked). That last one is the
  site's whole spine landing on the smallest unit.
- Internal links: blog-11 (personal year) and blog-10 (personal month) are the direct siblings and
  should both link here, completing life path → year → month → day; blog-02 for the formula;
  blog-01 for the cornerstone. CTA to **`/today`**.
- No cannibalization risk: there is **no `/personal-day-card` hub** (re-verified against `app/`,
  2026-08-31), so unlike the year and month posts this one has no sibling hub to collide with. If
  a day hub is ever built, this post keeps the number term and the hub takes the card term.
- Absorbs the old "Card of the Day, Without Shuffling" entry, which entered on the unwinnable
  product head term and is a paragraph here rather than a post.
- Priority: **high** — completes the sibling series, enters on a term whose incumbents all stop at
  a digit, the arithmetic is verified and unusually vivid (nine days versus twenty-two cards), and
  it is the only candidate whose CTA is the subscription product rather than a free calculator.

## The Tarot Card of the Month, and Where It Comes From
- Status: idea (**new 2026-08-31**)
- Intent: someone who wants to know what *this month* holds, arriving on the commonest phrasing
  in the whole seasonal lane. Also the reader who lands on a `/month/[ym]` page and wants to know
  where that card came from, which right now nothing on the site tells them.
- Head term: **tarot card of the month** (+ "monthly tarot forecast", "what tarot card represents
  each month", "tarot card for September 2026")
- Competition & gap: the SERP is monthly *tarotscope* content and it is crowded at the top —
  tarot.com, horoscope.com, YourTango, truthstar, Vogue Adria — all of it a reader-drawn spread
  or a twelve-signs listicle, republished every month. Underneath that sits a genuinely unanswered
  question: "what are the corresponding tarot cards for each month of the year" is a **Quora**
  question, which is where questions go when nobody has written the page. The only published
  answers are editorial correspondence tables (month → card by vibe) or personal-month arithmetic
  aimed at *you*, not at the month. **Nobody derives a card for the calendar month itself.**

  We do, and it is verified against `lib/almanac.ts`: 2026's twelve collective months walk
  **twelve distinct Majors** (January Justice → December the Fool), where the reduced universal
  month method reaches **nine and starts repeating in September** (2 3 4 5 6 7 8 9 1 2 3 4). The
  second asset is the year-on-year walk: September steps forward exactly one card a year — Death,
  Temperance, the Devil, the Tower, the Star, the Moon, **the Sun (2026)**, Judgement, the World,
  the Fool — then the decade turn drops it back to Temperance in 2030. Over 2000–2050 the
  collective month reaches all 22.
- Why it's here this week: `/month/2026-09` just took **26% of the site's clicks**, and
  `app/month/` links to **no blog post at all** (verified). The top-earning page type has no
  explainer behind it and no editorial page feeding it. This post is that page, and it is
  evergreen underneath a seasonal engine that reliably prints.
- Cannibalization: real and manageable, the same split the series already runs. The `/month/[ym]`
  hubs own the **dated** terms ("September 2026 tarot"); this post owns the **evergreen method**
  term and must keep its `seoTitle`, H1 and slug off any specific month. Distinct from blog-10,
  which is the *personal* month; this is the *collective* month, the same personal-vs-collective
  split blog-13 just drew for the year.
- Internal links: blog-02 (the formula) is the parent; blog-10 (personal month) is the mirror and
  should link here; blog-13 (birth year) is the collective-card sibling; blog-06 for the year
  above it. CTA to `/month`, and the post is the natural place to wire the reciprocal link back
  from the month pages that currently link nowhere.
- Priority: **medium-high** — a fresh term with an argument nobody has made, sitting directly
  under the page type that earns most of the site's clicks. Held below the personal-day post
  because the head term has real incumbents with strong domains, and because its job is as much
  internal support as new capture.

## Every US President's Bearing
- Status: **in-flight** (drafted, uncommitted, `content/drafts/every-us-presidents-bearing.md`,
  untouched since 2026-07-13)
- Intent: not a search play. Link bait, brand-vocabulary seeding, and a public demonstration
  that the Bearing is arithmetic anyone can check.
- Head term: none worth chasing ("presidents tarot cards" is negligible volume). Any traffic
  comes from shares and from the term "Bearing" spreading.
- Competition & gap: nobody has run this, because nobody else has a year-free birthday number
  to run. The Chester Arthur line (his Bearing survives the disputed birth year) is the proof
  the whole piece rests on.
- Internal links: blog-04 is the natural parent; the piece should CTA to `/bearing`.
- Priority: **medium-high** — furthest along of anything here, and it does a job no SEO post does.
  Needs Tali's read on the political-commentary temperature, which is why it stays a draft.
  **Seven weeks parked.** It wants a yes or a no rather than another week of drift; if the answer
  is no, say so and it moves to "deliberately not proposed" and stops appearing every week.

## Master Numbers 11 and 22, and What the 22-Card Wheel Does With Them
- Status: idea
- Intent: someone who knows their life path is a master number wants to know which card it
  maps to, and why the answer they got elsewhere feels arbitrary.
- Head term: **master number tarot card** (+ "life path 11 tarot birth card", "life path 22
  tarot birth card", "what tarot card is master number 11")
- Competition & gap: numerologist.com largely owns the term with a dedicated page per number;
  thesecretofthetarot, tarotreveal, darkforesttarotcards and lifescriptdoctor fill in around it.
  Re-surveyed 2026-08-31 and the contradiction noted last week is now **between the top results,
  not just inside one page**: numerologist.com's own pages say life path 11 → **Justice** and life
  path 22 → **the Fool**, while the neighbouring results say that for birth-card purposes master
  numbers keep reducing, so 11 → 2 (**the High Priestess**) and 22 → 4 (**the Emperor**). Both
  answers are published as fact on page one of the same query. Neither side can resolve it,
  because a nine-slot system has no position 11 or 22 to put anyone in; the reduction is forced by
  the container, then rationalised. Our wheel resolves it by construction, verified:
  `mod22(11) = 11` (Justice), `mod22(22) = 0` (the Fool) — the same two answers the better
  incumbents reach, arrived at rather than asserted, and the "dual numbering, both 0 and 22" hedge
  stops being a hedge. Bonus vocabulary worth borrowing: their framing of 11 as the exact centre
  of the Major Arcana, every pair equidistant from it summing to 22, is true on our wheel too.
- Internal links: blog-09 (life path) is the direct parent and should link here; blog-08, blog-02
  and blog-12 (which argues the 11-versus-2 fold at length) all touch it. Watch that overlap:
  blog-12 owns the *year* fold, this owns the *life path* fold.
- Priority: **medium-high** — low effort, low competition, slots straight into the sibling series,
  and a live contradiction between two page-one results is a strong opening. Held down by volume:
  a narrow long-tail question wins a small pot.

## Tarot Compatibility by Birthday: two Bearings on one wheel
- Status: idea (product-dependent, **still blocked**)
- Intent: two people want to know what their birthdays say about them together. Very high
  commercial and shareable intent; the single biggest untapped acquisition term adjacent to the
  site's core math.
- Head term: **tarot birth card compatibility** (+ "tarot compatibility by birthday", "do we have
  the same birth card", "tarot birth card compatibility calculator")
- Competition & gap: tarot.com, loveproject, mysticmondays, escapeboundaries and a long tail of
  calculators, all of which compute both people's birth cards and then describe the two cards side
  by side. Nobody computes the *relationship* as its own number. We can, and it is already a
  settled primitive: the gap between two Bearings on the 22-wheel, with the distance band
  (`min(B, 22-B)`) as the reading. A genuinely new unit in this space, checkable, and gift-shaped,
  which matters because charts are the giftable product.
- Internal links: blog-04 (Bearing) is the parent, blog-08 and blog-09 both hand off here,
  blog-05 (natal chart) for the upsell.
- Priority: **high, but blocked.** Re-verified 2026-08-31 that both roadmap items are still open
  and the engine is unbuilt. Writing the post first would send its traffic to a page with nothing
  to do. Sequence it after the engine.

## Your Zodiac Sign's Tarot Card vs the Card Your Birthday Actually Makes
- Status: idea
- Intent: high-volume curiosity ("what tarot card am I") arriving through the astrology door,
  which is the door most people know.
- Head term: **tarot card for your zodiac sign** (+ "what tarot card represents my zodiac sign",
  "zodiac tarot correspondences", "is my tarot card my sun sign")
- Competition & gap: Labyrinthos, Biddy, Deckaura, PaganGrimoire, masteringthezodiac. Deep,
  well-linked, and they own the correspondence tables outright. Do not try to out-table them. The
  winnable angle is the comparison itself: the sign gives twelve buckets and a month-long window;
  the birthday gives a specific number and a specific card, and the two answers disagree for most
  people. That framing is ours and nobody on the SERP makes it.
- Internal links: blog-01 and blog-08; CTA to `/birthday/[month-day]`, the page type already
  carrying most of our page-1 rankings.
- Priority: **medium** — biggest audience on the list, hardest SERP, and it borrows authority from
  astrology rather than building ours. Worth doing once, framed as the comparison, not the table.

## Every Famous Person's Bearing (the celebrity version of the presidents piece)
- Status: idea
- Intent: browsing curiosity, arriving through a name people already search.
- Head term: **celebrity tarot birth cards** (+ "Taylor Swift tarot birth card", "celebrity birth
  card", "what is [name]'s tarot card")
- Competition & gap: **Biddy Tarot owns this outright**, with Starsinsider and its MSN syndication
  next to it. Biddy's own page states the ceiling out loud, that there are "only twelve possible
  combinations" of birth cards, which is the exact limitation the sibling series exists to argue
  with. Their celebrity list can only ever sort famous people into twelve buckets; a Bearing sorts
  them into twenty-two without needing a birth year at all, which matters here because celebrity
  birth years are exactly the fact that gets disputed.
- Internal links: blog-04 (Bearing) is the parent; the presidents piece, if it ships, is the
  sibling. CTA to `/bearing`.
- Priority: **low-medium** — the job it does is already being done by the presidents draft, which
  is further along and doesn't have Biddy sitting on its term. Keep it as the follow-up if the
  presidents piece lands, not as competition for it.

## The Four Suits and the Four Elements
- Status: idea
- Intent: beginner reference lookup.
- Head term: **tarot suits meanings** (+ "tarot elements", "what element is each tarot suit")
- Competition & gap: Biddy and Labyrinthos own this at the top and it is one of the most saturated
  beginner terms in tarot. Our only distinct claim is small: the Almanac tethers the day's minor
  suit to the day-Major's element (Fire→Wands, Water→Cups, Air→Swords, Earth→Pentacles), so the
  suit isn't chosen, it follows. One good paragraph, not a post.
- Internal links: blog-02. The personal-day candidate needs exactly this paragraph, so if that
  post is written, this stops being a candidate at all.
- Priority: **low** — write it as a section inside another post, or as a `/tarot` hub improvement.

## Your 2028 Tarot Year Card
- Status: idea (scheduled, not now)
- Intent: the same seasonal engine that made blog-06 work, one year on. `collectiveYear(2028) = 12`
  = the Hanged One (verified against `lib/almanac.ts`).
- Head term: **2028 tarot year card** (+ "2028 numerology", "what is the tarot card for 2028")
- Competition & gap: empty SERP today, which is the whole point. blog-06 was published 2026-08-04
  for exactly this reason: get indexed before the competitors do. tarot.com publishes a per-year
  ruling-card page whose method agrees with ours, so it will eventually arrive here; our runway is
  a lead, not a moat.
- Internal links: blog-06, blog-11, blog-12 (the number door, if it gets a 2028 sibling).
- Priority: **low right now, high in August 2027** — blog-06 shipped roughly sixteen months ahead
  of its year and had page-one traction in days. Same lead time puts this at August 2027. Listed
  so the timing isn't missed. Note this is the *only* dated candidate left, so between now and
  then the seasonal lane belongs to the `/month/[ym]` pages, not the blog.

---

## Published from this backlog

- **The Card of the Year You Were Born** → shipped 2026-08-24 as blog-13,
  `/blog/birth-year-tarot-card`. Ranked second the week it was picked. Still owed: a "Related"
  line from `/tarot-birth-chart`.
- **Your 2027 Numerology: the Universal Year Number** → shipped 2026-08-17 as blog-12,
  `/blog/2027-universal-year-number`. Topped this list for four consecutive weeks. Still owed the
  Illustrate stage (no figures, no social entry).

## Better as an upgrade to an existing page, not a new post

Found while surveying, worth recording so they don't get re-proposed as posts every week.

- **"Why do tarot birth card calculators disagree?"** The live SERP is a mess in a useful way: The
  Tarot School, HowStuffWorks, tarot.com, arcanacalculator and healingthrutarot all describe
  *different* reduction conventions, and arcanacalculator says the quiet part out loud — there is
  "no single universal Arcana Number method accepted by every tarot reader." A real, high-intent
  question with no clean answer ranking for it. But it is **blog-08's ground already**, so the
  move is a section inside blog-08 naming the specific conventions and what each one throws away,
  plus an FAQ row on the `/tarot-birth-card` hub. A separate post would re-open the
  cannibalization the 2026-07-20 → 08-03 thread just closed.
- **The four suits and the four elements** (its own entry above, same reason).
- **blog-12's figures and social assets.** Not a topic, a finished-work item: the post is live
  without the Illustrate stage. Cheaper than any new post on this list, and it lifts a page that
  has a seasonal audience coming.
- **A blog link from the `/month/[ym]` pages.** Verified this week that they carry none, on the
  page type earning 26% of the site's clicks. If the collective-month post above is written it
  becomes the obvious target; if it isn't, blog-02 should be linked there anyway.

## Deliberately not proposed

- **Anything targeting "tarot birth card" head-on.** Two of our pages already sat tied at position
  ~82 on it, and three weeks after the split they are still parallel at 75 and 77.6. A third page
  would make it worse.
- **A dated month post** (e.g. "September 2026 tarot"). The `/month/[ym]` pages own that term and
  are the site's best performer on it. A blog post on the same dated ground would split the signal
  on the one thing currently working.
- **"Your birth month tarot card."** Parade owns the term twice over (a Major version and a Minor
  Arcana version, both syndicated to Yahoo), and **we would have to invent the mapping.** Their
  card-per-month assignments are editorial picks, not derived, and the Almanac has no
  birth-month-only card: month and day are read together. Writing it would mean generating a
  correspondence the arithmetic can't back, which the project's rules forbid.
- **Generic card-meaning posts** (individual Majors, spreads, "how to read tarot").
  `/tarot/[slug]` covers all 78 and still cannot crack page one; blog posts on the same ground
  would compete with our own cards, not with the incumbents. Note the 2026-08-31 log's finding
  that these pages pull real *browsing* traffic (19 Vercel visitors) without ranking — product
  value, not SEO value, and that's fine as-is.
- **Angel numbers, twin flames, manifestation numerology.** Adjacent volume, wrong system, and it
  would put copy in front of readers that the arithmetic can't back.
