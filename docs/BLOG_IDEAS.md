# Blog ideas — ranked backlog

Maintained by the weekly Blog Topic Scout (the `blog` skill, Stages 1–2 only). Research and
proposals only: nothing here is a decision, and no post gets written until Tali picks one.

**Last run:** 2026-08-14. Entry format is the one defined in the blog skill's Search stage.

---

## Account (verified against the files, 2026-08-14)

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

**What the search log says to weight this round** (`docs/SEARCH_PERFORMANCE.md`, 2026-08-10):
timely/dated content ranks fastest and brings the most sessions. `/blog/2027-tarot-year-card`
hit position 8.2 within days of going live and was the top page by visitors. Sessions are now
the number that matters (Mediavine Journey needs 1,000/mo; we're at ~160). Evergreen
card-meaning content is the slow lane; dated "what's coming" content is the fast one.

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

## Deliberately not proposed

- **Anything targeting "tarot birth card" head-on.** Two of our pages already sit tied at
  position ~82 on it. A third would make it worse.
- **Generic card-meaning posts** (individual Majors, spreads, "how to read tarot").
  `/tarot/[slug]` covers all 78 and still cannot crack page one; blog posts on the same
  ground would compete with our own cards, not with the incumbents.
- **Angel numbers, twin flames, manifestation numerology.** Adjacent volume, wrong system,
  and it would put copy in front of readers that the arithmetic can't back.
