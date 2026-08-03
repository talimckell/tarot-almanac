# Blog ideas — ranked backlog

Maintained by the weekly Blog Topic Scout (the blog skill's Search stage). Proposals only:
nothing here is a decision, and no prose gets written until Tali picks one.

Entry format is the one defined in `.claude/skills/blog/SKILL.md`. Newest survey at the top of
the log at the bottom.

**Last surveyed:** 2026-08-03 (first run).

---

## Where the blog stands (verified against `lib/blog.ts` and `content/`, 2026-08-03)

**Published — 9 posts**

| Post | Slug | Head term it owns |
|---|---|---|
| What Is Tarot Numerology? | `what-is-tarot-numerology` | tarot numerology (cornerstone) |
| How Tarot Numerology Works | `how-tarot-numerology-works` | the formula / year-month-day calculation |
| The Shadow and the Reclaiming | `the-shadow-and-the-reclaiming` | reversed tarot card meanings |
| The Major Arcana in Three Stages | `major-arcana-three-stages` | the Fool's Journey / Initiation-Testing-Reckoning |
| What Is Your Tarot Birth Card? | `tarot-birth-card` | Personality & Soul card *method* (head term belongs to the hub) |
| Your Life Path Number and Your Tarot Card | `life-path-number-tarot` | life path number tarot |
| What Is a Tarot Bearing? | `what-is-a-tarot-bearing` | tarot Bearing (proprietary) |
| Your Tarot Natal Chart | `the-tarot-natal-chart` | tarot natal chart / tarot birth chart |
| Your Personal Month Number and Your Tarot Card | `personal-month-number-tarot` | personal month number |

**Dormant scaffold — 1**

- `blog-06-2027-tarot-year-card.md` → **in-flight**, entry commented out in `lib/blog.ts`, 499 words
  of scaffold with the math and the month table already node-verified. Target in the file comment is
  "live by mid-October 2026." See the timing note in its entry below.

**Ground already held on the site (not the blog), so a post must not fight it:** `/tarot-birth-card`,
`/tarot-birth-chart`, `/personal-year-card` (+ 22 slugs), `/personal-month-card` (+ 22 slugs),
`/bearing`, `/birthday/[md]` (366), `/month/[ym]`, `/today`.

The established anti-cannibalization pattern (blog-08, blog-10): **the hub owns the tarot head term
and the calculator intent; the blog post owns the numerology head term and the method comparison at
full length.** Every candidate below is scored against that split.

---

## Your Personal Year Number and Your Tarot Card

- Status: idea
- Intent: someone who already has a numerology personal year number (1–9) and wants to know which
  tarot card it points to and what the year holds. Informational, with strong commercial adjacency:
  the year-ahead reading is a paid product.
- Head term: **personal year number** (+ "personal year number tarot card", "how to calculate your
  personal year number", "what is my personal year number 2026")
- Competition & gap: the SERP is owned by numerology calculators (numerologist.com, astro-seek,
  astrala, karisamuels) plus a big-brand explainer at almanac.com and an AOL syndication. All of them
  stop at the single digit and a paragraph of 1–9 meanings. None of them carry the reduction through
  to a card, and none acknowledges that folding to one digit means a personal year can only ever
  reach nine of the twenty-two Majors and repeats every nine years. That is exactly the argument
  blog-09 and blog-10 already make, and it is unclaimed at the *year* level.
- Internal links: blog-10 (`personal-month-number-tarot`) already links out to `/personal-year-card`
  and would gain a sibling link; blog-09 (`life-path-number-tarot`) and blog-01 both carry the
  "why reduction can only reach half the deck" anchor. Reciprocal slot is empty and waiting:
  `/personal-year-card`'s "Related:" line currently links only to `/personal-month-card`, while
  `/personal-month-card` already links to blog-10.
- Priority: **high** — it completes the proven numerology-sibling trilogy (life path → personal month
  → personal year), the hub it feeds already puts six pages on page one, and the reciprocal-link slot
  is the only one in the funnel still empty.
- Watch: keep the `seoTitle`/H1/slug on "personal year **number**", never "personal year card" —
  that phrasing belongs to the hub. And keep it off "2027", which belongs to blog-06.

## Your 2027 Tarot Year Card (blog-06 scaffold)

- Status: **in-flight** (scaffold written, entry commented out in `lib/blog.ts`)
- Intent: seasonal. "What's the tarot card for 2027, and what's mine?" Peaks November through January.
- Head term: **2027 tarot card** (+ "tarot card of the year 2027", "2027 numerology year",
  "what is my 2027 tarot card")
- Competition & gap: thinner than the 2026 equivalent, but **not empty — a competitor is already
  live**. tarostarot.com has both a 2027 guide post and a dedicated "Tarot Card of the Year 2027"
  landing page indexed now. The 2026 version of this SERP is held by Parade, AstroTwins and Yahoo,
  so expect those to arrive for 2027 in the autumn. The gap the Almanac can own is the same one it
  always owns: the whole year is *fixed and checkable*, so the post can hand over all twelve
  collective month cards for 2027 (the scaffold's table, already verified) instead of one card and
  vibes. Nobody else publishes a year's worth of dated cards.
- Internal links: blog-01 and blog-02 (the method), `/month/2027-01`…`/month/2027-12` (the month
  hub pages the post can feed directly), `/personal-year-card`.
- Priority: **high, but on a clock** — this is a decision about timing more than topic.
  **Recommend pulling the target forward from mid-October to mid-September.** The evidence is in
  `docs/SEARCH_PERFORMANCE.md`: `/month/2026-08` took roughly three weeks from first appearance to
  page one, and the site's next-month pages consistently show people searching ahead of the date.
  Publishing mid-October leaves almost no indexing runway before the November spike.
- Note: 11 is a master number and 2027 is where the Strength/Justice question below actually bites,
  since everyone's year card that year is card eleven. The two posts want to ship in that order.

## Strength Is 8, Justice Is 11 (Why Your Card Number Depends on the Deck)

- Status: idea
- Intent: someone got a different card than a friend or another calculator gave them and wants to
  know who is right. Also the perennial deck-buying question.
- Head term: **strength and justice tarot swap** (+ "why is strength 8 in some decks", "justice 11
  or 8 tarot", "Marseille vs Rider-Waite card order")
- Competition & gap: the SERP here is mostly forum threads (tarotforum.net has an unresolved
  "Year Card being 11... Strength or Justice?" thread) and small personal blogs
  (parsifalswheeldivination, clavielle, 3amtarot). Real informational demand, no authoritative,
  well-built page. Every incumbent explains the history and stops. Nobody connects it to the thing
  people actually care about, which is that the swap silently changes *which card a date resolves
  to* in any numerology system. The Almanac has a settled answer (Golden Dawn order, Strength 8 /
  Justice 11) and can show the consequence with real dates rather than argue lineage.
- Internal links: blog-02 (`how-tarot-numerology-works`) and blog-07 (`major-arcana-three-stages`)
  both state the ordering as fact and would gain a "why" link; blog-09 already touches master
  number 11 → Justice; `/tarot/strength` and `/tarot/justice`.
- Priority: **medium-high** — genuinely winnable (weak incumbents, real questions), it is the most
  distinctively *expert* thing the site could publish, and it sets up 2027 as a Justice year. Lower
  than the two above only because search volume is smaller and less commercial.

## Tarot Birth Chart vs Astrology Birth Chart

- Status: idea
- Intent: comparison shopping. Someone who knows their astrology chart and is deciding whether the
  tarot version is a real thing or a novelty.
- Head term: **tarot vs astrology** (+ "tarot birth chart vs astrology birth chart", "is there a
  tarot equivalent of a natal chart", "do you need a birth time for a tarot chart")
- Competition & gap: crowded but soft. Every ranking piece (Aurae, TarotFarm, tarot.com, NYLON)
  runs the same framing: astrology is fixed and calculated, tarot is fluid and intuitive, "they're
  complements, not competitors." That framing is the opening. The Almanac's entire premise is a
  tarot chart that is fixed, calculated, and reproducible, with no birth time required. There is a
  real, specific argument to make here that no incumbent can make, and it lands on the highest-value
  page on the site.
- Internal links: blog-05 (`the-tarot-natal-chart`) is the natural parent and would link both ways;
  blog-04 (the Bearing); CTA to `/tarot-birth-chart`.
- Priority: **medium** — best *positioning* piece in the backlog and it feeds the $12 chart directly,
  but it fights broader, better-resourced pages than the three above and the query is more browse
  than buy.

## The Numbers on the Minor Arcana (Suits, Elements, and the Day's Card)

- Status: idea
- Intent: "what do the numbers on tarot cards mean" — learners working through the other 56 cards.
- Head term: **tarot numerology** (the cornerstone term, on its Minor Arcana half) + "minor arcana
  numbers meaning", "what do the numbers on tarot cards mean", "tarot suits elements"
- Competition & gap: this is where the site's own cornerstone term is being contested. A whole tier
  of sites (elvitarot, tarotmasterguide, jobcannon, numerologist.com, dailytarotreading, Biddy on
  elements) rank for "tarot numerology" with the ace-through-ten framing, and the Almanac's coverage
  of that term is entirely Major Arcana. Defensive value as much as offensive. The gap: those posts
  give a static number-meaning table; the Almanac actually *derives* a minor for every date (suit
  tethered to the day-Major's element, rank from the date seed), so it can show the numbers doing
  work on a real day instead of listing them.
- Internal links: blog-02 (the formula, where the day's minor is introduced), blog-07 (stages),
  `/tarot` index (which needs the internal-link help), `/today`.
- Priority: **medium** — strategically the right defensive move on the cornerstone term, but it is
  the most crowded SERP in the backlog and the `/tarot` index has been stuck at position ~87 on
  exactly this kind of generic query, which is a warning about winnability.

## What Your Birthday Says in Tarot (support post for the `/birthday` hub)

- Status: idea
- Intent: "what tarot card is my birthday" — the broadest, most casual entry point in the space.
- Head term: **birthday tarot card** (+ "what tarot card is my birthday", "tarot card by birth date")
- Competition & gap: heavily incumbent (tarot.com, Labyrinthos, YourTango, Parade, Keen, corax) and
  every one of them is a calculator page. The Almanac already competes here with 366 `/birthday/[md]`
  pages, which are the single biggest source of page-one placements on the site.
- Internal links: blog-08, blog-04, `/birthday`.
- Priority: **low** — real volume, but the hub already serves this intent well and a blog post risks
  the exact two-horse race the blog-08 retitle was fixing. Revisit only if GSC shows the `/birthday`
  cluster stalling.

## Tarot Birth Card Compatibility (two people)

- Status: idea — **blocked on product**
- Intent: "are we compatible" — the highest-volume, most shareable intent in the whole space.
- Head term: **tarot compatibility** (+ "tarot birth card compatibility", "what do our birth cards
  say about us")
- Competition & gap: startlingly thin. The SERP for the specific phrasing returns mostly Wikipedia
  card pages, meaning nobody has built the canonical resource. The astrology equivalent is a
  billion-dollar category. Wide open.
- Internal links: blog-04 (the Bearing is already a *distance* between two columns, which is the
  natural mechanic), blog-05.
- Priority: **low for now, high the moment the engine exists** — writing this before there is a
  compatibility calculator to send people to wastes the best unclaimed term in the space. Park it
  with the banked compatibility-engine idea and promote it when that ships.

## Master Number 22 and the Fool

- Status: idea
- Intent: numerology readers with an 11/22/33 master number who want the tarot equivalent.
- Head term: **master number tarot** (+ "master number 22 tarot card", "life path 11 tarot card")
- Competition & gap: numerologist.com has a dedicated Life Path 11 → Justice page and ranks for it.
  The Almanac's mod-22 wheel has a genuinely neat answer at 22 (it wraps to zero, the Fool), but
  blog-09 already covers master 11 → Justice.
- Internal links: blog-09, blog-02.
- Priority: **low** — too much overlap with blog-09 to justify a whole post. Better as a section
  inside the Strength/Justice piece or an expansion of blog-09.

---

## Survey log

**2026-08-03 (first run).** Created this file. Accounted for 9 published posts and 1 dormant
scaffold against the actual files. Surveyed the SERP for eight candidate areas (personal year
number, 2026/2027 year cards, elements and suits, tarot vs astrology, birth-card compatibility,
master numbers, birthday tarot card, collective card of the day). Dropped "collective card of the
day" before it earned an entry: the space has commoditized fast, and several competitors now
advertise deterministic date-based daily cards in the same language the Almanac uses, so a blog
post there would be late to a crowded, low-intent query. Flagged the 2027 scaffold's mid-October
target as probably too late given the site's observed three-week indexing-to-page-one lag.
