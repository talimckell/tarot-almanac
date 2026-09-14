# Blog ideas — ranked backlog

Maintained by the weekly Blog Topic Scout (the `blog` skill, Stages 1–2 only). Research and
proposals only: nothing here is a decision, and no post gets written until Tali picks one.

**Last run:** 2026-09-14. Entry format is the one defined in the blog skill's Search stage.

---

## Account (verified against the files, 2026-09-14)

**blog-14 shipped.** All **14 entries in `lib/blog.ts` are published** (uncommented), all 14
registered `content/blog-*.md` files exist, and `grep '^\s*//.*slug:' lib/blog.ts` returns
nothing: **there are no dormant scaffolds anywhere in the registry.**

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
| 14 | `wedding-date-tarot-card` | "wedding date numerology" / the card of the day you met |

**What happened to blog-14, since the last three runs tracked it as unfinished:** the
2026-08-31 branch draft was **discarded**, not rebased. The registry comment (`lib/blog.ts:510`)
records that Tali read it as "too math/engineering-y" — 41% of its words on one arithmetic
section, 16% on the couple — and it was rebuilt from scratch through the new Stage 3 in the blog
skill, then published 2026-09-10 straight from the Review gate. The shipped file is
`content/blog-14-wedding-date-tarot-card.md`, **1,876 words**, and it is the first post written in
the **kitchen-table friend** register rather than the historian's mode. Worth knowing for topic
selection: the register is now a live per-post choice, and personal-stake topics have a precedent
to point at.

**The presidents draft moved this week.** `content/drafts/every-us-presidents-bearing.md` is
still uncommitted and still outside the registry, but its mtime is **Sep 11 11:44** (it had been
untouched since 2026-07-13) and it now runs **2,976 words**. Someone picked it back up three days
ago. It is tracked below as in-flight, and the "eight weeks parked, wants a yes or a no" framing
from the last three runs is retired.

### Housekeeping found while accounting

This doc is still the only file the scout touches, so none of it is fixed here.

- **blog-12's stale comment, fourth week running.** `lib/blog.ts:170` still opens "DRAFTED
  2026-08-17, NOT PUBLISHED — commented out pending the Illustrate and Review gates," above a live
  entry, and line 199 still says "No figures yet" above a post that has two. Two line deletes.
- **`lib/blogSocialContent.ts` now trails the registry by three posts.** It holds 11 entries;
  blog-12, blog-13 and now blog-14 are all absent (re-verified by grep). blog-14 is the notable
  one: the discarded 08-31 branch *had* a social entry at line 742, and the rebuild shipped
  without one, so a set of social assets was written and then thrown away with the draft. They cannot simply be
  lifted across: every quote in them was pulled from prose that no longer exists.
- **blog-13's last owed item is still owed.** `app/tarot-birth-chart/page.tsx` still has no
  "Related" line to `/blog/birth-year-tarot-card`; the only references to that slug in `app/` and
  `lib/` remain the two reciprocal links inside `lib/blog.ts`.
- **`app/month/` still links to no blog post at all.** Fourth week verified. Its outbound links
  are 7× `/today`, 2× `/personal-month-card`, 2× `/me?subscribe=1#subscribe`, and nothing
  editorial. This is the page type earning the largest share of the site's clicks.

**The split rule that keeps recurring, and that every new candidate must respect:** the
calculator HUBS (`/tarot-birth-card`, `/personal-month-card`, `/personal-year-card`,
`/birthday`, `/month`) own the card/calculator terms. Blog posts enter through the adjacent
NUMEROLOGY term and take the comparison at full length. Where that discipline slipped
(blog-08 vs the birth-card hub) both pages sat stuck at position ~82 for a month, and three weeks
later they were still parallel at 75 / 77.6. See `docs/SEARCH_PERFORMANCE.md`.

### What the search log says to weight this round (2026-09-14 data, fresh this morning)

The weekly GSC entry was filed today, so unlike last week the evidence is current.

- **A ranking-expansion event, Sep 8–9.** Page-1 pages **164 → 392**, almost all of it
  `/birthday/*` (115 → 310), after the biggest crawl spike since launch (Sep 4–6, ~1,000 pages,
  92% "Refresh"). Cumulative impressions 5,945 (+1,830), clicks 131 (+47), CTR 2.2%. Because it
  is indexing-driven, the log expects it to hold.
- **`/month/2026-10` is climbing on the +1 cadence: pos 18 → 11**, 27 impressions, 5 clicks.
  `/month/2026-09` held at pos 10.75 with 208 impressions and 19 clicks, still the single biggest
  earner on the site.
- **Bing-index engines now outweigh Google as referrers** (DDG 32 + Ecosia 19 + Bing 8 = 59, vs
  Google 44). Not a topic-selection input, but it means a post's early traction may not show up in
  GSC at all until Bing Webmaster Tools is set up.

**What this changes for topic choice:** the birthday page type just doubled its page-1 footprint
without any editorial help, which is evidence that *hub pages rank on their own* and that the
scarce resource is the thing hubs can't do — an argument, an explainer, and internal links
pointing at them. The month hub is the one earning most and the one with no editorial companion.

---

## Ranking this week (2026-09-14)

| | Candidate | Priority | Change |
|---|---|---|---|
| 1 | The tarot card of the month, and where it comes from | **high** | **up from 2** — the write-by arrived, and a real incumbent surfaced |
| 2 | Your personal day number and your tarot card | high | **down from 1** on sequencing, not merit |
| 3 | Every US President's Bearing | medium-high | **moving again** — edited Sep 11 after eight weeks parked |
| 4 | Why Strength is eight and Justice is eleven | medium | **new this week** |
| 5 | Master numbers 11 and 22 | medium | unchanged; partly absorbed by #4 |
| 6 | Compatibility by birthday | high, blocked | still blocked; engine unbuilt (roadmap) |
| 7 | Zodiac card vs birthday card | medium | unchanged |
| 8 | Every famous person's Bearing | low-medium | unchanged |
| 9 | The four suits and four elements | low | unchanged, still a paragraph not a post |
| 10 | Your 2028 tarot year card | low now, high Aug 2027 | unchanged |
| — | ~~The card you can never have (the Tower year)~~ | **not proposed** | surveyed and rejected this week; already blog-11's ground |

**The one real change, and the reasoning behind it.** The personal-day post held first place for
three consecutive weeks and nothing about it got worse. Three things about its rival got better:

1. Its dated write-by ("write it in October, not December") has effectively arrived.
2. blog-14 shipped on 2026-09-10 **with a `/today` CTA**, which is the personal-day post's CTA
   too. Last week's entry already flagged that as an argument for spacing the two rather than
   running them back to back.
3. A named incumbent appeared on the collective-month term this week, publishing **our exact
   arithmetic** (below). That converts the entry from "nobody has made this argument" into
   "somebody is making it monthly, on a domain older than ours," which is a reason to move, not a
   reason to drop it.

If Tali disagrees with the sequencing, the personal-day post is still the stronger post on merit
and nothing is lost by taking it first.

---

## The Tarot Card of the Month, and Where It Comes From
- Status: idea (new 2026-08-31, ranked 2 on 2026-09-07, **ranked 1 this week**)
- Intent: someone who wants to know what *this month* holds, arriving on the commonest phrasing
  in the whole seasonal lane. Also the reader who lands on a `/month/[ym]` page and wants to know
  where that card came from, which right now nothing on the site tells them.
- Head term: **tarot card of the month** (+ "what tarot card represents each month of the year",
  "collective tarot card for [month]", "monthly tarot forecast")
- **Competition & gap, materially revised 2026-09-14.** The top of the SERP is unchanged and
  still monthly *tarotscope* content — tarot.com, horoscope.com, YourTango, astroyogi, all of it
  twelve-signs listicles or a reader-drawn spread. Underneath it, last week's entry claimed
  "nobody derives a card for the calendar month itself." **That is no longer true, and the
  correction is the most useful thing found this run.**

  **OMTimes Magazine runs a monthly series ("Tarot Arcana [Month] [Year]") that derives a
  collective card for the calendar month using the same formula this site uses.** Fetched and
  read 2026-09-14. Their August 2026 piece prints the arithmetic in the open: "The digits of the
  year: 2 + 0 + 2 + 6 = 10. The number of the month: 8. The final result: 10 + 8 = 18," giving
  the Moon, and states that "the collective card for each month is determined through a
  numerological calculation." That is `mod22(sumDigits(Y) + M)`, which is `collectiveMonth()` in
  `lib/almanac.ts`.

  Verified against the engine, 2026-09-14: **their August 2026 answer and ours are the same card,
  and so is every other month of 2026.** Our twelve for 2026 are Justice, the Hanged One, Death,
  Temperance, the Devil, the Tower, the Star, the Moon, the Sun, Judgement, the World, the Fool —
  twelve distinct Majors, January through December, and the Moon is August in both systems.
- **Where the two part company, which is the post's best asset now.** The agreement is a
  coincidence of 2026 being a small year: `sumDigits(2026) = 10`, so no month's total exceeds 22
  and there is nothing to resolve. The moment a total crosses 22 the published method has to
  reduce and ours wraps. Checked across 2026–2030:
  - **2026: zero divergences.** Every month agrees.
  - **2027: one.** December is raw 23 — the Magician on the wheel, the Hierophant if reduced.
  - **2028: two.** November and December (raw 23, 24 → the Magician and the High Priestess vs the
    Hierophant and the Lovers).
  - **2029: three.** October, November, December (raw 23, 24, 25 → the Magician, the High
    Priestess, the Empress vs the Hierophant, the Lovers, the Chariot).
  - **2030: zero again** (`sumDigits(2030) = 5`).

  So the honest framing is not "they're wrong and we're right." It's that the two methods are the
  same method until the number gets big, and the site's whole argument — keep it whole, wrap at
  22 — is exactly the disagreement that appears at the end of every year whose digits run high.
  That is a far better post than the one last week's entry described, and it is checkable.
- **A second incumbent framing worth naming in the post:** elsewhere on the SERP the "collective
  card for September 2026" is given as Justice on the grounds that September is ruled by Libra.
  That is zodiac correspondence, not arithmetic, and it produces the same twelve cards every year
  forever. Ours gives September the Sun in 2026 and Judgement in 2027. Worth one sentence, both
  for readers and for topical coverage.
- **The seasonal argument, unchanged and now due.** The competing intent for "a card for each
  month" is the **year-ahead spread**, twelve cards pulled for twelve months, run by Biddy Tarot,
  Deckaura, Moli Tarot, Elvi Tarot, Taro's Tarot and a long tail of readers. Re-surveyed this
  week, and their own instructions fix the window: New Year's Day, the winter solstice, or your
  birthday. Demand peaks late December through January. blog-06 shipped sixteen months early on
  exactly this logic and had page-one traction in days. **Writing it now gives it a full quarter
  of runway into that window.**
- Why it's also an internal-linking fix: `/month/2026-09` is still the site's single biggest
  earner (208 impressions, 19 clicks, pos 10.75) and `app/month/` links to no blog post at all,
  four weeks verified. `/month/2026-10` is at pos 11 and climbing into its own month.
- Cannibalization: real and manageable, the same split the series already runs. The `/month/[ym]`
  hubs own the **dated** terms; this post owns the **evergreen method** term and must keep its
  `seoTitle`, H1 and slug off any specific month. Distinct from blog-10, which is the *personal*
  month; this is the *collective* month, the same personal-vs-collective split blog-13 drew for
  the year.
- Shape: what a "card of the month" usually means (the tarotscope, the year-ahead spread, the
  Libra-is-Justice table) → the arithmetic, shown once → 2026's twelve, walked → the year-on-year
  walk for one month (September: Death, Temperance, the Devil, the Tower, the Star, the Moon, the
  Sun in 2026, Judgement, the World, the Fool, then the decade turn drops it back to Temperance in
  2030) → where the published method and this one split, at the end of a big year → what the
  collective card is and isn't (it is not your card; that's the Bearing away) → CTA.
- Internal links: blog-02 (the formula) is the parent; blog-10 (personal month) is the mirror and
  should link here; blog-13 (birth year) is the collective-card sibling; blog-06 for the year
  above it. CTA to `/month`, and the post is the natural place to wire the reciprocal link back
  from the month pages that currently link nowhere.
- Priority: **high** — a term with a live incumbent using our own arithmetic, a checkable
  divergence nobody has published, a seasonal window opening in about a quarter, and a job to do
  underneath the page type that earns most of the site's clicks.

## Your Personal Day Number and Your Tarot Card
- Status: idea (carried from 2026-08-24, 08-31 and 09-07, where it ranked first three times)
- Intent: someone who has met the personal-year and personal-month idea wants the same thing for
  today. Daily-ritual intent, which is repeat-visit intent, which is the only intent on this list
  that matches what a subscription actually sells.
- Head term: **personal day number** (+ "personal day number tarot card", "how to calculate your
  personal day number", "what tarot card is today for me", "tarot card of the day numerology")
- Competition & gap: re-surveyed 2026-09-14 and the picture is stable. birthcharthoroscopes runs
  a personal-day calculator ("enter your date to reveal your Personal Day Number and read an
  intuitive forecast"), with numerologist.com and numerology.com owning the head term and
  affinitynumerology and sunsigns.org underneath. The adjacent daily-tarot SERP is a different
  crowd entirely — tarot.com's card of the day, the gumroad and churned tarotscope tail. The two
  still don't cross: search the number term and you get digits with no cards, search the card term
  and you get shuffle widgets with no arithmetic.
- **The argument, unchanged and still the sharpest on this list.** The incumbent formula is
  printed the same way everywhere: reduce the birth month, birth day, current month, current day
  and current year, add the five, reduce again. Those are the same five inputs the Almanac uses.
  Identical ingredients, one arithmetic step apart, and the answers diverge completely.

  Re-verified against `lib/almanac.ts` on 2026-09-14 for a March 15 birthday across September
  2026: the incumbent method yields **9 distinct values, repeating every nine days**, while the
  Almanac's personal day card reaches **all 22 Majors inside that one 30-day month**. Two further
  facts only we can print: the day card also carries a **Minor** (Sept 1 2026 is the Tower with
  the Queen of Wands), which no competitor produces at all, and the **Bearing gap holds at the day
  level** — personal day minus collective day equals the Bearing (the Moon, 18, for March 15) on
  all 30 days, checked. That last one is the site's whole spine landing on the smallest unit.
- Internal links: blog-11 (personal year) and blog-10 (personal month) are the direct siblings and
  should both link here, completing life path → year → month → day; blog-02 for the formula;
  blog-01 for the cornerstone. CTA to **`/today`**.
- No cannibalization risk: there is **no `/personal-day-card` hub** (re-verified against `app/`,
  2026-09-14 — the hubs are `birthday`, `month`, `personal-month-card`, `personal-year-card`,
  `today`, `tarot-birth-card`, `tarot-birth-chart`), so unlike the year and month posts this one
  has no sibling hub to collide with. If a day hub is ever built, this post keeps the number term
  and the hub takes the card term.
- Absorbs the old "Card of the Day, Without Shuffling" entry, which entered on the unwinnable
  product head term and is a paragraph here rather than a post.
- Priority: **high, and second only on sequencing.** It completes the sibling series, enters on a
  term whose incumbents all stop at a digit, the arithmetic is verified and unusually vivid, and
  it is the only candidate whose CTA is the subscription product rather than a free calculator.
  What moved it to 2 is that blog-14 shipped on 2026-09-10 carrying the same `/today` CTA, and
  the month post has a seasonal deadline this one doesn't.

## Every US President's Bearing
- Status: **in-flight, and moving again.** `content/drafts/every-us-presidents-bearing.md`,
  uncommitted, **2,976 words**, last edited **2026-09-11** after eight weeks untouched.
- Intent: not a search play. Link bait, brand-vocabulary seeding, and a public demonstration
  that the Bearing is arithmetic anyone can check.
- Head term: none worth chasing ("presidents tarot cards" is negligible volume). Any traffic
  comes from shares and from the term "Bearing" spreading.
- Competition & gap: nobody has run this, because nobody else has a year-free birthday number
  to run. The Chester Arthur line (his Bearing survives the disputed birth year) is the proof
  the whole piece rests on.
- Internal links: blog-04 is the natural parent; the piece should CTA to `/bearing`.
- Priority: **medium-high**, and the framing has changed. For three weeks this entry asked for a
  yes or a no on a parked draft. It is no longer parked, so the useful note is a different one:
  it is a **political** piece on a site whose other fourteen posts are not, its lead reads a
  sitting president's card as being about accountability, and that is a positioning decision
  rather than an editorial one. Worth deciding deliberately, not by default. If it ships, it is
  also the only thing on this list that could plausibly earn links.

## Why Strength Is Eight and Justice Is Eleven
- Status: **idea, new 2026-09-14**
- Intent: a tarot reader who has noticed their deck disagrees with a chart, a calculator or
  another deck, and wants to know which one is wrong. Learner intent, not commercial, but it is
  the question that sits directly underneath this site's own foundation.
- Head term: **strength justice tarot numbering** (+ "why is strength 8 and justice 11", "the
  Golden Dawn swap", "tarot de marseille vs rider waite order", "is justice 8 or 11")
- Competition & gap: surveyed 2026-09-14. Real, answered, and answered by hobbyists: C. LaVielle
  ("The Strength-Justice Tarot Controversy"), Parsifal's Wheel ("The 'Golden Dawn Swap'"),
  wmjas's "Why Waite switched Justice and Strength," a 3am Tarot post on the numerology of it, and
  a long Tarot Forum thread. No large domain owns it. The published answers are all **historical**
  and they agree on the history: the older decks had Justice at 8, Waite and Colman Smith moved
  the pair in 1909 to fit Leo and Libra, and Crowley moved them back. Every one of them ends on
  "use whichever your deck uses," because for a card-drawing practice it genuinely does not matter.
- **The gap, and it is ours alone: on this site it is not a preference, it is load-bearing.** A
  deterministic system cannot shrug at its own numbering, because the number *is* the card.
  Verified against `lib/almanac.ts`, 2026-09-14:
  - **25 of the 365 collective days in 2026 (6.8%) land on 8 or 11**, so on roughly one day in
    fifteen the two traditions hand a reader a different card for the same date.
  - **57 of the 612 collective months between 2000 and 2050** do the same.
  - And the one that makes it live: **2027 is a Justice year under Golden Dawn order and would be
    a Strength year under Marseille order.** blog-06, the site's most seasonal post, is titled
    "The Year of Justice." The whole seasonal play rests on a convention half of tarot history
    disagrees with, and nowhere on the site says so at length.
- **Cannibalization, and it is the reason this is 4 and not higher.** blog-01 already carries the
  note, at line 33: "the Almanac places Strength at 8 and Justice at 11, the Golden Dawn ordering
  that most modern decks follow. Older Marseille decks swap the two." `app/how-it-works` repeats
  it. So this post is an existing paragraph at full length, which is exactly the shape blog-08 and
  blog-11 took successfully (a hub's FAQ row grown into a post) — but it needs the same discipline:
  keep the seoTitle, H1 and slug on the **numbering** question, and leave blog-01's cornerstone
  term alone.
- Shape: the reader's actual situation (deck says one thing, the chart says another) → what the
  older decks did → what Waite changed in 1909 and why (Leo and Libra) → why Crowley put them
  back → why a drawing practice can shrug and a dated system can't → what actually changes if you
  swap them, with the 2026 count and the 2027 year card → what this site picked and why.
- Internal links: blog-01 is the parent and already has the anchor sentence; blog-02 (the formula)
  and blog-06 (the Justice year) both depend on the answer; blog-07 for the Fool's Journey order.
  CTA to `/how-it-works` or `/tarot`.
- Priority: **medium** — no commercial intent and a modest term, but it is cheap (the history is
  well documented, the arithmetic is three lines), it is genuinely unclaimed by any large site,
  and it retires a question that currently gets two sentences on a site whose entire premise is
  that you can check the math. It also absorbs most of what was left of the master-numbers entry.

## Master Numbers 11 and 22, and What the 22-Card Wheel Does With Them
- Status: idea
- Intent: someone who knows their life path is a master number wants to know which card it
  maps to, and why the answer they got elsewhere feels arbitrary.
- Head term: **master number tarot card** (+ "life path 11 tarot birth card", "life path 22
  tarot birth card", "what tarot card is master number 11")
- Competition & gap: as re-surveyed 2026-09-07, numerologist.com holds the first page with three
  dedicated pages and **agrees with us** — `mod22(11) = 11`, `mod22(22) = 0`, verified. Agreeing
  loudly with the strongest incumbent is a weak opening. What survives is vocabulary worth
  borrowing: eleven as the exact centre of the Major Arcana, with every pair equidistant from it
  summing to 22, and the Fool's dual numbering as both 0 and 22, which stops being a hedge on a
  wheel that wraps.
- **Changed this week:** the third thread this entry was holding — the Justice-at-8-versus-11
  split — has been promoted to its own entry above, which is where it belongs. What's left here is
  thinner than it was.
- Internal links: blog-09 (life path) is the direct parent and should link here; blog-08, blog-02
  and blog-12 all touch it. blog-12 owns the *year* fold, this owns the *life path* fold.
- Priority: **medium** — low effort, slots into the sibling series, narrow long-tail pot, and its
  best material has just moved next door.

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
  (`min(B, 22-B)`) as the reading.
- **blog-14 shipping changes this entry's standing.** The wedding post is now live, so the site
  has a published piece aimed at two people rather than one, in the kitchen-table register, with a
  CTA problem it had to solve. It is this post's natural parent and its template.
- Internal links: blog-04 (Bearing) is the parent, blog-08 and blog-09 both hand off here,
  blog-05 (natal chart) for the upsell, blog-14 as the sibling.
- Priority: **high, but blocked.** The engine is unbuilt (two open roadmap items as of
  2026-08-31, not re-verified this week). Writing the post first would send its traffic to a page
  with nothing to do. Sequence it after the engine.

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
  people. Noted this week that the same correspondence logic is what produces "September's
  collective card is Justice, because Libra," so the month candidate above will touch this ground
  in one sentence; keep the two apart.
- Internal links: blog-01 and blog-08; CTA to `/birthday/[month-day]`, the page type that just
  doubled its page-1 footprint and now carries 310 page-1 pages.
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
  with. A Bearing sorts people into twenty-two without needing a birth year at all, which matters
  here because celebrity birth years are exactly the fact that gets disputed.
- Internal links: blog-04 (Bearing) is the parent; the presidents piece, if it ships, is the
  sibling. CTA to `/bearing`.
- Priority: **low-medium** — the job it does is already being done by the presidents draft, which
  is further along and doesn't have Biddy sitting on its term. It is also the non-political
  version of the same idea, which is worth remembering if the presidents piece is held back on
  positioning grounds.

## The Four Suits and the Four Elements
- Status: idea
- Intent: beginner reference lookup.
- Head term: **tarot suits meanings** (+ "tarot elements", "what element is each tarot suit")
- Competition & gap: Biddy and Labyrinthos own this at the top and it is one of the most saturated
  beginner terms in tarot. Our only distinct claim is small: the Almanac tethers the day's minor
  suit to the day-Major's element (Fire→Wands, Water→Cups, Air→Swords, Earth→Pentacles), so the
  suit isn't chosen, it follows. One good paragraph, not a post. blog-02 already has that
  paragraph, at line 31.
- Internal links: blog-02. The personal-day candidate needs exactly this paragraph, so if that
  post is written, this stops being a candidate at all.
- Priority: **low** — write it as a section inside another post, or as a `/tarot` hub improvement.

## Your 2028 Tarot Year Card
- Status: idea (scheduled, not now)
- Intent: the same seasonal engine that made blog-06 work, one year on. `collectiveYear(2028) = 12`
  = the Hanged One (re-verified against `lib/almanac.ts`, 2026-09-14).
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

- **The Card of the Day You Met** → shipped **2026-09-10** as blog-14,
  `/blog/wedding-date-tarot-card`, 1,876 words, the first post in the kitchen-table register.
  Tracked here as in-flight for three runs. Still owed: a `lib/blogSocialContent.ts` entry (the
  discarded draft's assets can't be reused, their quotes are gone with the prose).
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
  away, plus an FAQ row on the `/tarot-birth-card` hub.
- **"Tarot numerology number meanings" (the 1–9 table).** tarotmasterguide, hiddennumerology and
  numerologist.com all run a "tarot numerology" guide that is really a number-meanings table, and
  they are competing on our cornerstone term. Not a post (blog-01 and blog-02 own the term with
  better content), but the vocabulary is worth folding into blog-02 if it is ever revised.
- **The four suits and the four elements** (its own entry above, same reason).
- **The three missing `lib/blogSocialContent.ts` entries** (blog-12, blog-13, blog-14). Not a
  topic, a finished-work item, and now three posts deep.
- **A blog link from the `/month/[ym]` pages.** Fourth week verified as absent, on the page type
  earning the largest share of the site's clicks. If the collective-month post above is written it
  becomes the obvious target; if it isn't, blog-02 should be linked there anyway.

## Deliberately not proposed

- **"The card you can never have" / the Tower year.** Surveyed 2026-09-14 because the emotional
  intent is real and heavily searched (tarot.com runs a dedicated "Personal Tarot Card of the
  Year: The Tower" page, Archetypal Tarot runs one per card, and the general Tower-and-Death
  reassurance SERP is enormous). The angle that looked new — that the reduced method can never
  hand you the Tower, Death, the Devil, the Star or the World, thirteen of the twenty-two — **is
  already written, twice.** blog-11 line 15: "None of your years is a Death year or a Tower year.
  The Star doesn't come." blog-11 line 51: "Nine cards report for duty, thirteen never get
  called." blog-10 line 11 does the same for months. A post here would cannibalize the two
  siblings it came from. One fact found while checking is worth keeping for whoever writes about
  the year card next: for a March 15 birthday, the Almanac's Tower year in 1990–2060 is **1991
  and nothing else**, because it needs a birth-year digit sum of exactly 20; the next is 2099.
- **The moon phase on your birthday.** Rejected 2026-09-07 on two counts, both still standing.
  `moonPhase()` in `lib/almanac.ts` picks the *nearest* cardinal phase and so prints "New moon /
  First quarter / Full moon / Last quarter" on exactly 50.0% of days, disagreeing with every site
  a reader would check against (20 July 1969 reads "First quarter" here, "waxing crescent"
  everywhere else). The larger count is that the whole term is personality correspondence, and
  the Almanac derives no meaning from the moon at all.
- **Anything targeting "tarot birth card" head-on.** Re-confirmed this week and it got worse, not
  better: `/tarot-birth-card` is at pos 72.2 on the head term, page 8, zero clicks, and
  `docs/SEARCH_PERFORMANCE.md` retracted the "it probably ranks on Bing" hypothesis after checking
  live Bing SERPs. It is a both-engines authority problem. A third page of ours would make it
  worse. (Note the page itself converts: 31 visitors, 17 calculator runs, 55%.)
- **A dated month post** (e.g. "October 2026 tarot"). The `/month/[ym]` pages own that term and
  are the site's best performer on it — `/month/2026-10` is at pos 11 and climbing right now. A
  blog post on the same dated ground would split the signal on the one thing currently working.
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
