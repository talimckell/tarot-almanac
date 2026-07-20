# Blog ideas — ranked backlog

Maintained by the weekly Blog Topic Scout (Search stage of the `blog` skill). Propose-only:
nothing here is written, illustrated, or published without an owner decision.

**State as of 2026-07-20, verified against `lib/blog.ts` and `content/`:**

- **Published (7):** what-is-tarot-numerology, how-tarot-numerology-works,
  the-shadow-and-the-reclaiming, what-is-a-tarot-bearing, the-tarot-natal-chart,
  major-arcana-three-stages, tarot-birth-card.
- **Dormant scaffold (1):** `blog-06-2027-tarot-year-card.md` — still carries SCAFFOLD
  comments, 499 words, entry commented out. Aim noted in the registry: live by mid-Oct 2026.
- **Drafted, not registered live (1):** `blog-09-life-path-number-tarot.md` — full 1,057-word
  draft, entry commented out, awaiting owner voice review and one Illustrate deliverable
  (`/life-path-ceiling.svg`).
- **Unregistered draft (1):** `content/drafts/every-us-presidents-bearing.md` — 2,976 words,
  no `lib/blog.ts` entry, no `content/blog-NN-` filename.

Ground already covered by the published set: what tarot numerology is, the year/month/day
formula, reversals as shadow/reclaiming, the Bearing, the natal chart, the Fool's Journey in
three stages, and the Personality/Soul birth card. A new topic has to sit outside those.

---

## Your 2027 Tarot Year Card: The Year of Justice
- Status: in-flight (dormant scaffold, `blog-06-2027-tarot-year-card.md`, 499 words, SCAFFOLD comments intact)
- Intent: seasonal and predictive. Searchers want the card everyone shares next year, what a
  Justice year asks of them, and their own personal card for it.
- Head term: "2027 tarot year card" (+ "tarot card for 2027", "what tarot card rules 2027",
  "universal year card 2027", "Justice year meaning")
- Competition & gap: Justice is already the consensus answer on the SERP, and tarot.com holds
  the annual slot with a "Ruling Tarot Card of 2026: The Wheel of Fortune" page it re-cuts every
  year. Two real gaps. Incumbents treat the universal card as vibes and stop; nobody shows the
  arithmetic that produces it, and nobody gives the month-by-month walk. Second, the term is
  barely contested this early — publishing before the autumn wave is the whole play.
- Internal links: how-tarot-numerology-works (the formula), what-is-tarot-numerology,
  major-arcana-three-stages (Justice sits in Testing), tarot-birth-card. Product path is
  strong: the year-card calculator and the paid year-ahead reading are already shipped.
- Priority: **high** — the only candidate with a hard calendar window, it's half-scaffolded
  already, and it lands on a funnel the site has already built.

## Your Life Path Number and Your Tarot Card
- Status: in-flight (drafted 2026-07-17, entry commented out, awaiting voice review + figure)
- Intent: crossover. Searchers who know their numerology life path number and want the tarot
  card it maps to.
- Head term: "life path number tarot card" (+ "life path 7 tarot card", "what tarot card is my
  life path number", "numerology tarot birth card")
- Competition & gap: heavily served by generic numerology sites doing the flat 1–9 mapping. The
  draft's gap is the ceiling argument (a single digit reaches nine of twenty-two Majors, master
  numbers patch back two) — an angle the incumbents don't make because it undercuts them.
- Internal links: what-is-tarot-numerology, tarot-birth-card, how-tarot-numerology-works,
  what-is-a-tarot-bearing, the-tarot-natal-chart. All already wired in the scaffold's linkMap.
- Priority: **high** — nearest to shipping of anything here; blocked only on an owner read and
  one SVG, not on new writing.

## What Tarot Card Is Your Zodiac Sign?
- Status: idea
- Intent: identity lookup. Someone knows their sun sign and wants the Major Arcana card that
  goes with it. High-volume, low-effort entry point.
- Head term: "tarot card for your zodiac sign" (+ "what tarot card represents Scorpio",
  "zodiac signs and their tarot cards", "major arcana astrology correspondences")
- Competition & gap: crowded, and the crowd includes tarot.com and a wall of deck-shop blogs.
  But every one of them ships the same twelve-row table and stops. Two openings: only twelve of
  the twenty-two Majors are reachable through sun signs at all (the same reduction-ceiling
  argument the life-path post makes, in a different costume), and nobody connects the sign-based
  card to a birthday-based one, which is the bridge straight to the Bearing. Their vocabulary to
  cover for topical completeness: cardinal/fixed/mutable, decans, sun-moon-rising as three cards,
  planetary rulers.
- Internal links: tarot-birth-card, what-is-a-tarot-bearing, major-arcana-three-stages,
  what-is-tarot-numerology.
- Priority: **medium-high** — biggest uncovered audience adjacent to the site, and the deck-ceiling
  angle is genuinely ours. Discounted only because the head term is a fight against strong domains.

## Tarot Birth Card Compatibility: What Two Birthdays Say Together
- Status: idea (product-blocked)
- Intent: relational. Two people, two birthdays, one question about the pair.
- Head term: "tarot birth card compatibility" (+ "tarot compatibility by birthday", "what do our
  birth cards say about us", "tarot soulmate card calculator")
- Competition & gap: real demand and unusually weak incumbents — Quora threads, a 2017 WordPress
  series, and tarot.com's per-card compatibility pages that read like sun-sign filler. Nobody
  computes anything on two dates; they look up one card and describe it. A deterministic
  two-birthday result would be visibly different in kind. Their vocabulary: personality/soul card
  pairs, "same element = compatible", "birth card matches", destiny-card special connections.
- Internal links: tarot-birth-card, what-is-a-tarot-bearing, the-tarot-natal-chart.
- Priority: **medium** — best competitive position on the board, but it wants the banked
  compatibility engine behind it. A post promising a pair reading with no tool to run is a worse
  post than waiting. Revisit as soon as that engine is scoped.

## Every US President's Bearing
- Status: idea (draft exists at `content/drafts/every-us-presidents-bearing.md`, 2,976 words,
  unregistered — no `lib/blog.ts` entry, not on the `content/blog-NN-` naming convention)
- Intent: not search. Link-bait and brand-vocabulary seeding: a data post that demonstrates the
  Bearing on 45 public birthdays.
- Head term: none worth chasing. Incidental long-tail on "[president] tarot birth card".
- Competition & gap: no competition because it isn't a search category. The value is that it's
  linkable and it teaches the word "Bearing" to people who arrived for the history.
- Internal links: what-is-a-tarot-bearing, how-tarot-numerology-works, the-tarot-natal-chart.
- Priority: **medium** — strong for the authority plan's link/brand-search proxies, weak for
  direct traffic. It's also nearly twice the length of every sibling post, so it needs an owner
  call on whether to cut it down or let it run long as a deliberate one-off.

## What Does It Mean If Your Card Repeats?
- Status: idea
- Intent: post-hoc curiosity from people already using the site — they noticed the same Major
  keeps landing and want to know whether it means something.
- Head term: "same tarot card keeps appearing" (+ "why do I keep getting the same tarot card",
  "repeating tarot cards meaning")
- Competition & gap: the SERP is entirely shuffle-based readers giving mystical answers about
  the universe repeating itself. A deterministic system can answer this mechanically — repeats
  are a property of the mod-22 wheel and your Bearing, and they're predictable. That's a genuinely
  unowned answer to a question with real volume, and it's on-brand myth-busting.
- Internal links: how-tarot-numerology-works, what-is-a-tarot-bearing, the-shadow-and-the-reclaiming.
- Priority: **medium** — distinctive and cheap to write from existing math, but it serves retention
  more than acquisition. Needs the numbers verified against `lib/almanac.ts` before drafting.

## Why Strength Is 8 and Justice Is 11
- Status: idea
- Intent: informational, for people who hit the discrepancy between two decks and want to know
  which is right.
- Head term: "Strength 8 or 11 tarot" (+ "why is Justice 11", "Rider-Waite vs Marseille card
  order", "Golden Dawn tarot order")
- Competition & gap: served competently by tarot-history sites and forums. We'd add little on the
  history itself. The one thing we own is that the site had to *pick*, and the pick changes what
  your cards are — the swap is arithmetically load-bearing here in a way it never is for a shuffle
  reader.
- Internal links: how-tarot-numerology-works, major-arcana-three-stages, what-is-tarot-numerology.
- Priority: **low** — narrow audience, and the answer is already well covered. Better as a section
  inside another post than as its own.
