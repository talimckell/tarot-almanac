# Blog ideas — ranked backlog

Maintained by the weekly Blog Topic Scout (the `blog` skill, Stages 1–2 only). Research and
proposals only: nothing here is a decision, and no post gets written until Tali picks one.

**Last run:** 2026-08-17. Entry format is the one defined in the blog skill's Search stage.

---

## Account (verified against the files, 2026-08-17)

All **11 entries in `lib/blog.ts` are published** (uncommented). There are **no dormant
scaffolds left**: the 2027 year-card post was the last one, and it went live 2026-08-04.
`grep` for `SCAFFOLD` across `content/*.md` returns nothing.

| # | Slug | Owns (search intent) |
|---|---|---|
| 01 | `what-is-tarot-numerology` | "what is tarot numerology", why your birth card differs |
| 02 | `how-tarot-numerology-works` | the full formula: year / month / day cards |
| 03 | `the-shadow-and-the-reclaiming` | reversed tarot card meanings |
| 06 | `2027-tarot-year-card` | "2027 tarot year card" (the CARD term), Justice |
| 07 | `major-arcana-three-stages` | the Fool's journey, three stages |
| 08 | `tarot-birth-card` | Personality/Soul method, Mary Greer, "why is my birth card different" |
| 09 | `life-path-number-tarot` | "life path number tarot" |
| 04 | `what-is-a-tarot-bearing` | "tarot bearing" (proprietary term) |
| 05 | `the-tarot-natal-chart` | "tarot natal chart" / "tarot birth chart" |
| 11 | `personal-year-number-tarot` | "personal year number" (the NUMBER term) |
| 10 | `personal-month-number-tarot` | "personal month number" (the NUMBER term) |

**The split rule that keeps recurring, and that every new candidate must respect:** the
calculator HUBS (`/tarot-birth-card`, `/personal-month-card`, `/personal-year-card`,
`/birthday`, `/month`) own the card/calculator terms. Blog posts enter through the adjacent
NUMEROLOGY term and take the comparison at full length. Where that discipline slipped
(blog-08 vs the birth-card hub) both pages sat stuck at position ~82 for a month. See
`docs/SEARCH_PERFORMANCE.md`, entries 2026-07-20 through 2026-08-10.

**One draft exists outside the registry:** `content/drafts/every-us-presidents-bearing.md`
(uncommitted). Tracked below as in-flight.

**What the search log says to weight this round** (`docs/SEARCH_PERFORMANCE.md`, 2026-08-17):
timely/dated content is still the fast lane, and it held through a soft week. The marginal week
Aug 9–15 was the **first down week since indexing began** (~51 impressions/day vs ~81 the week
before, 3 clicks vs 10, sessions ~120/mo down from ~160), most likely August lull plus
`/month/2026-08` decaying late-month. Structure kept improving inside the shrinking pool:
page-1 count 114 → 120, and `/blog/2027-tarot-year-card` holds **position 8.3**. So the
2026-08-10 lesson survives its first stress test: dated "what's coming" content ranks fast and
keeps ranking, while evergreen card-meaning content stays the slow lane.

Two things that read as blog-relevant this week, both arguing the same way:

- **Seasonal pages earn by being indexed early, not by being better.** `/month/2026-09` never
  appeared because indexing was never requested; it was requested 2026-08-17. That's a hub
  chore, not a blog job, but it is the same clock the seasonal blog candidates run on: publish
  with runway, because the ramp is ~3 weeks and the demand window doesn't wait.
- **A receding impression pool argues for the timely candidates over the big-SERP ones.** In a
  soft month the winnable thing is a term with no incumbent yet (2027, 2028), not a term where
  Biddy and Labyrinthos are already sitting.

---

## Ranking this week (2026-08-17)

Candidates run top-to-bottom below in priority order. The short version:

| | Candidate | Priority | Note |
|---|---|---|---|
| 1 | 2027 Universal Year Number | high | timely, runway, verified; unchanged at the top |
| 2 | Compatibility by birthday | high, blocked | wants the engine shipped first |
| 3 | Every US President's Bearing | medium-high | drafted, waiting on Tali's read |
| 4 | The card of the year you were born | medium-high | **new this week** |
| 5 | Master numbers 11 and 22 | medium-high | cheap, narrow, slots into the series |
| 6 | Zodiac card vs birthday card | medium | biggest audience, hardest SERP |
| 7 | The card of the day | medium | conversion piece, unwinnable head term |
| 8 | Every famous person's Bearing | low-medium | **new this week**, follows the presidents piece |
| 9 | The four suits and four elements | low | a paragraph, not a post |
| 10 | Your 2028 tarot year card | low now, high Aug 2027 | listed so the timing isn't missed |

Nothing was demoted this round; two candidates were added and the top four are unchanged.

---

## Your 2027 Numerology: the Universal Year Number (and the card it isn't)
- Status: idea
- Intent: someone searching the *numerology* framing of 2027 ("what number year is 2027",
  "universal year 2 meaning") wants to know what the year is made of before it arrives. Same
  seasonal audience as blog-06, arriving through a different door.
- Head term: **universal year number 2027** (+ "2027 numerology", "universal year 2 2027
  meaning", "what is my personal year in 2027")
- Competition & gap: the SERP is numato.pl, elunarasanctuary, tisyasetu, affinitynumerology,
  lunary.app, plus a Google-Books numerology title. Thin, templated, mostly
  predictions-and-remedies copy, no arithmetic shown. The gap is the thing our engine makes
  literal: **2+0+2+7 = 11 for everyone, and then the two systems do different things with it.**
  Numerology reduces 11 down to a 2 (or keeps it as a master number and hedges). The Almanac
  runs `mod22(11)` and stops at 11, which is Justice. Same digit sum, two reductions, one of
  which throws information away. That is the loop-vs-wheel comparison the sibling series
  already does well, on the one year everyone is about to search for. Verified against
  `lib/almanac.ts`: `sumDigits(2027) = 11`, `collectiveYear(2027) = 11` = Justice.
- Internal links: blog-11 (personal year number) and blog-10 (personal month number) are the
  direct siblings; blog-06 is the reciprocal (the card term ↔ the number term); blog-01 for
  the cornerstone. CTA to `/personal-year-card`.
- Re-surveyed 2026-08-17, unchanged and worth two new notes. (1) The competitor vocabulary is
  settled and specific: "Universal Year 2 (11 undertone)", "master number 11 year", the 11
  "operating on the chassis of the 2". Use their words for coverage, then show the arithmetic
  they don't. (2) **tarot.com publishes a per-year ruling-card page** ("The Ruling Tarot Card of
  2026: The Wheel of Fortune") and its method agrees with ours — verified
  `collectiveYear(2026) = 10` = Wheel of Fortune. So the strongest site on this SERP will
  eventually publish a 2027 page, and the runway we have is a lead, not a moat. Meanwhile the
  smaller sites are visibly inconsistent about 2027 (one chart in the live SERP lists it as the
  Hanged One, which is 2028 under the standard sum — verified `collectiveYear(2028) = 12`).
  Naming that disagreement is a paragraph the incumbents can't write.
- Priority: **high** — it is the only candidate on this list that is both *timely* (the
  Nov–Jan 2027 spike, with enough runway for the ~3-week ramp) and a clean extension of the
  number-vs-hub split that has already earned clicks. Must keep its seoTitle and H1 off
  "2027 tarot year card", which is blog-06's.

## Tarot Compatibility by Birthday: two Bearings on one wheel
- Status: idea (product-dependent)
- Intent: two people want to know what their birthdays say about them together. Very high
  commercial and shareable intent; the single biggest untapped acquisition term adjacent to
  the site's core math.
- Head term: **tarot birth card compatibility** (+ "tarot compatibility by birthday", "do we
  have the same birth card", "tarot birth card compatibility calculator")
- Competition & gap: tarot.com, mysticmondays, loveproject, numerologist.com and a long tail
  of calculators. Every one of them does the same thing: compute both people's birth cards,
  then describe the two cards side by side. Nobody computes the *relationship* as its own
  number. We can, and it is already a settled primitive: the gap between two Bearings on the
  22-wheel, with the distance band (`min(B, 22-B)`) as the reading. That is a genuinely new
  unit in this space, checkable, and it is gift-shaped, which matters because charts are the
  giftable product.
- Internal links: blog-04 (Bearing) is the parent, blog-08 and blog-09 both hand off here,
  blog-05 (natal chart) for the upsell.
- Priority: **high, but blocked** — the post is worth far more with the compatibility engine
  and a calculator page shipped behind it (see the banked compatibility work in the roadmap).
  Writing the post first would send traffic to a page with nothing to do. Sequence it after
  the engine, not before.

## Every US President's Bearing
- Status: **in-flight** (drafted, uncommitted, `content/drafts/every-us-presidents-bearing.md`)
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
  which is exactly why it stays a draft until she says otherwise.

## The Card of the Year You Were Born
- Status: idea (new 2026-08-17)
- Intent: "what tarot card is my birth year" — someone who has already met the birthday-card idea
  and wants the *year* read on its own. A distinct term from birth card, and distinct from
  everything the site currently has a page for (`/birthday/[month-day]` is month-and-day only;
  the birth year appears only inside the natal chart).
- Head term: **birth year tarot card** (+ "what tarot card represents my birth year", "tarot card
  for the year I was born", "1990 tarot card")
- Competition & gap: **Parade owns the term** ("The Tarot Card That Represents You, Based on Your
  Birth Year"), with Yahoo/MSN syndication behind it and a pile of calculators (sagelon,
  darkforesttarotcards, flickerdeck, deckaura, tarot.com) ranking on the adjacent birth-card
  phrasings. Parade is a hard SERP neighbour, but the incumbents all do the same reduction: fold
  the year to one digit, land in nine cards, and conflate the year card with the birth card in
  the same breath (the live SERP mixes them mid-answer). Our gap is the sibling-series argument
  on a fresh term, and it is arithmetically strong: verified against `lib/almanac.ts`, birth
  years 1925–2025 reach **all 22 Majors** (1985 → the Magician, 1990 → the Sun, 1999 → the
  Lovers, 2000 → the High Priestess), where the reduced method reaches nine. The asset is a
  **century table, one row per birth year**, each linking to `/tarot/[slug]` — the same
  internal-link shape that rescued the orphan pages, and a genuine reason for a reader to scroll
  to their own row. Second gift: the year you were born is a *collective* card, the world's card
  the year you arrived, which is the site's own personal-vs-collective spine restated.
- Internal links: blog-11 (personal year number) and blog-09 (life path) are the direct siblings;
  blog-05 (natal chart) is where the birth year already lives; blog-01 for the cornerstone. CTA
  to `/tarot-birth-chart` (the chart is the page that actually uses the birth year), not
  `/personal-year-card`.
- Priority: **medium-high** — a real term with a clean, verified argument and a table asset, on
  ground no existing page of ours claims. Below the 2027 post only because it is evergreen
  (slow lane) and Parade is the ceiling on position.

## Master Numbers 11 and 22, and What the 22-Card Wheel Does With Them
- Status: idea
- Intent: someone who knows their life path is a master number wants to know which card it
  maps to, and why the answer they got elsewhere feels arbitrary.
- Head term: **master number tarot card** (+ "life path 11 tarot birth card", "life path 22
  tarot birth card", "what tarot card is master number 11")
- Competition & gap: numerologist.com has a dedicated page for each (11 → Justice, 22 → The
  Fool) and largely owns the term; thesecretofthetarot and tarostarot fill in around it. The
  incumbents assert the mapping and move on. The gap is that our system *derives* it rather
  than asserting it, and lands in the same place by a different road: `mod22(11) = 11`
  (Justice), `mod22(22) = 0` (the Fool). A wheel with 22 positions is the only structure in
  which a master number doesn't need special pleading, because 11 and 22 are just positions
  on it. Cheap to write, tightly scoped, and it is a real answer to a question the
  incumbents dodge.
- Internal links: blog-09 (life path) is the direct parent and should link here; blog-08 and
  blog-02 also touch it.
- Priority: **medium-high** — low effort, low competition, slots straight into the existing
  numerology-sibling series. The reason it isn't top is volume: it is a narrow long-tail
  question, so it wins a small pot.

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
  already carrying 74 of our 114 page-1 rankings.
- Priority: **medium** — biggest audience on the list, hardest SERP, and it borrows authority
  from astrology rather than building ours. Worth doing once, framed as the comparison, not
  the table.

## The Card of the Day, Without Shuffling
- Status: idea
- Intent: daily-ritual traffic. Enormous head-term volume, almost all of it captured by
  draw-a-card widgets.
- Head term: **tarot card of the day** (+ "how to read a daily tarot card", "one card daily
  draw meaning", "same tarot card keeps coming up")
- Competition & gap: tarot.com, askastrology, learntarot, dailytarotdraw. The head term is a
  product term, not an article term, and we will not take it from a widget with a decade of
  links. The gap the articles leave: every one of them starts with "shuffle and draw", which
  makes the daily card an artifact of the shuffle. Ours is the same card for everyone with
  that birthday on that date, and it is knowable in advance. That is the argument, and
  `/today` is the payoff.
- Internal links: blog-02 (the formula) and blog-03; CTA to `/today`.
- Priority: **medium** — strategically the closest post to the actual product and the
  subscription, but the head term is unwinnable, so it has to be pitched at the long-tail
  question phrasings and treated as a conversion piece rather than a traffic piece.

## Every Famous Person's Bearing (the celebrity version of the presidents piece)
- Status: idea (new 2026-08-17)
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
- Internal links: blog-02.
- Priority: **low** — write it as a section inside another post, or as a `/tarot` hub
  improvement, rather than spending a post on a term we cannot rank for.

## Your 2028 Tarot Year Card
- Status: idea (scheduled, not now)
- Intent: the same seasonal engine that made blog-06 work, one year on. `collectiveYear(2028)
  = 12` = the Hanged One (verified against `lib/almanac.ts`).
- Head term: **2028 tarot year card** (+ "2028 numerology", "what is the tarot card for 2028")
- Competition & gap: empty SERP today, which is the whole point. blog-06 was published
  2026-08-04 for exactly this reason: get indexed before the competitors do.
- Internal links: blog-06, blog-11.
- Priority: **low right now, high in August 2027** — blog-06 shipped roughly sixteen months
  ahead of its year and had page-one traction in days. Same lead time puts this at
  August 2027. Listed so the timing isn't missed.

---

## Better as an upgrade to an existing page, not a new post

Found while surveying, worth recording so they don't get re-proposed as posts every week.

- **"Why do tarot birth card calculators disagree?"** The live SERP is a mess in a way that's
  useful: The Tarot School, HowStuffWorks, tarot.com and healingthrutarot all describe *different*
  reduction conventions (MM+DD+19+YY vs digit-by-digit vs stopping at two cards vs three), and
  one page claims every method "magically" agrees while readers plainly get different answers from
  different calculators. That is a real, high-intent question with no clean answer ranking for it.
  But it is **blog-08's ground already** ("why is my birth card different"), so the move is a
  section inside blog-08 naming the specific conventions and what each one throws away, plus an
  FAQ row on the `/tarot-birth-card` hub. A separate post would re-open the cannibalization the
  2026-07-20 → 08-03 thread just closed.
- **The four suits and the four elements** (its own entry above, kept at low priority for the same
  reason): one paragraph inside another post, or a `/tarot` hub improvement.

## Deliberately not proposed

- **Anything targeting "tarot birth card" head-on.** Two of our pages already sit tied at
  position ~82 on it. A third would make it worse.
- **Generic card-meaning posts** (individual Majors, spreads, "how to read tarot").
  `/tarot/[slug]` covers all 78 and still cannot crack page one; blog posts on the same
  ground would compete with our own cards, not with the incumbents.
- **Angel numbers, twin flames, manifestation numerology.** Adjacent volume, wrong system,
  and it would put copy in front of readers that the arithmetic can't back.
