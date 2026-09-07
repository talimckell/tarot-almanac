# Blog ideas — ranked backlog

Maintained by the weekly Blog Topic Scout (the `blog` skill, Stages 1–2 only). Research and
proposals only: nothing here is a decision, and no post gets written until Tali picks one.

**Last run:** 2026-09-07. Entry format is the one defined in the blog skill's Search stage.

---

## Account (verified against the files, 2026-09-07)

All **13 entries in `lib/blog.ts` are published** (uncommented), and all 13 registered
`content/blog-*.md` files exist. There are **no dormant scaffolds inside `lib/blog.ts`**.

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

### The headline finding this week: blog-14 exists and is nearly finished

**A fourteenth post was drafted on 2026-08-31 and is sitting on an unmerged branch**, which last
week's account missed because it landed the same day. Verified this run:

- Branch `blog-14-wedding-date-tarot-card`, one commit (`60155db`, 2026-08-31), also pushed to
  `origin`. Slug `wedding-date-tarot-card`, H1 "The Card of the Day You Met".
- `content/blog-14-wedding-date-tarot-card.md`, **1,598 words**, in range for its siblings.
- **Illustrate is done, contrary to the entry's own comment.** Two figures
  (`public/date-to-card.svg`, `public/anniversary-walk.svg`) with their generator
  (`scripts/gen-wedding-date-diagrams.mjs`), plus a full `lib/blogSocialContent.ts` entry at
  line 742. The `lib/blog.ts` comment still says "No figures and no `lib/blogSocialContent.ts`
  entry yet: Illustrate is the next gate," and that is now wrong in the same way blog-12's
  comment is wrong.
- The `lib/blog.ts` entry is **correctly commented out**, awaiting the Review gate.
- Three things are genuinely open, and all three are Tali's call, not mechanical: the `section`
  (set to "your-cards", whose authored intro says "the day you were born," while this post is
  about dates that aren't your birthday), the `majorIndex` (6, the Lovers, chosen as the legible
  couples glyph, though the post's actual worked card is the Hierophant), and the CTA, since
  `/today` can't serve a wedding date in a future month under the time-travel rule.
- **The branch is stale.** It was cut before `/pricing`, `/vs/*`, `llms.txt` and the
  organization-schema work landed, so `git diff main..blog-14` reads as 1,741 deletions. It needs
  a rebase before it can merge, and that is a real (if small) piece of work.

So the honest answer to "what should the next post be" starts here: **the next post is already
written.** Everything below is what comes after it.

**One other draft outside the registry:** `content/drafts/every-us-presidents-bearing.md`
(uncommitted, unchanged since 2026-07-13). Tracked below as in-flight, now eight weeks parked.

### Housekeeping found while accounting

This doc is still the only file the scout touches, so none of it is fixed here.

- **blog-12's stale comment, third week running.** `lib/blog.ts:170` still reads "DRAFTED
  2026-08-17, NOT PUBLISHED — commented out pending the Illustrate and Review gates," above a live
  entry. It is a one-line delete.
- **blog-12's figures shipped, and the same comment still denies it.** Verified: the post carries
  two inline figures, `public/2027-eleven-two-ways.svg` and `public/2027-decade-drift.svg`, so the
  Illustrate item flagged here for three weeks is **half done**. What's still missing is only the
  `lib/blogSocialContent.ts` entry (that file has 11 entries; blog-12 and blog-13 are both absent).
  Line 199's "No figures yet" needs deleting along with line 170.
- **blog-13's last owed item is still owed.** `app/tarot-birth-chart/page.tsx` has no "Related"
  line pointing at `/blog/birth-year-tarot-card`; re-verified by grep, the only references to that
  slug anywhere in `app/` and `lib/` are the two reciprocal links inside `lib/blog.ts`.
- **`app/month/` still links to no blog post at all.** Re-verified. Third week on the page type
  earning the largest share of the site's clicks.
- **No new `docs/SEARCH_PERFORMANCE.md` entry this week** (newest is still 2026-08-31), so the
  search evidence below is a week old and the weekly GSC export looks like it was skipped. Nothing
  in the ranking turns on a single week, but the `/month/2026-10` watch item from last week is
  unanswered.
- **New, and it matters for one candidate below: the moon phase labels don't follow the common
  convention.** `moonPhase()` in `lib/almanac.ts` picks the *nearest* cardinal phase, so it prints
  "New moon", "First quarter", "Full moon" or "Last quarter" on **exactly 50.0% of all days**
  (checked across 2020–2029), where consumer moon sites reserve those four names for a moment and
  call the days between them crescent or gibbous. Worked case: 20 July 1969 reads "First quarter"
  in our engine at a moon age of 5.8 days, and every moon-phase site calls that day a waxing
  crescent. The underlying arithmetic is fine (mean synodic month, and the age is right); it's the
  bucketing that disagrees. Not urgent for `/today`, but it rules out the moon candidate below
  until the buckets are changed.

**The split rule that keeps recurring, and that every new candidate must respect:** the
calculator HUBS (`/tarot-birth-card`, `/personal-month-card`, `/personal-year-card`,
`/birthday`, `/month`) own the card/calculator terms. Blog posts enter through the adjacent
NUMEROLOGY term and take the comparison at full length. Where that discipline slipped
(blog-08 vs the birth-card hub) both pages sat stuck at position ~82 for a month, and
three weeks later they were still parallel at 75 / 77.6. See `docs/SEARCH_PERFORMANCE.md`.

### What the search log says to weight this round (2026-08-31 data, one week old)

- **`/month/2026-09` is the site's engine**: pos 8.93, 150 impressions, 16 clicks — 26% of every
  click the site has ever taken, on one page. Get a month page indexed and onto page 1 *before*
  its month and it prints.
- The daily impression rate held at ~125/day, so the Aug 9–15 soft week was a blip.
- The implication for topic choice is unchanged and now has a second leg: the page type that earns
  has no editorial companion, and the seasonal pattern it proves also applies to the collective
  month post at #2, whose own peak is the New Year year-ahead window rather than any single month.

---

## Ranking this week (2026-09-07)

| | Candidate | Priority | Change |
|---|---|---|---|
| — | The Card of the Day You Met (wedding dates) | **in-flight, at Review** | **found this week**; drafted, illustrated, needs a rebase and Tali's read |
| 1 | Your personal day number and your tarot card | high | unchanged at 1, third week |
| 2 | The tarot card of the month, and where it comes from | medium-high | unchanged rank; **timing sharpened, wants an October write** |
| 3 | Every US President's Bearing | medium-high | unchanged, **eight weeks** waiting on Tali |
| 4 | Master numbers 11 and 22 | medium | **down** from medium-high; the SERP contradiction has resolved against the entry's angle |
| 5 | Compatibility by birthday | high, blocked | still blocked; engine unbuilt (roadmap) |
| 6 | Zodiac card vs birthday card | medium | unchanged |
| 7 | Every famous person's Bearing | low-medium | unchanged |
| 8 | The four suits and four elements | low | unchanged, still a paragraph not a post |
| 9 | Your 2028 tarot year card | low now, high Aug 2027 | unchanged |
| — | ~~The moon phase on your birthday~~ | **not proposed** | surveyed this week, rejected; see below |

Compatibility stays at 5 on *sequencing*, not merit. Not re-verified this week (last checked
2026-08-31: both roadmap items open and unbuilt); nothing suggests that changed.

---

## The Card of the Day You Met (wedding dates)
- Status: **in-flight, at the Review gate.** Branch `blog-14-wedding-date-tarot-card`, drafted
  2026-08-31, 1,598 words, two figures, social assets wired, registry entry commented out.
- Intent: couples choosing or commemorating a date. Commercial, gift-shaped, and seasonal in a
  way nothing else on this list is (engagement season runs late November to Valentine's Day).
- Head term: **wedding date numerology** (+ "wedding date tarot card", "what does my wedding date
  mean", "anniversary tarot card")
- Competition & gap: surveyed this week and it is a **calculator SERP, not an editorial one** —
  The Knot on top, then spells8, destify, phuture.me, tarostarot, askAstrology, Tarot With Lavanya,
  all running the same fold to one digit and all built to answer "is this a lucky date." Nobody
  produces a *card* for a wedding date. The draft's two assets are both absent from the whole
  first page: a date kept whole resolves to a Major with a Minor under it, and the anniversary
  walks one card a year rather than looping through nine.
- **The one thing to watch in Review, a voice question rather than an SEO one:** the incumbents
  win this term by grading dates. The Knot's neighbours print that 6 and 2 are the best wedding
  numbers and that 7, 9 and sometimes 5 are unfriendly. That is exactly the predicting-events
  register the voice doc bans, so the post cannot answer the question the searcher is actually
  asking. Worth Tali deciding deliberately whether the mismatch is a feature (it's the honest
  version, and the fold's "forty other days get this answer" line is the argument against grading)
  or a bounce risk.
- Internal links: blog-01 for the fold, blog-02 for the formula, blog-13 as the collective-card
  sibling. CTA is `/today`, with the caveat already flagged in the entry's comment that the
  time-travel rule can't serve a future wedding date.
- Priority: **highest-value next action on this list**, because it is the only candidate whose
  writing and illustrating are already paid for. What it needs is a rebase onto current `main`,
  three small owner decisions (section, glyph, CTA), and a yes.

## Your Personal Day Number and Your Tarot Card
- Status: idea (carried from 2026-08-24 and 2026-08-31, where it also ranked first)
- Intent: someone who has met the personal-year and personal-month idea wants the same thing for
  today. Daily-ritual intent, which is repeat-visit intent, which is the only intent on this list
  that matches what a subscription actually sells.
- Head term: **personal day number** (+ "personal day number tarot card", "how to calculate your
  personal day number", "what tarot card is today for me", "tarot card of the day numerology")
- Competition & gap: re-surveyed 2026-09-07 and the incumbent set is stable and shallow —
  numerologist.com and numerology.com own the term and both run a free personal-day calculator,
  with affinitynumerology, birthcharthoroscopes and sunsigns.org underneath. The adjacent daily
  tarot SERP is a different crowd (tarot.com's card of the day, plus the churned daily
  tarotscopes). The two still don't cross: search the number term and you get digits with no
  cards, search the card term and you get shuffle widgets with no arithmetic. The one bridge
  that exists is a hobbyist tool (`dailytarotcard.pythonanywhere.com`, "Tarot Card of the Day
  with Numerology calculator"), which is a page rank nobody is defending.
- **The argument, unchanged and still the sharpest on this list.** The incumbent formula is
  printed the same way everywhere: reduce the birth month, birth day, current month, current day
  and current year, add the five, reduce again. Those are the same five inputs the Almanac uses.
  Identical ingredients, one arithmetic step apart, and the answers diverge completely.

  Verified against `lib/almanac.ts` (2026-08-31) for a March 15 birthday across September 2026:
  the incumbent method yields **9 distinct values, repeating every nine days**, while the
  Almanac's personal day card reaches **all 22 Majors inside that one 30-day month**. Two further
  facts only we can print: the day card also carries a **Minor** (Sept 1 is the Tower with the
  Queen of Wands), which no competitor produces at all, and the **Bearing gap holds at the day
  level** (personal day minus collective day equals the Bearing, on all 30 days, checked). That
  last one is the site's whole spine landing on the smallest unit.
- Internal links: blog-11 (personal year) and blog-10 (personal month) are the direct siblings and
  should both link here, completing life path → year → month → day; blog-02 for the formula;
  blog-01 for the cornerstone. CTA to **`/today`**.
- No cannibalization risk: there is **no `/personal-day-card` hub** (re-verified against `app/`,
  2026-09-07 — the hubs there are `birthday`, `personal-month-card`, `personal-year-card`,
  `today`), so unlike the year and month posts this one has no sibling hub to collide with. If a
  day hub is ever built, this post keeps the number term and the hub takes the card term.
- Absorbs the old "Card of the Day, Without Shuffling" entry, which entered on the unwinnable
  product head term and is a paragraph here rather than a post.
- Priority: **high** — completes the sibling series, enters on a term whose incumbents all stop at
  a digit, the arithmetic is verified and unusually vivid, and it is the only candidate whose CTA
  is the subscription product rather than a free calculator. Note it now shares its `/today` CTA
  with blog-14, which is an argument for spacing them rather than against either.

## The Tarot Card of the Month, and Where It Comes From
- Status: idea (new 2026-08-31)
- Intent: someone who wants to know what *this month* holds, arriving on the commonest phrasing
  in the whole seasonal lane. Also the reader who lands on a `/month/[ym]` page and wants to know
  where that card came from, which right now nothing on the site tells them.
- Head term: **tarot card of the month** (+ "what tarot card represents each month of the year",
  "monthly tarot forecast", "tarot card for September 2026")
- Competition & gap: the SERP is monthly *tarotscope* content, crowded at the top — tarot.com,
  horoscope.com, YourTango, Vogue Adria — all of it a reader-drawn spread or a twelve-signs
  listicle. Underneath sits a genuinely unanswered question: "what are the corresponding tarot
  cards for each month of the year" is still a **Quora** question, which is where questions go
  when nobody has written the page. The published answers are editorial correspondence tables
  (month → card by vibe, Parade's being the syndicated one) or personal-month arithmetic aimed at
  *you*, not at the month. **Nobody derives a card for the calendar month itself.**

  We do, verified against `lib/almanac.ts`: 2026's twelve collective months walk **twelve distinct
  Majors** (January Justice → December the Fool), where the reduced universal month method reaches
  **nine and starts repeating in September**. The second asset is the year-on-year walk: September
  steps forward exactly one card a year — Death, Temperance, the Devil, the Tower, the Star, the
  Moon, **the Sun (2026)**, Judgement, the World, the Fool — then the decade turn drops it back to
  Temperance in 2030. Over 2000–2050 the collective month reaches all 22.
- **What the re-survey added: this post has a season, and it isn't the month it's about.** The
  competing intent for "a card for each month" is the **year-ahead spread** — twelve cards pulled
  for twelve months, one of the most established rituals in tarot, run by Biddy Tarot, Deckaura,
  Chai Bunny, Moli Tarot and a long tail of readers. Its window is fixed and public: the winter
  solstice, New Year's Day, and your birthday, per the incumbents' own instructions. That is a
  post whose honest opening is that the twelve are already dealt, and whose demand peaks
  late December through January. blog-06 shipped sixteen months early on exactly this logic and
  had page-one traction in days. **Write it in October, not December.**
- Why it's also an internal-linking fix: `/month/2026-09` took 26% of the site's clicks and
  `app/month/` links to no blog post at all. The top-earning page type has no explainer behind it.
- Cannibalization: real and manageable, the same split the series already runs. The `/month/[ym]`
  hubs own the **dated** terms; this post owns the **evergreen method** term and must keep its
  `seoTitle`, H1 and slug off any specific month. Distinct from blog-10, which is the *personal*
  month; this is the *collective* month, the same personal-vs-collective split blog-13 drew for
  the year.
- Internal links: blog-02 (the formula) is the parent; blog-10 (personal month) is the mirror and
  should link here; blog-13 (birth year) is the collective-card sibling; blog-06 for the year
  above it. CTA to `/month`, and the post is the natural place to wire the reciprocal link back
  from the month pages that currently link nowhere.
- Priority: **medium-high** — a fresh term with an argument nobody has made, sitting directly
  under the page type that earns most of the site's clicks, and with a dated write-by. Held below
  the personal-day post because the head term has real incumbents with strong domains, and because
  its job is as much internal support as new capture.

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
- Priority: **medium-high** on merit, and it does a job no SEO post does. But it is now **eight
  weeks parked** and it is no longer the furthest-along draft on this list, because blog-14
  overtook it in a day. It wants a yes or a no. If the answer is no, saying so moves it to
  "deliberately not proposed" and it stops appearing every week.

## Master Numbers 11 and 22, and What the 22-Card Wheel Does With Them
- Status: idea
- Intent: someone who knows their life path is a master number wants to know which card it
  maps to, and why the answer they got elsewhere feels arbitrary.
- Head term: **master number tarot card** (+ "life path 11 tarot birth card", "life path 22
  tarot birth card", "what tarot card is master number 11")
- Competition & gap, **re-surveyed 2026-09-07 and the read has changed.** Last week's entry
  rested on a contradiction between two page-one results. That contradiction has largely
  resolved: numerologist.com now holds the first page with **three separate dedicated pages**
  (life path 11 → Justice, life path 22 → the Fool, plus the general birth-card explainer), and
  its answers **agree with ours** — `mod22(11) = 11` and `mod22(22) = 0`, verified. The dissenting
  "master numbers keep reducing, so 11 → the High Priestess and 22 → the Emperor" position is
  still out there in the surrounding results, but it is no longer a head-to-head fight on page
  one. Agreeing loudly with the strongest incumbent is a much weaker opening than correcting it.

  What survived the re-survey, and is a better angle if this is ever written: the incumbents reach
  the right answers by assertion and then have to hedge, because a nine-slot system has no
  position 11 or 22 to put anyone in. Two pieces of their vocabulary are worth borrowing and are
  true on our wheel: eleven as the exact centre of the Major Arcana, with every pair equidistant
  from it summing to 22, and the Fool's "dual numbering" as both 0 and 22, which stops being a
  hedge on a wheel that wraps. A third thread the SERP raises and nobody resolves is the
  **Justice-at-VIII versus XI** split between Marseille/Thoth and Waite, which is a real question
  about *why a fixed order is needed at all* and is closer to this site's ground than the master
  numbers are.
- Internal links: blog-09 (life path) is the direct parent and should link here; blog-08, blog-02
  and blog-12 (which argues the 11-versus-2 fold at length) all touch it. Watch that overlap:
  blog-12 owns the *year* fold, this owns the *life path* fold.
- Priority: **medium** (down from medium-high) — still low effort and it slots into the sibling
  series, but the opening got weaker this week and the term was already a narrow long-tail pot.

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
- Note the adjacency to blog-14: the wedding post is the first thing on the site aimed at two
  people rather than one, and if it ships it becomes this post's natural parent.
- Internal links: blog-04 (Bearing) is the parent, blog-08 and blog-09 both hand off here,
  blog-05 (natal chart) for the upsell.
- Priority: **high, but blocked.** The engine is unbuilt (two open roadmap items as of
  2026-08-31). Writing the post first would send its traffic to a page with nothing to do.
  Sequence it after the engine.

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
  so the timing isn't missed.

---

## Published from this backlog

- **The Card of the Year You Were Born** → shipped 2026-08-24 as blog-13,
  `/blog/birth-year-tarot-card`. Ranked second the week it was picked. Still owed: a "Related"
  line from `/tarot-birth-chart`.
- **Your 2027 Numerology: the Universal Year Number** → shipped 2026-08-17 as blog-12,
  `/blog/2027-universal-year-number`. Topped this list for four consecutive weeks. Figures have
  since landed; the social entry has not.

## Better as an upgrade to an existing page, not a new post

Found while surveying, worth recording so they don't get re-proposed as posts every week.

- **"Why do tarot birth card calculators disagree?"** The Tarot School, HowStuffWorks, tarot.com,
  arcanacalculator and healingthrutarot all describe *different* reduction conventions, and
  arcanacalculator says the quiet part out loud: there is no single accepted method. A real,
  high-intent question with no clean answer ranking for it. But it is **blog-08's ground already**,
  so the move is a section inside blog-08 naming the specific conventions and what each one throws
  away, plus an FAQ row on the `/tarot-birth-card` hub. A separate post would re-open the
  cannibalization the 2026-07-20 → 08-03 thread just closed.
- **"Tarot numerology number meanings" (the 1–9 table).** Noticed this week that
  tarotmasterguide, hiddennumerology and numerologist.com all run a "tarot numerology" guide that
  is really a number-meanings table, and they are competing on our cornerstone term. Not a post
  (it is generic card-meaning ground, and blog-01 and blog-02 already own the term with better
  content), but the vocabulary is worth folding into blog-02 if it is ever revised.
- **The four suits and the four elements** (its own entry above, same reason).
- **blog-12's social assets.** Not a topic, a finished-work item: figures are in, the
  `lib/blogSocialContent.ts` entry is not, and blog-13 has no entry either.
- **A blog link from the `/month/[ym]` pages.** Third week verified as absent, on the page type
  earning 26% of the site's clicks. If the collective-month post above is written it becomes the
  obvious target; if it isn't, blog-02 should be linked there anyway.

## Deliberately not proposed

- **The moon phase on your birthday.** Surveyed 2026-09-07 because the demand is real and
  visibly commercial (positiveprints, themoonjoy, yourmoonphase, thatverynight, symboligy, most of
  them selling prints), and because `moonPhase()` in `lib/almanac.ts` already computes any date.
  Rejected on two counts. The smaller one is accuracy of naming: our labels use the nearest
  cardinal phase and so read "New moon / First quarter / Full moon / Last quarter" on 50.0% of
  days, which disagrees with every site a reader would check against (20 July 1969 reads "First
  quarter" here and "waxing crescent" everywhere else). The larger one is that the whole term is
  personality correspondence — what a full-moon birth *says about you* — and the Almanac derives
  no meaning from the moon at all. Writing it would mean inventing correspondence copy the
  arithmetic can't back, which is the same reason "your birth month tarot card" is refused below.
- **Anything targeting "tarot birth card" head-on.** Two of our pages already sat tied at position
  ~82 on it, and three weeks after the split they were still parallel at 75 and 77.6. A third page
  would make it worse.
- **A dated month post** (e.g. "September 2026 tarot"). The `/month/[ym]` pages own that term and
  are the site's best performer on it. A blog post on the same dated ground would split the signal
  on the one thing currently working.
- **"Your birth month tarot card."** Parade owns the term twice over (a Major version and a Minor
  Arcana version, both syndicated to Yahoo and AOL), and **we would have to invent the mapping.**
  Their card-per-month assignments are editorial picks, not derived, and the Almanac has no
  birth-month-only card: month and day are read together.
- **Generic card-meaning posts** (individual Majors, spreads, "how to read tarot").
  `/tarot/[slug]` covers all 78 and still cannot crack page one; blog posts on the same ground
  would compete with our own cards, not with the incumbents. These pages do pull real *browsing*
  traffic without ranking, which is product value rather than SEO value, and fine as-is.
- **Angel numbers, twin flames, manifestation numerology.** Adjacent volume, wrong system, and it
  would put copy in front of readers that the arithmetic can't back.
