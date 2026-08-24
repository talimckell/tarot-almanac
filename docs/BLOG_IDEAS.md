# Blog ideas — ranked backlog

Maintained by the weekly Blog Topic Scout (the `blog` skill, Stages 1–2 only). Research and
proposals only: nothing here is a decision, and no post gets written until Tali picks one.

**Last run:** 2026-08-24. Entry format is the one defined in the blog skill's Search stage.

---

## Account (verified against the files, 2026-08-24)

All **12 entries in `lib/blog.ts` are published** (uncommented), and all 12 `content/blog-*.md`
files are registered. There are **no dormant scaffolds left**. Last week's top pick shipped: the
2027 universal-year post was drafted and published the same day (`cadc48e`, 2026-08-17).

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

**Housekeeping found while accounting (not fixed here — this doc is the only file the scout
touches).** The block comment above the blog-12 entry in `lib/blog.ts` still reads "DRAFTED
2026-08-17, NOT PUBLISHED — commented out pending the Illustrate and Review gates," but the entry
below it is live and uncommented, and blog-06 and blog-11 both carry reciprocal links marked
"added when blog-12 went live." The file is right and the comment is stale. Worth a one-line edit
next time that file is open, since it is exactly the kind of drift the golden rule warns about.
Two other loose ends the comment names as post-publish chores: blog-12 has **no inline figures**
and **no `lib/blogSocialContent.ts` entry** yet, so the Illustrate stage is genuinely still owed
if it's wanted.

**The split rule that keeps recurring, and that every new candidate must respect:** the
calculator HUBS (`/tarot-birth-card`, `/personal-month-card`, `/personal-year-card`,
`/birthday`, `/month`) own the card/calculator terms. Blog posts enter through the adjacent
NUMEROLOGY term and take the comparison at full length. Where that discipline slipped
(blog-08 vs the birth-card hub) both pages sat stuck at position ~82 for a month. See
`docs/SEARCH_PERFORMANCE.md`, entries 2026-07-20 through 2026-08-10.

**One draft exists outside the registry:** `content/drafts/every-us-presidents-bearing.md`
(uncommitted, unchanged since 2026-07-13). Tracked below as in-flight.

**What the search log says to weight this round.** No new GSC entry since 2026-08-17, so the
standing read is unchanged: dated/seasonal content is the fast lane (`/blog/2027-tarot-year-card`
holding position 8.3), `/month/2026-08` is still the top earner, and the marginal week Aug 9–15
was the first genuinely down week since indexing began. Two implications for topic choice:

- **A receding impression pool argues for terms with no incumbent** over terms where Biddy,
  Labyrinthos or Parade are already seated.
- **Now that both 2027 doors are taken**, the timely lane has nothing left to sell until August
  2027 (the 2028 card). The next best thing is not "another dated post," it's the candidate that
  points at the *daily* product, because the daily reading is the thing a subscription is for and
  no blog post currently walks a reader to `/today`.

---

## Ranking this week (2026-08-24)

| | Candidate | Priority | Change |
|---|---|---|---|
| 1 | Your personal day number and your tarot card | high | **new this week**, straight in at the top |
| 2 | The card of the year you were born | medium-high | up from 4 |
| 3 | Every US President's Bearing | medium-high | unchanged, still waiting on Tali |
| 4 | Master numbers 11 and 22 | medium-high | unchanged, sharpened with a live SERP contradiction |
| 5 | Compatibility by birthday | high, blocked | still blocked; engine unbuilt (roadmap) |
| 6 | Zodiac card vs birthday card | medium | unchanged |
| 7 | Every famous person's Bearing | low-medium | unchanged |
| 8 | The four suits and four elements | low | unchanged, still a paragraph not a post |
| 9 | Your 2028 tarot year card | low now, high Aug 2027 | unchanged |
| — | ~~The card of the day, without shuffling~~ | merged | folded into #1, see that entry |
| — | ~~2027 universal year number~~ | **published** | shipped 2026-08-17 |

Compatibility drops from 2 to 5 on *sequencing*, not on merit: it is still the highest-value term
on the list, it is still blocked on the engine, and a blocked candidate sitting near the top every
week reads like a recommendation when it isn't one. It stays flagged for the moment the engine ships.

---

## Your Personal Day Number and Your Tarot Card
- Status: idea (new 2026-08-24)
- Intent: someone who has met the personal-year and personal-month idea wants the same thing for
  today. Daily-ritual intent, which is repeat-visit intent, which is the only intent on this list
  that matches what a subscription actually sells.
- Head term: **personal day number** (+ "personal day number tarot card", "how to calculate your
  personal day number", "what tarot card is today for me", "tarot card of the day numerology")
- Competition & gap: the SERP is numerology.com (which owns the term and runs a free daily-number
  tool), phuture.me, astronumero, sunsigns.org, birthcharthoroscopes. Every one of them stops at a
  digit 1–9 and a mood paragraph. The tarot side of the same question is served by draw-a-card
  widgets. The one page bridging them is a hobbyist tool
  (`dailytarotcard.pythonanywhere.com`, "Tarot Card of the Day with Numerology calculator") that
  derives the day's trump from the date and prints it with no reading and no personal column. So
  the derivation exists as a toy; nobody has written the argument.

  The argument is the sharpest version of the sibling series' own point, because the day is where
  the loop is most visibly a loop. Verified against `lib/almanac.ts` for a March 15 birthday in
  September 2026: the reduced personal day number produces **9 distinct values and repeats every
  nine days** (2 3 4 5 6 7 8 9 1 2 3 …), while the Almanac's personal day card reaches **all 22
  Majors inside that single 30-day month**. Two further facts only we can print: the day card also
  carries a **Minor** (rank plus a suit tethered to the day-Major's element), which no competitor
  produces at all, and the **Bearing gap holds at the day level** (personal day minus collective
  day equals the Bearing on all 30 days, checked). That last one is the site's whole spine landing
  on the smallest unit.
- Internal links: blog-11 (personal year number) and blog-10 (personal month number) are the direct
  siblings and should both link here, completing life path → year → month → day; blog-02 for the
  formula; blog-01 for the cornerstone. CTA to **`/today`**.
- No cannibalization risk: there is **no `/personal-day-card` hub** (verified against `app/`), so
  unlike the year and month posts this one has no sibling hub to collide with. If a day hub is ever
  built, this post keeps the number term and the hub takes the card term, same as the others.
- **Absorbs the old "Card of the Day, Without Shuffling" entry.** That candidate's whole argument
  was "every daily-tarot article starts with shuffle-and-draw, ours is knowable in advance," which
  is a paragraph inside this post rather than a post of its own. It also entered on **tarot card
  of the day**, an unwinnable product head term owned by widgets with a decade of links. Entering
  on the numerology term instead is the same move that worked for blog-10 and blog-11.
- Priority: **high** — it completes the sibling series, the term has a clear incumbent vocabulary
  but no incumbent doing the tarot half, the arithmetic is verified and unusually vivid (nine days
  versus twenty-two cards), and it is the only candidate whose CTA is the subscription product
  rather than a free calculator.

## The Card of the Year You Were Born
- Status: idea (carried from 2026-08-17)
- Intent: "what tarot card is my birth year" — someone who has already met the birthday-card idea
  and wants the *year* read on its own. A distinct term from birth card, and distinct from
  everything the site currently has a page for (`/birthday/[month-day]` is month-and-day only;
  the birth year appears only inside the natal chart).
- Head term: **birth year tarot card** (+ "what tarot card represents my birth year", "tarot card
  for the year I was born", "1990 tarot card")
- Competition & gap: **Parade owns the term** ("The Tarot Card That Represents You, Based on Your
  Birth Year"), with Yahoo/MSN syndication behind it, and the re-survey this week shows Parade
  holds the entire neighbourhood: birth *date*, birth *month*, birth *month minor arcana*, soul
  card by birth month, and a "2026 Tarot Card of the Year, Based on Your Birth Date" piece. That is
  a real ceiling on position. It is also the weakness: the neighbourhood is editorial, not derived.
  Parade's birth-year answers come from folding the year to a digit and reading nine cards, and the
  live SERP visibly conflates the year card with the birth card mid-answer. Our gap is the
  sibling-series argument on a fresh term, and it is arithmetically strong: verified against
  `lib/almanac.ts`, birth years 1925–2025 reach **all 22 Majors** (1985 → the Magician, 1990 → the
  Sun, 1999 → the Lovers, 2000 → the High Priestess, 2011 → the Emperor), where the reduced method
  reaches nine. The asset is a **century table, one row per birth year**, each linking to
  `/tarot/[slug]` — the same internal-link shape that rescued the orphan pages, and a genuine reason
  for a reader to scroll to their own row. Second gift: the year you were born is a *collective*
  card, the world's card the year you arrived, which is the site's own personal-vs-collective spine
  restated.
- Internal links: blog-11 (personal year number) and blog-09 (life path) are the direct siblings;
  blog-05 (natal chart) is where the birth year already lives; blog-01 for the cornerstone. CTA
  to `/tarot-birth-chart` (the chart is the page that actually uses the birth year), not
  `/personal-year-card`.
- Priority: **medium-high** — a real term with a clean, verified argument and a table asset, on
  ground no existing page of ours claims. Below the personal-day post because it is evergreen (slow
  lane) and Parade sits on the ceiling.

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
- Priority: **medium-high** — furthest along of anything here, and it does a job no SEO post
  does. Needs Tali's read on the political-commentary temperature before it goes anywhere,
  which is exactly why it stays a draft until she says otherwise. Six weeks parked; worth a
  yes-or-no rather than another week of drift.

## Master Numbers 11 and 22, and What the 22-Card Wheel Does With Them
- Status: idea
- Intent: someone who knows their life path is a master number wants to know which card it
  maps to, and why the answer they got elsewhere feels arbitrary.
- Head term: **master number tarot card** (+ "life path 11 tarot birth card", "life path 22
  tarot birth card", "what tarot card is master number 11")
- Competition & gap: numerologist.com has a dedicated page for each and largely owns the term;
  thesecretofthetarot, dailytarotdraw and darkforesttarotcards fill in around it. Re-surveyed
  2026-08-24 and the SERP now hands us something better than a gap, it hands us a **live
  contradiction**: for 11 the results agree on Justice, but for 22 the same page argues both ways
  in the same breath, that 22 reduces to 4 (the Emperor) *and* that the birth card is the Fool
  "which carries dual numbering as both card 0 and card 22." The incumbents can't resolve that,
  because a nine-slot system has no position 22 to put anyone in. Our wheel resolves it by
  construction, verified: `mod22(11) = 11` (Justice), `mod22(22) = 0` (the Fool). Same two answers
  the best incumbents reach, arrived at rather than asserted, and the dual-numbering hedge stops
  being a hedge. Bonus vocabulary worth using: their framing of 11 as "the exact centre of the
  Major Arcana, every pair equidistant from it summing to 22" is true on our wheel too.
- Internal links: blog-09 (life path) is the direct parent and should link here; blog-08,
  blog-02 and now blog-12 (which already argues the 11-versus-2 fold at length) all touch it.
  Watch that overlap: blog-12 owns the *year* fold, this owns the *life path* fold.
- Priority: **medium-high** — low effort, low competition, slots straight into the existing
  numerology-sibling series, and the 22 contradiction is a genuinely strong opening. The reason
  it isn't higher is volume: a narrow long-tail question wins a small pot.

## Tarot Compatibility by Birthday: two Bearings on one wheel
- Status: idea (product-dependent, **still blocked**)
- Intent: two people want to know what their birthdays say about them together. Very high
  commercial and shareable intent; the single biggest untapped acquisition term adjacent to
  the site's core math.
- Head term: **tarot birth card compatibility** (+ "tarot compatibility by birthday", "do we
  have the same birth card", "tarot birth card compatibility calculator")
- Competition & gap: tarot.com, loveproject, mysticmondays, escapeboundaries, seostudiotools and a
  long tail of calculators. Re-surveyed 2026-08-24, unchanged: every one of them computes both
  people's birth cards and then describes the two cards side by side. Nobody computes the
  *relationship* as its own number. We can, and it is already a settled primitive: the gap between
  two Bearings on the 22-wheel, with the distance band (`min(B, 22-B)`) as the reading. That is a
  genuinely new unit in this space, checkable, and it is gift-shaped, which matters because charts
  are the giftable product.
- Internal links: blog-04 (Bearing) is the parent, blog-08 and blog-09 both hand off here,
  blog-05 (natal chart) for the upsell.
- Priority: **high, but blocked.** Verified 2026-08-24 that both roadmap items ("Paid compatibility
  reading", "Birth-card compatibility post") are still open and the engine is unbuilt. Writing the
  post first would send its traffic to a page with nothing to do. Sequence it after the engine.

## Your Zodiac Sign's Tarot Card vs the Card Your Birthday Actually Makes
- Status: idea
- Intent: high-volume curiosity ("what tarot card am I") arriving through the astrology door,
  which is the door most people know.
- Head term: **tarot card for your zodiac sign** (+ "what tarot card represents my zodiac
  sign", "zodiac tarot correspondences", "is my tarot card my sun sign")
- Competition & gap: Labyrinthos, Biddy, Deckaura, PaganGrimoire, masteringthezodiac. Deep,
  well-linked, and they own the correspondence tables outright. Do not try to out-table them.
  The winnable angle is the comparison itself: the sign gives twelve buckets and a
  month-long window; the birthday gives a specific number and a specific card, and the two
  answers disagree for most people. That framing is ours and nobody on the SERP makes it.
- Internal links: blog-01 and blog-08; CTA to `/birthday/[month-day]`, which is the page type
  already carrying most of our page-1 rankings.
- Priority: **medium** — biggest audience on the list, hardest SERP, and it borrows authority
  from astrology rather than building ours. Worth doing once, framed as the comparison, not
  the table.

## Every Famous Person's Bearing (the celebrity version of the presidents piece)
- Status: idea
- Intent: browsing curiosity, arriving through a name people already search.
- Head term: **celebrity tarot birth cards** (+ "Taylor Swift tarot birth card", "celebrity birth
  card", "what is [name]'s tarot card")
- Competition & gap: **Biddy Tarot owns this outright**, with Starsinsider and its MSN
  syndication next to it. Biddy's own page states the ceiling out loud, that there are "only
  twelve possible combinations" of birth cards, which is the exact limitation the sibling series
  exists to argue with. So the gap is real: their celebrity list can only ever sort famous people
  into twelve buckets, and a Bearing sorts them into twenty-two without needing a birth year at
  all (which matters here, because celebrity birth years are exactly the fact that gets disputed).
- Internal links: blog-04 (Bearing) is the parent; the presidents piece, if it ships, is the
  sibling. CTA to `/bearing`.
- Priority: **low-medium** — the job it does (link bait, spreading the word "Bearing") is already
  being done by the presidents draft, which is further along and doesn't have Biddy sitting on
  its term. Keep it as the follow-up if the presidents piece lands well, not as competition for it.

## The Four Suits and the Four Elements
- Status: idea
- Intent: beginner reference lookup.
- Head term: **tarot suits meanings** (+ "tarot elements", "what element is each tarot suit")
- Competition & gap: Biddy and Labyrinthos own this at the top and it is one of the most
  saturated beginner terms in tarot. Our only distinct claim is small: the Almanac tethers
  the day's minor suit to the day-Major's element (Fire→Wands, Water→Cups, Air→Swords,
  Earth→Pentacles), so the suit isn't chosen, it follows. One good paragraph, not a post.
- Internal links: blog-02. Note the personal-day candidate above needs exactly this paragraph,
  so if that post is written, this stops being a candidate at all.
- Priority: **low** — write it as a section inside another post, or as a `/tarot` hub
  improvement, rather than spending a post on a term we cannot rank for.

## Your 2028 Tarot Year Card
- Status: idea (scheduled, not now)
- Intent: the same seasonal engine that made blog-06 work, one year on. `collectiveYear(2028)
  = 12` = the Hanged One (verified against `lib/almanac.ts`).
- Head term: **2028 tarot year card** (+ "2028 numerology", "what is the tarot card for 2028")
- Competition & gap: empty SERP today, which is the whole point. blog-06 was published
  2026-08-04 for exactly this reason: get indexed before the competitors do. Note also that
  tarot.com publishes a per-year ruling-card page whose method agrees with ours, so it will
  eventually arrive here; our runway is a lead, not a moat.
- Internal links: blog-06, blog-11, blog-12 (the number door, if it gets a 2028 sibling).
- Priority: **low right now, high in August 2027** — blog-06 shipped roughly sixteen months
  ahead of its year and had page-one traction in days. Same lead time puts this at
  August 2027. Listed so the timing isn't missed.

---

## Published from this backlog

- **Your 2027 Numerology: the Universal Year Number** → shipped 2026-08-17 as blog-12,
  `/blog/2027-universal-year-number`. Topped this list for four consecutive weeks. Still owed the
  Illustrate stage (no figures, no social entry) if that's wanted.

## Better as an upgrade to an existing page, not a new post

Found while surveying, worth recording so they don't get re-proposed as posts every week.

- **"Why do tarot birth card calculators disagree?"** The live SERP is a mess in a way that's
  useful: The Tarot School, HowStuffWorks, tarot.com, corax.com and healingthrutarot all describe
  *different* reduction conventions (MM + DD + YY + YY vs digit-by-digit vs stopping at two cards
  vs three), and one page claims every method "magically" agrees while readers plainly get
  different answers from different calculators. That is a real, high-intent question with no clean
  answer ranking for it. But it is **blog-08's ground already** ("why is my birth card different"),
  so the move is a section inside blog-08 naming the specific conventions and what each one throws
  away, plus an FAQ row on the `/tarot-birth-card` hub. A separate post would re-open the
  cannibalization the 2026-07-20 → 08-03 thread just closed.
- **The four suits and the four elements** (its own entry above, kept at low priority for the same
  reason): one paragraph inside another post, or a `/tarot` hub improvement.
- **blog-12's figures and social assets.** Not a topic, a finished-work item: the post is live
  without the Illustrate stage. Cheaper than any new post on this list, and it lifts a page that
  already has a seasonal audience coming.

## Deliberately not proposed

- **Anything targeting "tarot birth card" head-on.** Two of our pages already sat tied at
  position ~82 on it. A third would make it worse.
- **"Your birth month tarot card."** Parade owns the term twice over (a Major version and a Minor
  Arcana version, both syndicated to Yahoo), and, more to the point, **we would have to invent the
  mapping.** Their card-per-month assignments are editorial picks by readers, not derived from
  anything, and the Almanac has no birth-month-only card: month and day are read together. Writing
  it would mean generating a correspondence the arithmetic can't back, which the project's rules
  forbid.
- **Generic card-meaning posts** (individual Majors, spreads, "how to read tarot").
  `/tarot/[slug]` covers all 78 and still cannot crack page one; blog posts on the same
  ground would compete with our own cards, not with the incumbents.
- **Angel numbers, twin flames, manifestation numerology.** Adjacent volume, wrong system,
  and it would put copy in front of readers that the arithmetic can't back.
