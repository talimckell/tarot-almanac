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
pointing at them. `/birthday/[month-day]` is now 310 page-1 pages with no editorial parent, and
the top-ranked candidate below is the post that would link into all of them.

---


---

## Owner review, 2026-09-14 (after the first pass)

Tali read the first version of this ranking and cut most of it. Recorded here because the
reasoning is a standing filter, not a one-off:

- **"Why Strength is eight and Justice is eleven" — deleted.** "Lame." Removed from the backlog
  entirely rather than demoted.
- **"Your personal day number and your tarot card" — killed permanently, stop proposing it.**
  Her reasons: the card changes every day, and the arithmetic is too complicated to carry a post.
  Moved to *Deliberately not proposed* below so it stops resurfacing. It had ranked first for
  three consecutive weeks, so this is the scout being wrong three times, not once.
- **"The tarot card of the month" — held**, on the grounds that it would compete with pages she is
  already trying to rank for those terms. Kept below with that decision recorded.
- **"Every US President's Bearing" — unsure it brings the right attention**, and she asked directly
  whether there's another angle, suggesting celebrities. That question is answered below, and it
  turned into this week's top pick.

**Decisions, later the same day.** Tali greenlit **two** posts, not one: the celebrity post
**and** the zodiac post, both to be written. **"Your Baby's Card" is deferred** for a careful
think, on a product question she raised from memory and that is verified below: the site gates
looking up a child's information behind having an account.

**What this adds up to as a filter for future runs.** Three of the four cuts share a shape: the
scout keeps proposing posts that are *arguments about method* — a numbering convention, a
divergence in arithmetic, a day-level formula. Those are the posts that are easiest to research and
the hardest to want to read. The two that survived contact (blog-13, blog-14) and the two ranked
highest below are all posts about **a person and a date they care about**. Weight that from now on,
and treat "the math is the story" as a red flag rather than a selling point.

---

## Ranking this week (2026-09-14, post-review)

| | Candidate | Priority | Change |
|---|---|---|---|
| 1 | Who shares your card (famous people by Bearing) | **GREENLIT** | **new**, and picked the same day — write first |
| 2 | Zodiac card vs birthday card | **GREENLIT** | **up from 3** — picked alongside #1, write second |
| — | Your baby's card (newborn / new-parent) | **deferred** | owner wants a careful think; product gate verified below |
| 3 | Every US President's Bearing | medium, on hold | **owner unsure**; superseded by #1 unless she wants both |
| 4 | Compatibility by birthday | high, blocked | still blocked; engine unbuilt (roadmap) |
| 5 | Your 2028 tarot year card | low now, high Aug 2027 | unchanged |
| 6 | Master numbers 11 and 22 | **low** | **down from medium** — same inside-baseball flavor as the deleted entry |
| 7 | The four suits and four elements | low | unchanged, still a paragraph not a post |
| — | The tarot card of the month | **held by owner** | see the entry below |
| — | ~~Why Strength is eight and Justice is eleven~~ | **deleted** | — |
| — | ~~Your personal day number~~ | **killed, do not re-propose** | — |

---

## Who Shares Your Card: Famous People by Bearing
- Status: **GREENLIT 2026-09-14, write first.** This is the celebrity angle Tali asked for, and it absorbs the
  old "Every famous person's Bearing" entry, which sat at low-medium for weeks because Biddy Tarot
  owns its head term. The reframe is what changes the priority: it enters through the *birthday*
  door instead of the *tarot* door.
- Intent: "who shares my birthday." Curiosity, browsing, and the most reliably shareable intent
  in this whole space.
- Head term: **famous people born on my birthday** (+ "celebrity birth card", "who shares my
  birthday", "what tarot card is [celebrity]", "celebrities with my birthday")
- **Competition & gap, surveyed 2026-09-14. The two demand pools don't touch, and that's the
  opening.**
  - The birthday pool is enormous and industrial. famousbirthdays.com is **ranked ~#1015 in the
    US with 14–22M monthly visitors, ~70% of it Google organic**, and it is surrounded by
    playback.fm ("Top 25 Famous People Born on My Birthday"), who2, birthdaybuddies and
    born-today. Every one of them answers the question the same way: here is a list of names.
    **Not one of them tells you what you and those people actually share.**
  - The tarot pool is small and Biddy owns it ("Celebrity Tarot Birth Cards"), with
    cardblueprints doing the same thing in Cardology (playing cards, not Majors). Biddy's page
    states the ceiling in its own words: there are **"only twelve possible combinations"** of
    birth cards, and it observes that most world-changing figures land in just two of them
    (Temperance/Hierophant and Wheel/Magician). A celebrity list that sorts every famous person
    who has ever lived into ten usable buckets is a list that cannot say anything specific.
- **Why this is ours and nobody else's: the Bearing needs no birth year.** That is the single
  fact the whole post rests on, and it is worth more here than anywhere else on the site, because
  the birth year is precisely the fact celebrities hide, dispute, or have wrong on the internet.
  Everyone born on your calendar day has your Bearing, whatever year they arrived — so "who
  shares your card" is answerable for a birthday, exactly, with no research into anybody's age.
  The presidents draft already found the cleanest demonstration of this (Chester Arthur's Bearing
  survives his disputed birth year); the celebrity version is the same mechanic with a subject
  people search 14 million times a month.
- **It points straight at the page type that's winning.** `/birthday/[month-day]` went from 115 to
  310 page-1 pages this week and is the site's ranking engine. This post is the editorial parent
  those 366 pages don't have, and every example in it links to one.
- **The compounding version, which is product work rather than a post, and worth raising
  separately:** a name-per-birthday dataset would let each `/birthday/[md]` page say who else has
  that Bearing. That is the famousbirthdays value proposition, answered in cards. Flagged, not
  proposed: it's a build, and the scout doesn't propose builds.
- No cannibalization: this enters on "famous people born on my birthday," which **no page on the
  site targets**. `/birthday/[md]` owns the dated card terms and this post feeds it. `/bearing`
  owns the term itself and takes the CTA.
- Shape: the question people actually type → the list everyone gives them → what a shared
  birthday actually shares (one number, month plus day) → the celebrity roll, grouped by Bearing,
  a handful per group → the age-lying section, where the method stops needing the disputed fact →
  why twelve buckets can't hold famous people and twenty-two can → find yours.
- Internal links: blog-04 (the Bearing) is the parent, blog-08 for the birth-card method it's
  answering, blog-05 for the chart upsell. CTA to `/bearing`, with in-body links to
  `/birthday/[md]` for each name used.
- Priority: **high.** It is the answer to the question Tali asked, it is a person-and-a-date post
  rather than a method argument, it has no politics in it, it competes with nothing we own, and
  it is the only candidate whose natural internal links point at the 310 pages that just landed on
  page one.

## Your Zodiac Sign's Tarot Card vs the Card Your Birthday Actually Makes
- Status: **GREENLIT 2026-09-14, write second.** Picked alongside the celebrity post. The two are
  a natural pair and should be written in that order: both enter through a door the reader already
  knows (a famous name, a sun sign) and both land on the same place, the specific card a specific
  birthday makes. Cross-link them when the second ships.
- Intent: high-volume curiosity ("what tarot card am I") arriving through the astrology door,
  which is the door most people know.
- Head term: **tarot card for your zodiac sign** (+ "what tarot card represents my zodiac sign",
  "zodiac tarot correspondences", "is my tarot card my sun sign")
- Competition & gap: Labyrinthos, Biddy, Deckaura, PaganGrimoire, masteringthezodiac. Deep,
  well-linked, and they own the correspondence tables outright. Do not try to out-table them. The
  winnable angle is the comparison itself: the sign gives twelve buckets and a month-long window;
  the birthday gives a specific number and a specific card, and the two answers disagree for most
  people. Noted this week that the same correspondence logic is what produces "September's
  collective card is Justice, because Libra." That vocabulary belongs to this entry now that the
  month candidate is held.
- Internal links: blog-01 and blog-08; CTA to `/birthday/[month-day]`, the page type that just
  doubled its page-1 footprint and now carries 310 page-1 pages.
- Shape: the reader's situation (they know their sign, they've been handed "your sign's tarot
  card," and they want to know if that's really their card) → where the correspondence comes from
  and that it's a real, old, deliberate system, attributed fairly → what it can and can't tell you,
  twelve buckets and a month-long window shared with a twelfth of the world → what a birthday makes
  instead, one number, month plus day → the two answers side by side for a worked birthday → why
  they disagree, and what each is actually good for → find yours.
- **Register: historian's mode**, on blog-12 and blog-13's precedent. The reader's question here is
  how a system works and whether it applies to them, not a personal stake, and the post has to
  treat the astrological correspondence fairly rather than as a thing to beat. That fairness is the
  post: Labyrinthos and Biddy are not wrong, they're answering a different question.
- **Before drafting, one thing to verify against the files, not from memory:** whether the site
  anywhere asserts a sign-to-card correspondence of its own. The Almanac derives element per Major
  (`ELEMENT_BY_MAJOR`), not sign per Major, and the calculations doc has drifted on elements before.
  Do not let the post imply we run a zodiac correspondence we don't have.
- Priority: **GREENLIT** — biggest audience on the list and the hardest SERP, which is why it goes
  second rather than first: it borrows authority from astrology rather than building ours, and it
  is better launched into a `/birthday` footprint the celebrity post has already warmed. Frame it
  as the comparison, never as a table.

## Your Baby's Card
- Status: **deferred by the owner, 2026-09-14.** Not rejected: she wants to think about it
  carefully, and flagged from memory that the site gates looking up a child's information behind
  having an account. **Verified against the files, and she's right** — details below, because they
  shape whether this post can exist and what it would have to say.
- Intent: a new or expecting parent, days or weeks in, looking up what their child's birth date
  means. Personal stake, high emotion, and the most gift-shaped intent on this list.
- Head term: **baby birth chart** / **tarot card for my baby's birthday** (+ "what does my baby's
  birth date mean", "newborn numerology", "birth chart gift for newborn")
- Competition & gap, surveyed 2026-09-14, and the two halves are lopsided in our favour:
  - **The gift market is large, commercial and entirely astrological.** Etsy runs whole categories
    ("newborn astrology," "baby birth chart," "personalized birth chart book"), Amazon sells
    framed natal-chart prints as newborn gifts, Gossby sells nursery wall art, and several sellers
    bundle a "destiny matrix" numerology reading with the chart. People already pay for a
    personalized chart as a baby present. That demand is proven by transactions, not keyword tools.
  - **The tarot half is unclaimed.** Searching the baby framing returns the same generic birth-card
    calculators (Parade, tarot.com, HowStuffWorks, Flickerdeck) with nothing written for a parent.
- **The product gate, verified 2026-09-14 (this is the thing to think about).** `MIN_AGE = 16` in
  `lib/today.ts:20`, and it is applied unevenly on purpose:
  - **Anonymous visitor: refused.** `parseBirthday()` runs with `allowAnyAge = false`, so an
    under-16 birthday is treated as though no birthday were entered at all.
    `app/today/actions.ts:24` silently drops it, and `BirthdayRevealForm.tsx:40` says
    **"You need to be 16 or older for your own daily reading."**
  - **Signed-in account holder: allowed.** The same function takes `allowAnyAge = true` for a
    signed-in lookup, with the comment stating the intent outright: the account holder can check
    the day "for a minor in their care."
  - **Saved charts: allowed, no floor at all.** `createChart` in `app/me/actions.ts` applies no age
    check to the chart's subject; the 16+ test there is only ever run against the account holder's
    *own* profile birthday.
  - The legal copy backs all of it twice. Terms §2 sets the 16+ account floor and §4 covers
    entering someone else's data ("or, if they are a minor in your care, that you are their parent
    or legal guardian"); Privacy §8 explains the 16 as clearing COPPA and the strictest EU
    GDPR age, and says plainly that the minimum "does not prevent an account holder from saving a
    chart for a minor in their care (for example, a parent saving a chart for their child)."
- **So the product does support the post — through exactly one door.** A parent can absolutely make
  their baby's chart; they have to have an account to do it. The friction is that the free,
  anonymous path is the first thing a parent from a search result would try, and what it tells them
  is "You need to be 16 or older for your own daily reading," which reads as a refusal rather than
  as a signpost toward the thing that *is* allowed. Sending newly-acquired, emotionally invested
  search traffic straight into that sentence is the risk, and it's a copy-and-funnel question
  before it's an editorial one.
- **The other thing to weigh, and it isn't technical.** The voice doc bans predicting events, and a
  post about a baby is the easiest place on the site to slide into telling a parent who their child
  will become. The honest version reads the day, not the person: the card the world was standing on
  when they arrived, the Bearing they'll carry, the gap between their column and everyone else's.
  That's also what separates it from the Etsy listings, which promise personality.
- Register: kitchen-table friend, on blog-14's precedent.
- Cannibalization: keep the seoTitle, H1 and slug off "tarot birth chart," which is
  `/tarot-birth-chart`'s term. Enter on the **baby/newborn** framing, which no page of ours targets.
- Internal links: blog-05 (the natal chart) is the parent, blog-13 (the card of the year you were
  born) is the direct sibling and is the same subject from the child's side, blog-04 for the
  Bearing. CTA to `/tarot-birth-chart` or the gift flow.
- Priority: **deferred, and worth returning to.** It has the highest purchase intent on the list
  and points at the $12 giftable chart rather than a free calculator. What it needs first is a
  decision about that one sentence in the anonymous form, not more research.

## Every US President's Bearing
- Status: **in-flight but on hold.** `content/drafts/every-us-presidents-bearing.md`, uncommitted,
  2,976 words, last edited 2026-09-11 after eight weeks parked. **Owner is unsure it brings the
  right attention** (2026-09-14).
- Intent: not a search play. Link bait, brand-vocabulary seeding, and a public demonstration that
  the Bearing is arithmetic anyone can check.
- The concern, stated plainly: it is a political piece on a site whose other fourteen posts are
  not, and its lead reads a sitting president's card as being about accountability. Whatever its
  merits, it invites a kind of attention the rest of the site doesn't.
- **The other angle, which is #1 above.** The celebrity version keeps everything that makes the
  presidents piece work — a roll of known birthdays, the year-free Bearing, the disputed-birth-year
  proof — and swaps the subject for one with 14M monthly searches behind it and no politics in it.
  Chester Arthur's disputed birth year becomes any celebrity who shaves five years off their age.
- Three ways to play it, and it's Tali's call:
  1. **Shelve the presidents piece** and write the celebrity version. The draft's mechanics are
     reusable even if none of its prose is.
  2. **Write the celebrity version first**, and hold the presidents piece as a follow-up once the
     Bearing has a bigger public footprint and the site has more to lose from a quiet week than
     from a loud one.
  3. **Ship both**, celebrities first, presidents as the sequel that borrows its authority.
- Priority: **medium, and not the recommendation this week.** Recorded rather than dropped,
  because 2,976 words already exist and somebody sat down with them three days ago.

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
- **Changed 2026-09-14:** the Justice-at-8-versus-11 thread this entry used to hold was written up
  as its own candidate and **deleted by the owner as "lame."** That is a signal about this entry
  too: it is the same flavour of post, an argument about a numbering convention, aimed at readers
  who already know what a master number is. What's left here is thinner than it looks.
- Internal links: blog-09 (life path) is the direct parent and should link here; blog-08, blog-02
  and blog-12 all touch it. blog-12 owns the *year* fold, this owns the *life path* fold.
- Priority: **low** (down from medium) — low effort and it slots into the sibling series, but it is
  a method argument on a narrow long-tail term, which is precisely the shape the 2026-09-14 review
  cut three times in one sitting.

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

## The Tarot Card of the Month, and Where It Comes From
- Status: **held by the owner, 2026-09-14.** Her read: it would compete with pages she's already
  trying to rank for those terms.
- **One clarification the scout owes, since it may change the call, and then the decision stands.**
  The proposal was not a dated post. `/month/[ym]` owns the dated terms ("september 2026 tarot"),
  and a dated post was already on the *deliberately not proposed* list for exactly the reason she
  gave. The proposed post targets the evergreen method term ("tarot card of the month," "what
  tarot card represents each month"), the same personal-vs-collective split blog-13 drew for the
  year, and its main job was to be the first blog link `app/month/` has ever carried. If the worry
  is that the two are closer than that split admits, that's a fair read and the entry stays held.
- The research, kept so it isn't re-done: **OMTimes Magazine** runs a monthly "Tarot Arcana"
  series deriving a collective card for the calendar month with **our exact formula**. Their
  August 2026 piece prints it: "2 + 0 + 2 + 6 = 10. The number of the month: 8. The final result:
  18," the Moon. Verified against `lib/almanac.ts`: they agree with us on **all twelve months of
  2026**, and diverge from **December 2027** onward, when totals cross 22 and their method reduces
  where ours wraps (2027: 1 divergence, 2028: 2, 2029: 3, 2030: 0).
- Priority: **held.** Not re-proposed next week unless Tali reopens it.
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
- **The under-16 message on the anonymous birthday form.** Found while verifying the baby entry:
  `BirthdayRevealForm.tsx:40` tells a visitor "You need to be 16 or older for your own daily
  reading," which is accurate for the account floor and silent about the thing the product
  actually allows — a signed-in account holder can look up a minor in their care, and can save
  that child's chart with no age floor at all (Terms §4, Privacy §8, `createChart`). One sentence
  pointing there would turn a dead end into the sign-up it's already entitled to. Blocks nothing
  today; it would matter the moment a post sends parents at it.
- **A blog link from the `/month/[ym]` pages.** Fourth week verified as absent, on the page type
  earning the largest share of the site's clicks. With the collective-month post held, the fix is
  no longer waiting on a topic decision: **link blog-02 from `app/month/` and be done with it.**

## Deliberately not proposed

- **Your personal day number and your tarot card. Killed by the owner on 2026-09-14; do not
  propose it again.** Her reasons, recorded because they generalise: the card changes every day,
  and the arithmetic is too complicated to carry a post. Worth noting that this entry ranked
  **first for three consecutive weeks** on the strength of its argument (9 values vs 22 Majors in
  one month, the Minor underneath, the Bearing gap holding at day level) and none of that moved
  her, because the reader-facing promise underneath it was "here is a harder sum." The research is
  in the 2026-09-07 revision of this file if it is ever wanted for a section inside another post.
- **"Why Strength is eight and Justice is eleven."** Proposed 2026-09-14, deleted the same day.
  The history is well documented, the swap is genuinely load-bearing here, and none of that makes
  it a post anyone wants to read. blog-01 line 33 already carries the two sentences it needs.
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
