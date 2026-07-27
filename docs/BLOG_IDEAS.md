# Blog ideas — ranked backlog

The blog's topic backlog, maintained by the weekly Blog Topic Scout (see
`.claude/skills/blog/SKILL.md`, Stage 2). Newest survey notes at the bottom.
Entry format is the skill's. **Propose-only** — the owner (Tali) decides what gets
written; nothing here is a commitment.

**What's already published** (uncommented in `lib/blog.ts`, so a new topic must fill
a real gap, not duplicate one):
blog-01 What Is Tarot Numerology · blog-02 How Tarot Numerology Works (the formula) ·
blog-03 The Shadow and the Reclaiming (reversed cards) · blog-04 What Is a Tarot
Bearing · blog-05 Your Tarot Natal Chart · blog-07 The Major Arcana in Three Stages
(the Fool's Journey) · blog-08 Tarot Birth Card (Personality/Soul method) ·
blog-09 Life Path Number and Your Tarot Card.

The whole cluster threads the cornerstone term **"tarot numerology"**, and the SEO
lesson from the search log holds: **proprietary, uncontested pages rank; generic
`/tarot/*`-style fights don't.** Favor topics that bridge to a page the site already
owns (a calculator, a `/birthday` or `/month` hub) over topics that pit us against
Biddy Tarot / Labyrinthos on a bare head term.

---

## Your Personal Month Tarot Card
- Status: idea
- Intent: someone wants the tarot card for *this month* (a shorter forecast than the
  year card), and how it's found from their birthday. Commercial-adjacent: they're
  in a "what's my card right now" mood, one step from the daily almanac.
- Head term: "personal month tarot card" (+ "tarot card of the month", "personal
  month number meaning", "how to calculate your month card")
- Competition & gap: the SERP for "personal month" is owned by pure-**numerology**
  sites (numerologist.com, astronumero, worldnumerology) that reduce to a single 1–9
  digit and never reach a real tarot card. Aeclectic bundles birth/year/month cards
  in one old page. **Nobody does a proper tarot month card across all 22 Majors** —
  which is exactly what the site already computes. The `/personal-month-card`
  calculator + 22 per-Major SEO pages already exist (per the month-card funnel),
  and per-Major month copy already lives in the card JSONs
  (`positionReadings.positions.ongoingPersonalMonth`). This post is the missing
  explainer that anchors that cluster and was already flagged open ("blog-10
  explainer still open").
- Internal links: blog-02 (How Tarot Numerology Works — the formula it extends),
  blog-01 (What Is Tarot Numerology), and the personal-year cluster / blog-06 once
  live; CTA → the `/personal-month-card` calculator, then the subscription.
- Priority: **high** — real content gap on a term the site is uniquely built to own,
  an existing calculator + 22 pages to link into, and it completes the
  year → month funnel. Winnable long-tail, on the numerology spine.

## Your Tarot Card by Zodiac Sign (astrology vs. numerology birth card)
- Status: idea
- Intent: "which tarot card is my zodiac sign" — a huge, evergreen identity query.
  Searchers conflate the astrology correspondence (Aries → Emperor) with the
  numerology birth card and don't know they're two different systems.
- Head term: "tarot card for your zodiac sign" (+ "which tarot card is my sign",
  "zodiac tarot cards", "major arcana zodiac signs")
- Competition & gap: contested — Labyrinthos, Pagan Grimoire, deckaura, Dark Forest,
  tarostarot all rank with the standard 12-sign → Major table. The **gap** is that
  every one of them gives the astrology mapping in isolation. None sets it beside the
  *numerology* birth card and explains why one person has two different "cards," which
  is the site's whole thesis (date → card by arithmetic, not sign). A post that
  grants the standard table a paragraph, then reclaims the query for the Almanac's
  method, adds topical coverage competitors lack.
- Internal links: blog-08 (Tarot Birth Card), blog-09 (Life Path Number), blog-02
  (the formula); CTA → `/tarot-birth-chart` or `/bearing`.
- Priority: **medium-high** — highest-volume head term in the set and a genuine
  framing gap, but the most contested SERP here; win it on the side-by-side angle,
  not by out-ranking Labyrinthos on the bare table. Slightly off the pure-numerology
  spine, so title carefully.

## Tarot Birth Card Compatibility (the Bearing between two people)
- Status: idea (depends on the compatibility engine)
- Intent: two people want to know what their birth cards say about them together —
  strong emotional + shareable + gift intent.
- Head term: "tarot birth card compatibility" (+ "tarot compatibility calculator",
  "arcana compatibility", "birth card relationship")
- Competition & gap: a busy commercial SERP (tarot.com, deckaura, mysticnova,
  loveproject, sevenreflections) that leans on elemental/archetype pairings. The
  Almanac's differentiator is the **Bearing as a distance between two people** —
  deterministic, and it already has the lineage/family angle banked as Tali's own
  differentiation idea. But the post is far stronger once a compatibility *engine /
  calculator* exists to point at; as prose alone it's weaker than the month-card
  post, which has its calculator already live.
- Internal links: blog-04 (What Is a Tarot Bearing), blog-08 (Birth Card), blog-05
  (Natal Chart); CTA → a future compatibility page.
- Priority: **medium** — differentiated and high-intent, but gated on building the
  product it should link to. Revisit when the compatibility engine is scoped.

## The Four Tarot Suits and Their Elements
- Status: idea
- Intent: beginner reference — "what do the tarot suits mean," Wands/Cups/Swords/
  Pentacles and their elements.
- Head term: "tarot suits meaning" (+ "tarot suits elements", "minor arcana suits")
- Competition & gap: very high volume but owned by Biddy Tarot, HowStuffWorks,
  thetarotguide — the same multi-year generic fight the `/tarot/*` pages already lose
  (per the search log). The one proprietary hook is that the Almanac tethers the
  **day card's minor suit to the day-Major's element** (Fire→Wands, etc.), which no
  competitor frames as a *system*. Not enough on its own to win the head term.
- Internal links: blog-02, blog-03, the `/tarot` index.
- Priority: **low** — generic, contested, off the site's proprietary strengths.
  Only worth it framed narrowly around the element-tether mechanic, not as a
  general suits explainer.

## Your 2027 Tarot Year Card (Justice)
- Status: in-flight (dormant scaffold — `content/blog-06-2027-tarot-year-card.md`
  exists with SCAFFOLD comments; the `lib/blog.ts` entry is commented out; math and
  card names already node-verified in the scaffold). Aim live by mid-October 2026.
- Intent: seasonal — "2027 tarot card" / "tarot year card 2027," searched ahead of
  the new year (the search log shows next-period pages, e.g. `/month/2026-08`, are
  the seasonal winners).
- Head term: "2027 tarot year card" (+ "tarot card for 2027", "collective year card")
- Competition & gap: year-specific guides appear yearly (tarostarot's 2026 guide,
  tarot.com's calculator). Publishing the 2027/Justice piece *before* the season
  claims the term early; the collective-year framing (one card everyone shares) is
  the site's own angle.
- Internal links: blog-02, blog-01; CTA → `/today` and the personal-year calculator.
- Priority: **high but time-boxed** — this is a calendar play; its value is in
  shipping ahead of the mid-Oct window, so it should land before the evergreen ideas
  above if the season is close. Prose still to be written in voice.

## Every US President's Bearing (data / authority post)
- Status: in-flight (draft exists at `content/drafts/every-us-presidents-bearing.md`;
  not yet in `lib/blog.ts`, not a `content/blog-NN-*.md`).
- Intent: link-bait / authority — a data study that demonstrates the Bearing on 45
  known public birthdays. Serves brand-search and inbound links more than a single
  head term.
- Head term: long-tail / novelty ("presidents tarot", "[president] birth card") plus
  the topical-authority halo around "tarot Bearing."
- Competition & gap: essentially uncontested — nobody has run this dataset. Strong
  differentiation for the deterministic method (year drops out, so birth-year disputes
  don't touch the result — a point the draft already makes).
- Internal links: blog-04 (What Is a Tarot Bearing) as the anchor; CTA → `/bearing`.
- Priority: **medium** — excellent authority/links asset and already drafted, but not
  a search-volume play; sequence it as a brand/PR beat, not as the cluster-filling
  next post.

---

### Survey notes — 2026-07-27 (first backlog build)

- No `docs/BLOG_IDEAS.md` existed before today; this is the initial ranked backlog.
- SERP sweep (WebSearch, Ahrefs not connected) across year-card, personal-month,
  zodiac-correspondence, compatibility, and suits queries. The clearest **gap** is
  the personal **month** card: the whole first page is single-digit numerology with
  no real tarot card, while the site already computes all 22 Majors and has the
  calculator + pages live. That's the rare "uncontested + proprietary + already
  half-built" combination the SEO plan favors.
- Zodiac correspondence is the biggest head term but the most contested; only worth
  entering on the astrology-vs-numerology side-by-side framing.
- Two items are already in motion and should not be re-proposed as net-new: the 2027
  Justice scaffold (blog-06) and the drafted Presidents' Bearing data post.
